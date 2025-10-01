from typing import Dict, List, TypedDict
from pydantic import BaseModel, Field
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from langchain_cerebras import ChatCerebras
from langgraph.graph import StateGraph, END

# Configuration Constants
DEFAULT_NUM_INTERVIEWS = int(os.getenv("DEFAULT_NUM_INTERVIEWS", 10))
DEFAULT_NUM_QUESTIONS = int(os.getenv("DEFAULT_NUM_QUESTIONS", 5))

class Persona(BaseModel):
    name: str = Field(..., description="Full name of the persona")
    age: int = Field(..., description="Age in years")
    job: str = Field(..., description="Job title or role")
    traits: List[str] = Field(..., description="3-4 personality traits")
    communication_style: str = Field(..., description="How this person communicates")
    background: str = Field(..., description="One background detail shaping their perspective")

class PersonasList(BaseModel):
    personas: List[Persona] = Field(..., description="List of generated personas")

class Questions(BaseModel):
    questions: List[str] = Field(..., description="List of interview questions")

class InterviewState(TypedDict):
    # Configuration inputs
    research_question: str
    target_demographic: str
    num_interviews: int
    num_questions: int

    # Generated data
    interview_questions: List[str]
    personas: List[Persona]

    # Current interview tracking
    current_persona_index: int
    current_question_index: int
    current_interview_history: List[Dict]

    # Results storage
    all_interviews: List[Dict]
    synthesis: str