"""
Workflow tracking system for user research process
Provides real-time updates on research progress with detailed step information
"""
import time
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from enum import Enum
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class StepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"

class WorkflowStep(BaseModel):
    id: str
    name: str
    description: str
    status: StepStatus = StepStatus.PENDING
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_ms: Optional[int] = None
    metadata: Dict[str, Any] = {}
    error_message: Optional[str] = None
    substeps: List['WorkflowStep'] = []

class WorkflowTracker:
    def __init__(self, session_id: str, research_question: str):
        self.session_id = session_id
        self.research_question = research_question
        self.workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        self.start_time = datetime.now()
        self.steps: List[WorkflowStep] = []
        self.current_step_index = 0
        self.total_steps = 0
        
        # Initialize research workflow steps
        self._initialize_workflow_steps()
    
    def _initialize_workflow_steps(self):
        """Initialize the complete research workflow steps"""
        self.steps = [
            WorkflowStep(
                id="step_1",
                name="Research Setup",
                description="Initializing research parameters and validating input",
                metadata={"research_question": self.research_question}
            ),
            WorkflowStep(
                id="step_2",
                name="Persona Generation",
                description="Creating diverse user personas based on target demographic",
                substeps=[
                    WorkflowStep(
                        id="step_2_1",
                        name="Analyze Demographics",
                        description="Understanding target user characteristics"
                    ),
                    WorkflowStep(
                        id="step_2_2", 
                        name="Generate Personas",
                        description="Creating detailed user personas with unique traits"
                    ),
                    WorkflowStep(
                        id="step_2_3",
                        name="Validate Personas",
                        description="Ensuring persona diversity and relevance"
                    )
                ]
            ),
            WorkflowStep(
                id="step_3",
                name="Question Generation",
                description="Creating targeted interview questions for research",
                substeps=[
                    WorkflowStep(
                        id="step_3_1",
                        name="Analyze Research Goals",
                        description="Understanding what insights we need to gather"
                    ),
                    WorkflowStep(
                        id="step_3_2",
                        name="Generate Questions",
                        description="Creating open-ended, unbiased interview questions"
                    )
                ]
            ),
            WorkflowStep(
                id="step_4",
                name="Interview Simulation",
                description="Conducting AI-powered interviews with generated personas",
                substeps=[
                    WorkflowStep(
                        id="step_4_1",
                        name="Interview Execution",
                        description="Running personalized interviews with each persona"
                    ),
                    WorkflowStep(
                        id="step_4_2",
                        name="Response Collection",
                        description="Gathering and organizing interview responses"
                    )
                ]
            ),
            WorkflowStep(
                id="step_5",
                name="Data Analysis",
                description="Analyzing interview responses for insights and patterns",
                substeps=[
                    WorkflowStep(
                        id="step_5_1",
                        name="Response Processing",
                        description="Processing and categorizing interview responses"
                    ),
                    WorkflowStep(
                        id="step_5_2",
                        name="Pattern Recognition",
                        description="Identifying common themes and insights"
                    ),
                    WorkflowStep(
                        id="step_5_3",
                        name="Insight Generation",
                        description="Generating actionable insights from data"
                    )
                ]
            ),
            WorkflowStep(
                id="step_6",
                name="Research Synthesis",
                description="Creating comprehensive research summary and recommendations",
                substeps=[
                    WorkflowStep(
                        id="step_6_1",
                        name="Key Findings",
                        description="Summarizing the most important discoveries"
                    ),
                    WorkflowStep(
                        id="step_6_2",
                        name="Recommendations",
                        description="Generating actionable recommendations"
                    ),
                    WorkflowStep(
                        id="step_6_3",
                        name="Report Generation",
                        description="Creating final research report"
                    )
                ]
            ),
            WorkflowStep(
                id="step_7",
                name="Data Storage",
                description="Saving research results and making them accessible",
                metadata={"session_id": self.session_id}
            )
        ]
        self.total_steps = len(self.steps)
    
    def start_step(self, step_id: str, metadata: Dict[str, Any] = None) -> bool:
        """Start a workflow step"""
        step = self._find_step(step_id)
        if not step:
            logger.error(f"Step {step_id} not found")
            return False
        
        step.status = StepStatus.RUNNING
        step.start_time = datetime.now()
        if metadata:
            step.metadata.update(metadata)
        
        logger.info(f"Started step: {step.name}")
        return True
    
    def complete_step(self, step_id: str, metadata: Dict[str, Any] = None) -> bool:
        """Complete a workflow step"""
        step = self._find_step(step_id)
        if not step:
            return False
        
        step.status = StepStatus.COMPLETED
        step.end_time = datetime.now()
        if step.start_time:
            delta = step.end_time - step.start_time
            step.duration_ms = int(delta.total_seconds() * 1000)
        
        if metadata:
            step.metadata.update(metadata)
        
        logger.info(f"Completed step: {step.name} ({step.duration_ms}ms)")
        return True
    
    def fail_step(self, step_id: str, error_message: str) -> bool:
        """Mark a step as failed"""
        step = self._find_step(step_id)
        if not step:
            return False
        
        step.status = StepStatus.FAILED
        step.end_time = datetime.now()
        step.error_message = error_message
        if step.start_time:
            delta = step.end_time - step.start_time
            step.duration_ms = int(delta.total_seconds() * 1000)
        
        logger.error(f"Failed step: {step.name} - {error_message}")
        return True
    
    def _find_step(self, step_id: str) -> Optional[WorkflowStep]:
        """Find a step by ID (including substeps)"""
        for step in self.steps:
            if step.id == step_id:
                return step
            for substep in step.substeps:
                if substep.id == step_id:
                    return substep
        return None
    
    def get_progress(self) -> Dict[str, Any]:
        """Get current workflow progress"""
        completed_steps = sum(1 for step in self.steps if step.status == StepStatus.COMPLETED)
        running_steps = sum(1 for step in self.steps if step.status == StepStatus.RUNNING)
        failed_steps = sum(1 for step in self.steps if step.status == StepStatus.FAILED)
        
        progress_percentage = (completed_steps / self.total_steps) * 100 if self.total_steps > 0 else 0
        
        current_step = None
        for step in self.steps:
            if step.status == StepStatus.RUNNING:
                current_step = step
                break
        
        return {
            "workflow_id": self.workflow_id,
            "session_id": self.session_id,
            "research_question": self.research_question,
            "progress_percentage": round(progress_percentage, 1),
            "total_steps": self.total_steps,
            "completed_steps": completed_steps,
            "running_steps": running_steps,
            "failed_steps": failed_steps,
            "current_step": current_step.dict() if current_step else None,
            "start_time": self.start_time,
            "steps": [step.dict() for step in self.steps]
        }
    
    def get_current_step(self) -> Optional[WorkflowStep]:
        """Get the currently running step"""
        for step in self.steps:
            if step.status == StepStatus.RUNNING:
                return step
        return None
    
    def is_active(self) -> bool:
        """Check if the workflow is still active (has running steps)"""
        return any(step.status == StepStatus.RUNNING for step in self.steps)
    
    def get_total_duration(self) -> int:
        """Get total duration of completed workflow in milliseconds"""
        if not self.steps:
            return 0
        
        completed_steps = [step for step in self.steps if step.duration_ms is not None]
        return sum(step.duration_ms for step in completed_steps)
    
    def get_estimated_completion(self) -> Optional[str]:
        """Get estimated completion time based on current progress"""
        completed_count = sum(1 for step in self.steps if step.status == StepStatus.COMPLETED)
        if completed_count == 0:
            return None
        
        total_duration = self.get_total_duration()
        avg_step_duration = total_duration / completed_count
        remaining_steps = self.total_steps - completed_count
        
        if remaining_steps <= 0:
            return "Completed"
        
        estimated_remaining_ms = avg_step_duration * remaining_steps
        estimated_completion = datetime.now().timestamp() + (estimated_remaining_ms / 1000)
        
        return datetime.fromtimestamp(estimated_completion).isoformat()

# Global storage for active workflows
active_workflows: Dict[str, WorkflowTracker] = {}

def create_workflow(session_id: str, research_question: str) -> WorkflowTracker:
    """Create a new workflow tracker"""
    tracker = WorkflowTracker(session_id, research_question)
    active_workflows[session_id] = tracker
    return tracker

def get_workflow(session_id: str) -> Optional[WorkflowTracker]:
    """Get an existing workflow tracker"""
    return active_workflows.get(session_id)

def remove_workflow(session_id: str) -> bool:
    """Remove a completed workflow tracker"""
    if session_id in active_workflows:
        del active_workflows[session_id]
        return True
    return False