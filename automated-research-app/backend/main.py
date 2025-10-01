from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

from research_workflow import run_research_workflow

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
        "langsmith_configured": bool(os.getenv("LANGSMITH_TRACING"))
    }

@app.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    """
    Conduct automated user research using AI-powered multi-agent workflow
    """
    try:
        logger.info(f"Starting research for question: {request.research_question}")
        logger.info(f"Target demographic: {request.target_demographic}")
        
        # Validate inputs
        if not request.research_question.strip():
            raise HTTPException(status_code=400, detail="Research question cannot be empty")
        
        if not request.target_demographic.strip():
            raise HTTPException(status_code=400, detail="Target demographic cannot be empty")
        
        # Run the research workflow
        result = run_research_workflow(
            research_question=request.research_question,
            target_demographic=request.target_demographic
        )
        
        if result is None:
            raise HTTPException(status_code=500, detail="Research workflow failed")
        
        # Format the response
        formatted_result = {
            "research_question": result["research_question"],
            "target_demographic": result["target_demographic"],
            "num_interviews": len(result["all_interviews"]),
            "interview_questions": result["interview_questions"],
            "personas": [
                {
                    "name": persona.name,
                    "age": persona.age,
                    "job": persona.job,
                    "traits": persona.traits,
                    "communication_style": persona.communication_style,
                    "background": persona.background
                } for persona in result["personas"]
            ],
            "interviews": [
                {
                    "persona": {
                        "name": interview["persona"].name,
                        "age": interview["persona"].age,
                        "job": interview["persona"].job,
                        "traits": interview["persona"].traits
                    },
                    "responses": interview["responses"]
                } for interview in result["all_interviews"]
            ],
            "synthesis": result["synthesis"]
        }
        
        logger.info(f"Research completed successfully with {len(result['all_interviews'])} interviews")
        
        return ResearchResponse(
            success=True,
            data=formatted_result
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
        "backend_port": int(os.getenv("BACKEND_PORT", 8000))
    }

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("BACKEND_HOST", "localhost")
    port = int(os.getenv("BACKEND_PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )