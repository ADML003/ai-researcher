from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import logging
import time
import random

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Automated Research API",
    description="AI-powered user research system with multi-agent workflow",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    research_question: str
    target_demographic: str
    num_interviews: Optional[int] = 10
    num_questions: Optional[int] = 5

class ResearchResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None

# Mock data for testing while we fix the LangChain integration
def generate_mock_research_data(research_question: str, target_demographic: str) -> Dict[str, Any]:
    """Generate mock research data for testing purposes"""
    
    # Generate more dynamic interview questions based on the research question
    question_templates = [
        f"What challenges do you face when dealing with {research_question.lower()}?",
        f"How do you currently approach {research_question.lower()}?",
        f"What would an ideal solution look like for you regarding {research_question.lower()}?",
        f"What tools or methods do you currently use for {research_question.lower()}?",
        f"What frustrates you most about current approaches to {research_question.lower()}?"
    ]
    
    # Generate dynamic personas based on target demographic
    demographic_words = target_demographic.lower().split()
    
    # Create different persona templates based on demographic
    if "developer" in demographic_words or "engineer" in demographic_words:
        persona_templates = [
            {
                "name": "Alex Kumar",
                "age": 29,
                "job": "Frontend Developer",
                "traits": ["Innovative", "Detail-focused", "Collaborative", "Performance-minded"],
                "communication_style": "Direct and solution-oriented",
                "background": "6 years in modern web development with React and Node.js"
            },
            {
                "name": "Jordan Martinez",
                "age": 34,
                "job": "Senior Backend Engineer",
                "traits": ["Systematic", "Scalability-focused", "Mentoring", "Architecture-minded"],
                "communication_style": "Technical and thorough",
                "background": "10+ years in distributed systems and cloud architecture"
            },
            {
                "name": "Taylor Kim",
                "age": 26,
                "job": "Full-Stack Developer",
                "traits": ["Versatile", "Learning-oriented", "Agile", "User-focused"],
                "communication_style": "Enthusiastic and exploratory",
                "background": "4 years across frontend, backend, and DevOps"
            }
        ]
    elif "manager" in demographic_words or "product" in demographic_words:
        persona_templates = [
            {
                "name": "Riley Thompson",
                "age": 38,
                "job": "Product Manager",
                "traits": ["Strategic", "Data-driven", "User-focused", "Cross-functional"],
                "communication_style": "Analytical and comprehensive",
                "background": "8 years leading product development in B2B SaaS"
            },
            {
                "name": "Casey Chen",
                "age": 31,
                "job": "Technical Product Manager",
                "traits": ["Bridge-builder", "Technical", "Priority-focused", "Stakeholder-minded"],
                "communication_style": "Clear and prioritizing",
                "background": "Former engineer with 5 years in product management"
            },
            {
                "name": "Morgan Davis",
                "age": 45,
                "job": "VP of Product",
                "traits": ["Visionary", "Market-focused", "Strategic", "Team-building"],
                "communication_style": "High-level and forward-thinking",
                "background": "15+ years scaling products from startup to enterprise"
            }
        ]
    elif "chip" in demographic_words or "hardware" in demographic_words:
        persona_templates = [
            {
                "name": "Dr. Sam Patel",
                "age": 36,
                "job": "Chip Design Engineer",
                "traits": ["Precision-focused", "Innovation-driven", "Research-oriented", "Performance-minded"],
                "communication_style": "Technical and detailed",
                "background": "PhD in Electrical Engineering, 8 years in semiconductor design"
            },
            {
                "name": "Jamie Liu",
                "age": 41,
                "job": "Hardware Product Manager",
                "traits": ["Market-aware", "Technical-business bridge", "Roadmap-focused", "Partnership-oriented"],
                "communication_style": "Strategic and market-focused",
                "background": "12 years bridging hardware engineering and business strategy"
            },
            {
                "name": "Avery Singh",
                "age": 28,
                "job": "AI Chip Architect",
                "traits": ["Cutting-edge", "Algorithm-focused", "Optimization-minded", "Future-thinking"],
                "communication_style": "Innovative and forward-looking",
                "background": "5 years specializing in AI accelerator architectures"
            }
        ]
    else:
        # Generic personas for other demographics
        persona_templates = [
            {
                "name": "River Johnson",
                "age": 32,
                "job": f"{target_demographic.title()} Specialist",
                "traits": ["Experienced", "Methodical", "Results-oriented", "Collaborative"],
                "communication_style": "Professional and thorough",
                "background": f"7 years of experience in {target_demographic} field"
            },
            {
                "name": "Phoenix Williams",
                "age": 29,
                "job": f"Senior {target_demographic.title()} Analyst",
                "traits": ["Analytical", "Detail-oriented", "Problem-solving", "Innovation-focused"],
                "communication_style": "Data-driven and precise",
                "background": f"5 years analyzing trends in {target_demographic} sector"
            },
            {
                "name": "Sage Brown",
                "age": 37,
                "job": f"{target_demographic.title()} Consultant",
                "traits": ["Advisory", "Strategic", "Client-focused", "Solution-oriented"],
                "communication_style": "Consultative and insightful",
                "background": f"10+ years consulting in {target_demographic} industry"
            }
        ]
    
    # Use the appropriate persona templates
    personas = persona_templates
    questions = question_templates
    
    # Generate dynamic responses based on research context
    response_templates = {
        "challenges": [
            f"The biggest challenge with {research_question.lower()} is the complexity and rapidly evolving landscape.",
            f"We struggle with implementation inconsistencies when dealing with {research_question.lower()}.",
            f"The main issue is lack of standardized approaches for {research_question.lower()}.",
            f"Resource constraints and time pressures make {research_question.lower()} particularly challenging."
        ],
        "approaches": [
            f"We take a systematic approach to {research_question.lower()}, starting with research and planning.",
            f"Our current method for {research_question.lower()} involves iterative testing and validation.",
            f"We approach {research_question.lower()} through cross-functional collaboration and regular reviews.",
            f"Our strategy focuses on best practices and proven methodologies for {research_question.lower()}."
        ],
        "ideal_solutions": [
            f"An ideal solution for {research_question.lower()} would be unified, well-documented, and scalable.",
            f"The perfect approach would seamlessly integrate with existing workflows and tools.",
            f"We'd want something that provides clear guidance and reduces complexity around {research_question.lower()}.",
            f"An optimal solution would offer flexibility while maintaining consistency and reliability."
        ],
        "tools": [
            f"We use a combination of specialized tools and platforms for {research_question.lower()}.",
            f"Our toolkit includes both commercial solutions and open-source alternatives.",
            f"We rely on industry-standard tools augmented with custom solutions for {research_question.lower()}.",
            f"Our approach combines established tools with emerging technologies in this space."
        ],
        "frustrations": [
            f"The biggest frustration is the fragmented ecosystem around {research_question.lower()}.",
            f"Poor documentation and lack of clear examples really impact our productivity.",
            f"The rapid pace of change makes it hard to establish stable practices for {research_question.lower()}.",
            f"Inconsistent APIs and poor integration between tools causes significant overhead."
        ]
    }
    
    # Mock interviews with dynamic responses
    interviews = []
    for i, persona in enumerate(personas):
        responses = []
        for j, question in enumerate(questions):
            # Select appropriate response template based on question type
            if "challenge" in question.lower():
                answer = response_templates["challenges"][i % len(response_templates["challenges"])]
            elif "approach" in question.lower():
                answer = response_templates["approaches"][i % len(response_templates["approaches"])]
            elif "ideal" in question.lower():
                answer = response_templates["ideal_solutions"][i % len(response_templates["ideal_solutions"])]
            elif "tools" in question.lower() or "methods" in question.lower():
                answer = response_templates["tools"][i % len(response_templates["tools"])]
            elif "frustrat" in question.lower():
                answer = response_templates["frustrations"][i % len(response_templates["frustrations"])]
            else:
                answer = f"This is an important consideration for {research_question.lower()} in our field."
            
            responses.append({
                "question": question,
                "answer": answer
            })
        
        interviews.append({
            "persona": {
                "name": persona["name"],
                "age": persona["age"],
                "job": persona["job"],
                "traits": persona["traits"]
            },
            "responses": responses
        })
    
    # Generate dynamic synthesis based on the research context
    persona_names = [p["name"].split()[0] for p in personas]
    
    # Create themes based on research question keywords
    if "chip" in research_question.lower() or "hardware" in research_question.lower():
        themes = {
            "primary": "**Technology Evolution & Performance**: Participants emphasized the rapid advancement in chip technology and its impact on AI capabilities.",
            "secondary": "**Market Dynamics**: The competitive landscape and cost considerations significantly influence adoption decisions.",
            "tertiary": "**Integration Challenges**: Balancing cutting-edge technology with practical implementation requirements."
        }
    elif "development" in research_question.lower() or "software" in research_question.lower():
        themes = {
            "primary": "**Tooling & Workflow**: Participants highlighted the importance of efficient development tools and streamlined processes.",
            "secondary": "**Learning Curve**: Different experience levels require varying approaches to adoption and implementation.",
            "tertiary": "**Integration & Compatibility**: Ensuring new solutions work well with existing systems and workflows."
        }
    else:
        themes = {
            "primary": "**Implementation Challenges**: Participants consistently mentioned difficulties in practical application and deployment.",
            "secondary": "**Resource Requirements**: Time, budget, and skill constraints significantly impact decision-making.",
            "tertiary": "**Standards & Best Practices**: The need for clear guidelines and proven methodologies emerged as a key theme."
        }
    
    synthesis = f"""## KEY THEMES

Based on our research about "{research_question}" among {target_demographic}, several important patterns emerged:

{themes["primary"]}

{themes["secondary"]}

{themes["tertiary"]}

## DIVERSE PERSPECTIVES

**{persona_names[0]}'s Perspective ({personas[0]["job"]})**: {personas[0]["communication_style"]} approach with focus on {personas[0]["traits"][0].lower()} and {personas[0]["traits"][1].lower()} outcomes.

**{persona_names[1]}'s Perspective ({personas[1]["job"]})**: {personas[1]["communication_style"]} methodology emphasizing {personas[1]["traits"][0].lower()} and {personas[1]["traits"][1].lower()} considerations.

**{persona_names[2]}'s Perspective ({personas[2]["job"]})**: {personas[2]["communication_style"]} strategy prioritizing {personas[2]["traits"][0].lower()} and {personas[2]["traits"][1].lower()} factors.

## PAIN POINTS & OPPORTUNITIES

**Major Pain Points**:
- Complexity and fragmentation in current approaches to {research_question.lower()}
- Limited resources and time constraints affecting implementation
- Inconsistent standards and documentation across the {target_demographic} community
- Integration challenges with existing tools and workflows

**Key Opportunities**:
- Streamlined solutions that reduce complexity while maintaining flexibility
- Better education and training resources for {target_demographic}
- Improved collaboration and knowledge sharing within the community
- Standardized approaches that can scale across different use cases

## ACTIONABLE RECOMMENDATIONS

1. **Simplify Implementation**: Develop more accessible solutions for {research_question.lower()} that don't sacrifice functionality for ease of use

2. **Enhance Documentation**: Create comprehensive, example-driven resources that address different skill levels within {target_demographic}

3. **Foster Community**: Build stronger networks for knowledge sharing and collaborative problem-solving

4. **Standardize Practices**: Establish clear best practices and guidelines that can be widely adopted

5. **Continuous Improvement**: Implement feedback loops to ensure solutions evolve with changing needs and technologies

These insights highlight the need for balanced approaches that address both immediate practical concerns and long-term strategic goals within the {target_demographic} community."""
    
    return {
        "research_question": research_question,
        "target_demographic": target_demographic,
        "num_interviews": len(personas),
        "interview_questions": questions,
        "personas": personas,
        "interviews": interviews,
        "synthesis": synthesis.strip()
    }

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Automated Research API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "cerebras_api_configured": bool(os.getenv("CEREBRAS_API_KEY")),
        "langsmith_configured": bool(os.getenv("LANGSMITH_TRACING")),
        "mode": "demo" # Indicate we're in demo mode without full AI
    }

@app.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    """
    Conduct automated user research (currently using mock data for demo)
    """
    try:
        logger.info(f"Starting research for question: {request.research_question}")
        logger.info(f"Target demographic: {request.target_demographic}")
        
        # Validate inputs
        if not request.research_question.strip():
            raise HTTPException(status_code=400, detail="Research question cannot be empty")
        
        if not request.target_demographic.strip():
            raise HTTPException(status_code=400, detail="Target demographic cannot be empty")
        
        # Add artificial delay to simulate processing
        time.sleep(2)
        
        # Generate mock research data
        result = generate_mock_research_data(
            research_question=request.research_question,
            target_demographic=request.target_demographic
        )
        
        logger.info(f"Research completed successfully with {len(result['interviews'])} interviews")
        
        return ResearchResponse(
            success=True,
            data=result
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during research: {str(e)}")
        return ResearchResponse(
            success=False,
            error=f"Internal server error: {str(e)}"
        )

@app.get("/config")
async def get_config():
    """Get current configuration"""
    return {
        "default_num_interviews": int(os.getenv("DEFAULT_NUM_INTERVIEWS", 10)),
        "default_num_questions": int(os.getenv("DEFAULT_NUM_QUESTIONS", 5)),
        "backend_host": os.getenv("BACKEND_HOST", "localhost"),
        "backend_port": int(os.getenv("BACKEND_PORT", 8000)),
        "mode": "demo"
    }

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("BACKEND_HOST", "localhost")
    port = int(os.getenv("BACKEND_PORT", 8000))
    
    uvicorn.run(
        "main_simple:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )