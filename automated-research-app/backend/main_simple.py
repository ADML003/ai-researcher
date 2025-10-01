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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
    
    # Mock interview questions
    questions = [
        f"What challenges do you face when dealing with {research_question.lower()}?",
        f"How do you currently approach {research_question.lower()}?",
        f"What would an ideal solution look like for you?",
        f"What tools or methods do you currently use?",
        f"What frustrates you most about current solutions?"
    ]
    
    # Mock personas
    personas = [
        {
            "name": "Sarah Chen",
            "age": 28,
            "job": "Software Developer",
            "traits": ["Detail-oriented", "Pragmatic", "Collaborative", "Tech-savvy"],
            "communication_style": "Direct and concise",
            "background": "5 years experience in web development"
        },
        {
            "name": "Marcus Johnson",
            "age": 35,
            "job": "Product Manager",
            "traits": ["Strategic", "User-focused", "Analytical", "Communicative"],
            "communication_style": "Thoughtful and comprehensive",
            "background": "Former developer turned PM with startup experience"
        },
        {
            "name": "Elena Rodriguez",
            "age": 42,
            "job": "Senior Engineer",
            "traits": ["Experienced", "Mentoring", "Quality-focused", "Systematic"],
            "communication_style": "Measured and detailed",
            "background": "15+ years in enterprise software development"
        }
    ]
    
    # Mock interviews
    interviews = []
    for i, persona in enumerate(personas):
        responses = []
        for j, question in enumerate(questions):
            # Generate mock responses based on persona
            if "Sarah" in persona["name"]:
                answers = [
                    "I usually spend a lot of time reading through documentation to understand the nuances.",
                    "My current approach involves using multiple tools, but they don't integrate well.",
                    "Something that just works out of the box with good defaults would be amazing.",
                    "I primarily use VS Code extensions and online resources, but it's fragmented.",
                    "The lack of clear examples and inconsistent APIs really slow me down."
                ]
            elif "Marcus" in persona["name"]:
                answers = [
                    "From a product perspective, the biggest challenge is aligning technical capabilities with user needs.",
                    "I take a user-centered approach, starting with research and validation.",
                    "A solution that balances developer experience with business requirements.",
                    "We use analytics tools, user feedback platforms, and regular team retrospectives.",
                    "The disconnect between what developers build and what users actually need."
                ]
            else:  # Elena
                answers = [
                    "After many years, I've learned that the main challenge is maintaining consistency at scale.",
                    "I focus on establishing solid patterns and mentoring junior developers.",
                    "A robust, well-documented system with clear architectural guidelines.",
                    "I rely on proven methodologies, code reviews, and established best practices.",
                    "Poor documentation and lack of standardization across teams frustrates me most."
                ]
            
            responses.append({
                "question": question,
                "answer": answers[j % len(answers)]
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
    
    # Mock synthesis
    synthesis = f"""
## KEY THEMES

Based on our research about "{research_question}" among {target_demographic}, several clear patterns emerged:

**Documentation & Learning Curve**: All participants highlighted challenges with unclear or insufficient documentation. There's a consistent need for better examples and clearer explanations.

**Tool Integration**: Multiple participants mentioned struggles with fragmented tooling and poor integration between different solutions.

**Experience Levels**: Different experience levels require different approaches - junior developers need more guidance, while senior developers value flexibility and control.

## DIVERSE PERSPECTIVES

**Developer Perspective (Sarah)**: Focuses on immediate productivity and getting tasks done efficiently. Values tools that "just work" with minimal configuration.

**Product Perspective (Marcus)**: Emphasizes the balance between technical implementation and user value. Considers broader team and business impact.

**Senior Technical Perspective (Elena)**: Prioritizes long-term maintainability, consistency, and mentoring opportunities. Values proven patterns and architectural soundness.

## PAIN POINTS & OPPORTUNITIES

**Major Pain Points**:
- Inconsistent APIs and poor documentation
- Fragmented tooling ecosystem  
- Disconnect between different experience levels
- Lack of clear best practices and examples

**Key Opportunities**:
- Unified documentation with real-world examples
- Better tool integration and standardization
- Mentoring and knowledge sharing platforms
- Consistent APIs with good developer experience

## ACTIONABLE RECOMMENDATIONS

1. **Improve Documentation**: Create comprehensive guides with practical examples that address different experience levels

2. **Standardize Tooling**: Develop or promote integrated solutions that reduce fragmentation

3. **Build Community**: Foster knowledge sharing between different experience levels through mentoring programs

4. **Focus on DX**: Prioritize developer experience in API design and tool development

5. **Regular Feedback Loops**: Establish ongoing user research to continuously improve based on real usage patterns

These insights suggest that success in this area requires balancing immediate usability with long-term scalability while addressing the needs of diverse user groups.
"""
    
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