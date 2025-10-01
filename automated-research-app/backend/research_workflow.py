import os
from typing import Dict, List
from langchain_cerebras import ChatCerebras
from langgraph.graph import StateGraph, END
from pydantic import ValidationError
import time

from models import (
    Persona, PersonasList, Questions, InterviewState,
    DEFAULT_NUM_INTERVIEWS, DEFAULT_NUM_QUESTIONS
)

# Initialize LLM
llm = ChatCerebras(
    model="llama3.3-70b",
    temperature=0.7,
    max_tokens=800
)

# General model instructions
system_prompt = """You are a helpful assistant. Provide a direct, clear response without showing your thinking process. Respond directly without using <think> tags or showing internal reasoning."""

def ask_ai(prompt: str) -> str:
    """Send prompt to Cerebras AI and return response"""
    response = llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ])
    return response.content

def configuration_node(state: InterviewState) -> Dict:
    """Get user inputs and generate interview questions"""
    print(f"\n🔧 Configuring research: {state['research_question']}")
    print(f"📊 Planning {DEFAULT_NUM_INTERVIEWS} interviews with {DEFAULT_NUM_QUESTIONS} questions each")

    question_gen_prompt = f"""Generate exactly {DEFAULT_NUM_QUESTIONS} interview questions about: {state['research_question']}. Use the provided structured output to format the questions."""
    
    structured_llm = llm.with_structured_output(Questions)
    questions = structured_llm.invoke(question_gen_prompt)
    questions = questions.questions
    print(f"✅ Generated {len(questions)} questions")

    return {
        "num_questions": DEFAULT_NUM_QUESTIONS,
        "num_interviews": DEFAULT_NUM_INTERVIEWS,
        "interview_questions": questions
    }

def persona_generation_node(state: InterviewState) -> Dict:
    """Generate diverse personas for interviews"""
    num_personas = state['num_interviews']
    demographic = state['target_demographic']
    max_retries = 5

    print(f"\n👥 Creating {state['num_interviews']} personas...")

    persona_prompt = (
        f"Generate exactly {num_personas} unique personas for an interview. "
        f"Each should belong to the target demographic: {demographic}. "
        "Respond only in JSON using this format: {{ personas: [ ... ] }}"
    )

    structured_llm = llm.with_structured_output(PersonasList)

    for attempt in range(max_retries):
        try:
            raw_output = structured_llm.invoke([{"role": "user", "content": persona_prompt}])
            if raw_output is None:
                raise ValueError("LLM returned None")

            validated = PersonasList.model_validate(raw_output)

            if len(validated.personas) != num_personas:
                raise ValueError(f"Expected {num_personas} personas, got {len(validated.personas)}")

            personas = validated.personas
            for i, p in enumerate(personas):
                print(f"Persona {i+1}: {p.name}")

            return {
                "personas": personas,
                "current_persona_index": 0,
                "current_question_index": 0,
                "all_interviews": []
            }

        except (ValidationError, ValueError, TypeError) as e:
            print(f"❌ Attempt {attempt+1} failed: {e}")
            if attempt == max_retries - 1:
                raise RuntimeError(f"❗️Failed after {max_retries} attempts")

def interview_node(state: InterviewState) -> Dict:
    """Conduct interview with current persona"""
    persona = state['personas'][state['current_persona_index']]
    question = state['interview_questions'][state['current_question_index']]

    print(f"\n💬 Interview {state['current_persona_index'] + 1}/{len(state['personas'])} - {persona.name}")
    print(f"Q{state['current_question_index'] + 1}: {question}")

    # Generate response as this persona with detailed character context
    interview_prompt = f"""You are {persona.name}, a {persona.age}-year-old {persona.job} who is {persona.traits}.
Answer the following question in 2-3 sentences:

Question: {question}

Answer as {persona.name} in your own authentic voice. Be brief but creative and unique, and make each answer conversational.
BE REALISTIC – do not be overly optimistic. Mimic real human behavior based on your persona, and give honest answers."""

    answer = ask_ai(interview_prompt)
    print(f"A: {answer}")

    # Update state with interview history
    history = state.get('current_interview_history', []) + [{
        "question": question,
        "answer": answer
    }]

    # Check if this interview is complete
    if state['current_question_index'] + 1 >= len(state['interview_questions']):
        # Interview complete - save it and move to next persona
        return {
            "all_interviews": state['all_interviews'] + [{
                'persona': persona,
                'responses': history
            }],
            "current_interview_history": [],
            "current_question_index": 0,
            "current_persona_index": state['current_persona_index'] + 1
        }

    # Continue with next question for same persona
    return {
        "current_interview_history": history,
        "current_question_index": state['current_question_index'] + 1
    }

def synthesis_node(state: InterviewState) -> Dict:
    """Synthesize insights from all interviews"""
    print("\n🧠 Analyzing all interviews...")

    # Compile all responses in a structured format
    interview_summary = f"Research Question: {state['research_question']}\n"
    interview_summary += f"Target Demographic: {state['target_demographic']}\n"
    interview_summary += f"Number of Interviews: {len(state['all_interviews'])}\n\n"

    for i, interview in enumerate(state['all_interviews'], 1):
        p = interview['persona']
        interview_summary += f"Interview {i} - {p.name} ({p.age}, {p.job}):\n"
        interview_summary += f"Persona Traits: {p.traits}\n"
        for j, qa in enumerate(interview['responses'], 1):
            interview_summary += f"Q{j}: {qa['question']}\n"
            interview_summary += f"A{j}: {qa['answer']}\n"
        interview_summary += "\n"

    synthesis_prompt_template = f"""Analyze these {len(state['all_interviews'])} user interviews about "{state['research_question']}" among {state['target_demographic']} and provide a concise yet comprehensive analysis:

1. KEY THEMES: What patterns and common themes emerged across all interviews? Look for similarities in responses, shared concerns, and recurring topics.

2. DIVERSE PERSPECTIVES: What different viewpoints or unique insights did different personas provide? Highlight contrasting opinions or approaches.

3. PAIN POINTS & OPPORTUNITIES: What challenges, frustrations, or unmet needs were identified? What opportunities for improvement emerged?

4. ACTIONABLE RECOMMENDATIONS: Based on these insights, what specific actions should be taken? Provide concrete, implementable suggestions.

Keep the analysis thorough but well-organized and actionable.

Interview Data:
{interview_summary}
"""

    try:
        synthesis = ask_ai(synthesis_prompt_template)
    except Exception as e:
        synthesis = f"Error during synthesis: {e}\n\nRaw interview data available for manual analysis."

    print("\n" + "="*60)
    print("🎯 COMPREHENSIVE RESEARCH INSIGHTS")
    print("="*60)
    print(f"Research Topic: {state['research_question']}")
    print(f"Demographic: {state['target_demographic']}")
    print(f"Interviews Conducted: {len(state['all_interviews'])}")
    print("-"*60)
    print(synthesis)
    print("="*60)

    return {"synthesis": synthesis}

def interview_router(state: InterviewState) -> str:
    """Route between continuing interviews or ending"""
    if state['current_persona_index'] >= len(state['personas']):
        return "synthesize"
    else:
        return "interview"

def build_interview_workflow():
    """Build the complete interview workflow graph"""
    workflow = StateGraph(InterviewState)

    # Add all our specialized nodes
    workflow.add_node("config", configuration_node)
    workflow.add_node("personas", persona_generation_node)
    workflow.add_node("interview", interview_node)
    workflow.add_node("synthesize", synthesis_node)

    # Define the workflow connections
    workflow.set_entry_point("config")
    workflow.add_edge("config", "personas")
    workflow.add_edge("personas", "interview")

    # Conditional routing based on interview progress
    workflow.add_conditional_edges(
        "interview",
        interview_router,
        {
            "interview": "interview",    # Continue interviewing
            "synthesize": "synthesize"   # All done, analyze results
        }
    )
    workflow.add_edge("synthesize", END)

    return workflow.compile()

def run_research_workflow(research_question: str, target_demographic: str):
    """Execute the complete LangGraph research workflow"""
    workflow = build_interview_workflow()

    # Initialize state
    initial_state = {
        "research_question": research_question,
        "target_demographic": target_demographic,
        "num_interviews": DEFAULT_NUM_INTERVIEWS,
        "num_questions": DEFAULT_NUM_QUESTIONS,
        "interview_questions": [],
        "personas": [],
        "current_persona_index": 0,
        "current_question_index": 0,
        "current_interview_history": [],
        "all_interviews": [],
        "synthesis": ""
    }

    start_time = time.time()
    
    try:
        final_state = workflow.invoke(initial_state, {"recursion_limit": 100})
        total_time = time.time() - start_time
        print(f"\n✅ Workflow complete! {len(final_state['all_interviews'])} interviews in {total_time:.1f}s")
        return final_state
    except Exception as e:
        print(f"❌ Error during workflow execution: {e}")
        raise e