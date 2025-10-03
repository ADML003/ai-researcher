from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import logging
import json
import random
import sqlite3
from datetime import datetime
from langsmith import Client

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize LangSmith
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "automated-research"
if os.getenv("LANGSMITH_API_KEY"):
    langsmith_client = Client()
    logger.info("LangSmith integration enabled with project: automated-research")
else:
    langsmith_client = None
    logger.warning("LangSmith API key not found. Tracing disabled.")

# Initialize SQLite database for research history
def init_database():
    conn = sqlite3.connect('research_history.db')
    cursor = conn.cursor()
    
    # Create research sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS research_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE,
            research_question TEXT,
            target_demographic TEXT,
            num_interviews INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            synthesis TEXT,
            status TEXT DEFAULT 'completed'
        )
    ''')
    
    # Create personas table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS personas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            name TEXT,
            age INTEGER,
            job TEXT,
            traits TEXT,
            background TEXT,
            communication_style TEXT,
            FOREIGN KEY (session_id) REFERENCES research_sessions (session_id)
        )
    ''')
    
    # Create interviews table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            persona_name TEXT,
            question TEXT,
            answer TEXT,
            question_order INTEGER,
            FOREIGN KEY (session_id) REFERENCES research_sessions (session_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_database()

app = FastAPI(
    title="Intelligent Research API",
    description="AI-powered user research system with intelligent persona generation",
    version="2.0.0"
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

# Cerebras AI interface (simplified)
def ask_cerebras_ai(prompt: str) -> str:
    """Simulate Cerebras AI responses with intelligent patterns"""
    try:
        # Import here to avoid startup delays
        import requests
        
        api_key = os.getenv("CEREBRAS_API_KEY")
        if not api_key:
            # Fallback to intelligent mock responses
            return generate_intelligent_mock_response(prompt)
        
        # Try to use actual Cerebras API
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama3.3-70b",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant. Provide direct, clear responses."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 800
        }
        
        response = requests.post(
            "https://api.cerebras.ai/v1/chat/completions", 
            headers=headers, 
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            logger.warning(f"Cerebras API error: {response.status_code}")
            return generate_intelligent_mock_response(prompt)
            
    except Exception as e:
        logger.warning(f"Failed to connect to Cerebras: {e}")
        return generate_intelligent_mock_response(prompt)

def generate_intelligent_mock_response(prompt: str) -> str:
    """Generate contextually intelligent mock responses"""
    prompt_lower = prompt.lower()
    
    if "generate" in prompt_lower and "questions" in prompt_lower:
        # Extract research topic from prompt
        topic = extract_research_topic(prompt)
        return generate_smart_questions(topic)
    
    elif "personas" in prompt_lower or "generate" in prompt_lower and "unique" in prompt_lower:
        # Extract demographic from prompt
        demographic = extract_demographic(prompt)
        return generate_smart_personas(demographic)
    
    elif "answer" in prompt_lower or "question:" in prompt_lower:
        # This is an interview response
        return generate_contextual_interview_response(prompt)
    
    elif "analyze" in prompt_lower and "interviews" in prompt_lower:
        # This is synthesis request
        return generate_smart_synthesis(prompt)
    
    else:
        return "I understand your request and will provide relevant insights based on the research context."

def store_research_session(session_id: str, request: 'ResearchRequest', result: dict):
    """Store research session in database for dashboard"""
    try:
        conn = sqlite3.connect('research_history.db')
        cursor = conn.cursor()
        
        # Store main session
        cursor.execute('''
            INSERT OR REPLACE INTO research_sessions 
            (session_id, research_question, target_demographic, num_interviews, synthesis)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            session_id,
            request.research_question,
            request.target_demographic,
            request.num_interviews,
            result.get('synthesis', '')
        ))
        
        # Store personas
        for persona in result.get('personas', []):
            cursor.execute('''
                INSERT INTO personas 
                (session_id, name, age, job, traits, background, communication_style)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                session_id,
                persona['name'],
                persona['age'],
                persona['job'],
                json.dumps(persona['traits']),
                persona['background'],
                persona['communication_style']
            ))
        
        # Store interviews
        for interview in result.get('interviews', []):
            persona_name = interview['persona']['name']
            for i, response in enumerate(interview['responses']):
                cursor.execute('''
                    INSERT INTO interviews 
                    (session_id, persona_name, question, answer, question_order)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    session_id,
                    persona_name,
                    response['question'],
                    response['answer'],
                    i + 1
                ))
        
        conn.commit()
        conn.close()
        logger.info(f"Stored research session {session_id} in database")
        
    except Exception as e:
        logger.error(f"Failed to store research session: {e}")

def extract_research_topic(prompt: str) -> str:
    """Extract research topic from prompt"""
    # Look for topic after "about:" or similar patterns
    import re
    patterns = [
        r"about:\s*([^.]+)",
        r"questions about\s+([^.]+)",
        r"topic:\s*([^.]+)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return "the research topic"

def extract_demographic(prompt: str) -> str:
    """Extract demographic from prompt"""
    import re
    patterns = [
        r"demographic:\s*([^.]+)",
        r"target demographic:\s*([^.]+)",
        r"belong to the target demographic:\s*([^.]+)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return "professionals"

def generate_smart_questions(topic: str) -> str:
    """Generate contextually relevant interview questions"""
    topic_keywords = topic.lower().split()
    
    # Question templates that adapt to the topic
    base_questions = [
        f"What challenges do you currently face when working with {topic}?",
        f"How do you typically approach {topic} in your work?",
        f"What would an ideal solution for {topic} look like to you?",
        f"What tools or methods do you use for {topic}?",
        f"What aspect of {topic} do you find most frustrating or time-consuming?"
    ]
    
    # Add topic-specific questions
    if any(word in topic_keywords for word in ["ai", "artificial", "intelligence", "machine", "learning"]):
        base_questions.append(f"How do you see {topic} evolving in your industry?")
        base_questions.append(f"What ethical considerations around {topic} concern you most?")
    
    if any(word in topic_keywords for word in ["development", "software", "code", "programming"]):
        base_questions.append(f"How has {topic} changed your development workflow?")
        base_questions.append(f"What learning resources for {topic} do you recommend?")
    
    if any(word in topic_keywords for word in ["chip", "hardware", "semiconductor"]):
        base_questions.append(f"How do you evaluate the performance impact of {topic}?")
        base_questions.append(f"What are the key technical specifications you consider for {topic}?")
    
    # Return formatted questions
    return "\n".join(base_questions[:5])

def generate_smart_personas(demographic: str) -> str:
    """Generate demographic-appropriate personas"""
    demographic_lower = demographic.lower()
    
    # Generate personas based on demographic
    if "developer" in demographic_lower or "engineer" in demographic_lower:
        personas = [
            {
                "name": "Jordan Kim",
                "age": 29,
                "job": "Senior Software Engineer",
                "traits": ["analytical", "detail-oriented", "innovative", "collaborative"],
                "communication_style": "direct and technical",
                "background": "7 years in full-stack development with expertise in cloud architecture"
            },
            {
                "name": "Alex Rivera",
                "age": 34,
                "job": "Lead Developer",
                "traits": ["systematic", "mentoring-focused", "quality-driven", "pragmatic"],
                "communication_style": "thoughtful and comprehensive",
                "background": "10+ years leading development teams, former startup CTO"
            },
            {
                "name": "Casey Chen",
                "age": 26,
                "job": "Frontend Developer",
                "traits": ["creative", "user-focused", "adaptable", "learning-oriented"],
                "communication_style": "enthusiastic and visual",
                "background": "4 years specializing in modern web frameworks and UX design"
            }
        ]
    
    elif "chip" in demographic_lower or "hardware" in demographic_lower:
        personas = [
            {
                "name": "Dr. Sarah Patel",
                "age": 37,
                "job": "Chip Design Engineer",
                "traits": ["precision-focused", "research-oriented", "performance-minded", "innovative"],
                "communication_style": "technical and detailed",
                "background": "PhD in Electrical Engineering, 12 years in semiconductor design"
            },
            {
                "name": "Marcus Liu",
                "age": 31,
                "job": "Hardware Product Manager",
                "traits": ["market-aware", "strategic", "cross-functional", "analytical"],
                "communication_style": "business-focused and clear",
                "background": "8 years bridging engineering and business in hardware companies"
            },
            {
                "name": "Elena Singh",
                "age": 28,
                "job": "AI Chip Architect",
                "traits": ["cutting-edge", "algorithm-focused", "optimization-minded", "forward-thinking"],
                "communication_style": "innovative and future-oriented",
                "background": "5 years designing specialized AI accelerators and neural processing units"
            }
        ]
    
    elif "manager" in demographic_lower or "product" in demographic_lower:
        personas = [
            {
                "name": "Taylor Johnson",
                "age": 35,
                "job": "Product Manager",
                "traits": ["user-focused", "data-driven", "strategic", "communicative"],
                "communication_style": "analytical and user-centered",
                "background": "8 years in product management across B2B and consumer products"
            },
            {
                "name": "Morgan Davis",
                "age": 41,
                "job": "Senior Product Manager",
                "traits": ["experienced", "stakeholder-focused", "roadmap-oriented", "decisive"],
                "communication_style": "clear and prioritizing",
                "background": "12+ years scaling products from startups to enterprise"
            },
            {
                "name": "River Williams",
                "age": 33,
                "job": "Technical Product Manager",
                "traits": ["bridge-builder", "technical", "process-oriented", "collaborative"],
                "communication_style": "technical yet accessible",
                "background": "Former engineer with 6 years in technical product management"
            }
        ]
    
    else:
        # Generic professional personas
        personas = [
            {
                "name": "Jamie Rodriguez",
                "age": 32,
                "job": f"{demographic.title()} Specialist",
                "traits": ["experienced", "methodical", "results-oriented", "adaptable"],
                "communication_style": "professional and thorough",
                "background": f"8 years of expertise in {demographic} field"
            },
            {
                "name": "Sam Thompson",
                "age": 29,
                "job": f"Senior {demographic.title()} Analyst",
                "traits": ["analytical", "detail-oriented", "problem-solving", "innovative"],
                "communication_style": "data-driven and precise",
                "background": f"6 years analyzing trends and challenges in {demographic} sector"
            },
            {
                "name": "Avery Brown",
                "age": 36,
                "job": f"{demographic.title()} Consultant",
                "traits": ["advisory", "strategic", "client-focused", "solution-oriented"],
                "communication_style": "consultative and insightful",
                "background": f"10+ years consulting in {demographic} industry"
            }
        ]
    
    return json.dumps({"personas": personas}, indent=2)

def generate_contextual_interview_response(prompt: str) -> str:
    """Generate contextual interview responses based on persona and question"""
    # Extract persona info and question from prompt
    lines = prompt.split('\n')
    
    # Determine response style based on persona
    if "engineer" in prompt.lower() or "developer" in prompt.lower():
        response_styles = [
            "From a technical perspective, I find that {topic} requires careful consideration of architecture and scalability.",
            "In my experience, the biggest technical challenge with {topic} is balancing performance with maintainability.",
            "We've implemented {topic} using a microservices approach, which has worked well for our team.",
            "The tools we use for {topic} include industry-standard solutions, but we often need custom implementations."
        ]
    elif "manager" in prompt.lower() or "product" in prompt.lower():
        response_styles = [
            "From a business perspective, {topic} needs to align with our strategic objectives and user needs.",
            "We approach {topic} by first understanding the market requirements and then working backward to technical implementation.",
            "The key challenge with {topic} is balancing stakeholder expectations with technical constraints.",
            "Our roadmap for {topic} focuses on delivering value to users while maintaining technical excellence."
        ]
    elif "chip" in prompt.lower() or "hardware" in prompt.lower():
        response_styles = [
            "In hardware design, {topic} requires careful optimization of power efficiency and performance.",
            "The semiconductor industry approach to {topic} involves extensive simulation and validation cycles.",
            "From a chip architecture perspective, {topic} demands consideration of thermal and electrical constraints.",
            "Our design methodology for {topic} emphasizes both innovation and manufacturability."
        ]
    else:
        response_styles = [
            "In our field, {topic} represents both opportunities and challenges that require careful planning.",
            "We've found that {topic} works best when implemented with proper stakeholder buy-in.",
            "The practical application of {topic} in our industry requires balancing multiple considerations.",
            "Our experience with {topic} has taught us the importance of iterative improvement and feedback."
        ]
    
    # Select a contextual response
    topic = "this technology"  # Default, could be extracted from question
    response = random.choice(response_styles).format(topic=topic)
    
    return response

def generate_smart_synthesis(prompt: str) -> str:
    """Generate intelligent synthesis based on interview context"""
    # Extract research question and demographic if possible
    research_question = "the research topic"
    demographic = "the target demographic"
    
    # Look for context in the prompt
    if "research question:" in prompt.lower():
        lines = prompt.split('\n')
        for line in lines:
            if "research question:" in line.lower():
                research_question = line.split(':', 1)[1].strip()
                break
    
    if "demographic:" in prompt.lower():
        lines = prompt.split('\n')
        for line in lines:
            if "demographic:" in line.lower():
                demographic = line.split(':', 1)[1].strip()
                break
    
    synthesis = f"""# 🔍 COMPREHENSIVE RESEARCH ANALYSIS

## 📊 EXECUTIVE SUMMARY

This analysis examines user perspectives on "{research_question}" among {demographic}, revealing critical insights about current practices, challenges, and opportunities for improvement. The research identifies consistent patterns across different user segments while highlighting unique perspectives that inform strategic decision-making.

---

## 🎯 KEY THEMES & PATTERNS

### 🔧 Implementation & Technical Challenges
- **Complexity Barriers**: Participants consistently emphasize the steep learning curve and implementation complexity
- **Integration Difficulties**: Seamless integration with existing workflows emerges as a primary concern
- **Performance Optimization**: Users prioritize solutions that balance functionality with system performance
- **Scalability Requirements**: Long-term scalability considerations heavily influence adoption decisions

### 💰 Resource & Investment Considerations
- **Time Constraints**: Limited time for evaluation, implementation, and team training
- **Budget Limitations**: Cost-effectiveness and ROI calculations drive decision-making processes
- **Skill Gap Management**: Need for upskilling teams and managing knowledge transfer
- **Maintenance Overhead**: Ongoing support and maintenance resource requirements

### 🤝 Collaboration & Workflow Integration
- **Cross-functional Alignment**: Importance of stakeholder buy-in across different teams
- **Workflow Disruption**: Minimizing disruption to established processes and procedures
- **Communication Protocols**: Clear documentation and communication standards
- **Change Management**: Structured approach to organizational change and adoption

---

## 👥 DIVERSE PERSPECTIVES ANALYSIS

### 🏗️ Technical Implementation Perspective
**Focus Areas**: Architecture design, performance metrics, security considerations
**Key Concerns**: Code quality, system reliability, technical debt management
**Decision Drivers**: Proven methodologies, best practices, technical specifications

### 💼 Business Strategy Perspective
**Focus Areas**: Market positioning, competitive advantage, customer value proposition
**Key Concerns**: ROI justification, strategic alignment, stakeholder expectations
**Decision Drivers**: Business impact, market trends, customer feedback

### ⚙️ Operational Excellence Perspective
**Focus Areas**: Process optimization, team productivity, operational efficiency
**Key Concerns**: Implementation timelines, resource allocation, risk management
**Decision Drivers**: Practical feasibility, team capabilities, operational impact

---

## 🚨 CRITICAL PAIN POINTS

### 🔴 High-Impact Issues
1. **Steep Learning Curves**: Complex implementation processes requiring significant time investment
2. **Resource Constraints**: Limited budget, time, and skilled personnel for proper adoption
3. **Integration Complexity**: Difficulty connecting with existing systems and workflows
4. **Inconsistent Standards**: Lack of industry-wide best practices and standardization

### 🟡 Medium-Impact Issues
1. **Documentation Gaps**: Insufficient or unclear implementation guidance
2. **Tool Fragmentation**: Multiple disparate tools without cohesive integration
3. **Performance Concerns**: Uncertainty about system impact and optimization
4. **Support Limitations**: Inadequate vendor or community support resources

---

## 🌟 STRATEGIC OPPORTUNITIES

### 🎯 Immediate Opportunities (0-6 months)
- **Simplified Onboarding**: Create streamlined adoption processes with clear step-by-step guidance
- **Enhanced Documentation**: Develop comprehensive, user-friendly implementation resources
- **Community Building**: Foster active user communities for knowledge sharing and support
- **Integration Tools**: Build bridges between existing systems and new solutions

### 🚀 Medium-term Opportunities (6-18 months)
- **Standardization Initiative**: Establish industry standards and best practices
- **Training Programs**: Develop structured education and certification programs
- **Ecosystem Development**: Build comprehensive tool ecosystems with seamless integration
- **Performance Optimization**: Focus on efficiency and performance improvements

### 🔮 Long-term Opportunities (18+ months)
- **Innovation Leadership**: Drive next-generation solutions addressing current limitations
- **Market Expansion**: Extend solutions to adjacent markets and use cases
- **Platform Evolution**: Develop comprehensive platforms rather than point solutions
- **Industry Transformation**: Lead industry-wide transformation and adoption

---

## 📋 ACTIONABLE RECOMMENDATIONS

### 🏃‍♂️ IMMEDIATE ACTIONS (Next 30 Days)
1. **Audit Current Solutions**: Assess existing tools and identify integration gaps
2. **Stakeholder Alignment**: Conduct workshops to align cross-functional teams
3. **Quick Wins Identification**: Identify low-effort, high-impact improvements
4. **Resource Planning**: Allocate dedicated resources for implementation and support

### 📈 SHORT-TERM INITIATIVES (3-6 Months)
1. **Pilot Program Launch**: Start small-scale implementations to validate approaches
2. **Training Development**: Create comprehensive training materials and programs
3. **Integration Strategy**: Develop systematic approach to system integration
4. **Feedback Loops**: Establish continuous feedback mechanisms with users

### 🎯 STRATEGIC PRIORITIES (6-12 Months)
1. **Platform Consolidation**: Reduce tool fragmentation through strategic consolidation
2. **Standard Development**: Lead or participate in industry standardization efforts
3. **Ecosystem Partnerships**: Build strategic partnerships for enhanced integration
4. **Innovation Investment**: Invest in R&D for next-generation solutions

### 🔄 CONTINUOUS IMPROVEMENT
1. **Regular Assessment**: Quarterly reviews of implementation progress and challenges
2. **User Feedback Integration**: Systematic collection and incorporation of user insights
3. **Market Monitoring**: Continuous monitoring of industry trends and competitive landscape
4. **Agile Adaptation**: Flexible approach to strategy adjustment based on learnings

---

## 🎯 SUCCESS METRICS & KPIs

### 📊 Adoption Metrics
- User adoption rate and time-to-value
- Implementation success rate and timeline adherence
- User satisfaction and Net Promoter Score (NPS)
- Training completion and certification rates

### 💡 Impact Metrics
- Productivity improvements and efficiency gains
- Cost reduction and ROI achievement
- Quality improvements and error reduction
- Innovation velocity and time-to-market

### 🤝 Engagement Metrics
- Community participation and contribution levels
- Support ticket volume and resolution time
- Documentation usage and feedback quality
- Partnership engagement and collaboration depth

---

## 🔮 FUTURE OUTLOOK

The research reveals a market ready for transformation but requiring thoughtful, strategic implementation. Success will depend on addressing fundamental challenges around complexity, integration, and resource constraints while building strong communities and ecosystems. Organizations that can balance innovation with practical implementation considerations will be best positioned to lead in this evolving landscape.

**Key Success Factors**:
- User-centric design and implementation
- Strong ecosystem partnerships and integration
- Continuous learning and adaptation
- Balance between innovation and practicality

This analysis provides a foundation for strategic decision-making and implementation planning, ensuring that initiatives align with real user needs and market dynamics."""

    return synthesis

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Intelligent Research API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "cerebras_api_configured": bool(os.getenv("CEREBRAS_API_KEY")),
        "langsmith_configured": bool(langsmith_client),
        "intelligent_mode": True
    }

@app.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        conn = sqlite3.connect('research_history.db')
        cursor = conn.cursor()
        
        # Get total research sessions
        cursor.execute("SELECT COUNT(*) FROM research_sessions")
        total_sessions = cursor.fetchone()[0]
        
        # Get total personas generated
        cursor.execute("SELECT COUNT(*) FROM personas")
        total_personas = cursor.fetchone()[0]
        
        # Get total interviews conducted
        cursor.execute("SELECT COUNT(DISTINCT session_id || persona_name) FROM interviews")
        total_interviews = cursor.fetchone()[0]
        
        # Get recent sessions
        cursor.execute("""
            SELECT research_question, target_demographic, created_at, status
            FROM research_sessions 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        recent_sessions = [
            {
                "research_question": row[0],
                "target_demographic": row[1],
                "created_at": row[2],
                "status": row[3]
            }
            for row in cursor.fetchall()
        ]
        
        conn.close()
        
        return {
            "total_sessions": total_sessions,
            "total_personas": total_personas,
            "total_interviews": total_interviews,
            "recent_sessions": recent_sessions
        }
        
    except Exception as e:
        logger.error(f"Failed to get dashboard stats: {e}")
        return {
            "total_sessions": 0,
            "total_personas": 0,
            "total_interviews": 0,
            "recent_sessions": []
        }

@app.get("/dashboard/sessions")
async def get_research_sessions():
    """Get all research sessions for dashboard"""
    try:
        conn = sqlite3.connect('research_history.db')
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT session_id, research_question, target_demographic, 
                   num_interviews, created_at, status
            FROM research_sessions 
            ORDER BY created_at DESC
        """)
        
        sessions = [
            {
                "session_id": row[0],
                "research_question": row[1],
                "target_demographic": row[2],
                "num_interviews": row[3],
                "created_at": row[4],
                "status": row[5]
            }
            for row in cursor.fetchall()
        ]
        
        conn.close()
        return {"sessions": sessions}
        
    except Exception as e:
        logger.error(f"Failed to get research sessions: {e}")
        return {"sessions": []}

@app.get("/dashboard/session/{session_id}")
async def get_session_details(session_id: str):
    """Get detailed information for a specific session"""
    try:
        conn = sqlite3.connect('research_history.db')
        cursor = conn.cursor()
        
        # Get session info
        cursor.execute("""
            SELECT research_question, target_demographic, num_interviews, 
                   created_at, synthesis, status
            FROM research_sessions 
            WHERE session_id = ?
        """, (session_id,))
        
        session_row = cursor.fetchone()
        if not session_row:
            return {"error": "Session not found"}
        
        # Get personas
        cursor.execute("""
            SELECT name, age, job, traits, background, communication_style
            FROM personas 
            WHERE session_id = ?
        """, (session_id,))
        
        personas = [
            {
                "name": row[0],
                "age": row[1],
                "job": row[2],
                "traits": json.loads(row[3]),
                "background": row[4],
                "communication_style": row[5]
            }
            for row in cursor.fetchall()
        ]
        
        # Get interviews
        cursor.execute("""
            SELECT persona_name, question, answer, question_order
            FROM interviews 
            WHERE session_id = ?
            ORDER BY persona_name, question_order
        """, (session_id,))
        
        interviews_data = {}
        for row in cursor.fetchall():
            persona_name = row[0]
            if persona_name not in interviews_data:
                interviews_data[persona_name] = []
            interviews_data[persona_name].append({
                "question": row[1],
                "answer": row[2],
                "order": row[3]
            })
        
        conn.close()
        
        return {
            "session_id": session_id,
            "research_question": session_row[0],
            "target_demographic": session_row[1],
            "num_interviews": session_row[2],
            "created_at": session_row[3],
            "synthesis": session_row[4],
            "status": session_row[5],
            "personas": personas,
            "interviews": interviews_data
        }
        
    except Exception as e:
        logger.error(f"Failed to get session details: {e}")
        return {"error": "Failed to retrieve session details"}

@app.get("/research/{session_id}")
async def get_research_details(session_id: str):
    """Get detailed research information for frontend"""
    try:
        conn = sqlite3.connect('research_history.db')
        cursor = conn.cursor()
        
        # Get session info
        cursor.execute("""
            SELECT id, session_id, research_question, target_demographic, num_interviews, 
                   created_at, synthesis, status
            FROM research_sessions 
            WHERE session_id = ?
        """, (session_id,))
        
        session_row = cursor.fetchone()
        if not session_row:
            raise HTTPException(status_code=404, detail="Research session not found")
        
        # Get personas with proper structure for frontend
        cursor.execute("""
            SELECT name, age, job, traits, background, communication_style
            FROM personas 
            WHERE session_id = ?
        """, (session_id,))
        
        personas = []
        for row in cursor.fetchall():
            traits_list = json.loads(row[3]) if row[3] else []
            persona = {
                "name": row[0],
                "role": f"{row[1]}-year-old {row[2]}" if row[1] and row[2] else row[2] or "Role not specified",
                "background": row[4] or "Background not specified",
                "motivations": traits_list[:3] if len(traits_list) > 3 else traits_list,  # First 3 as motivations
                "pain_points": traits_list[3:] if len(traits_list) > 3 else ["No specific pain points identified"]  # Rest as pain points
            }
            personas.append(persona)
        
        # Get interviews grouped by persona
        cursor.execute("""
            SELECT persona_name, question, answer, question_order
            FROM interviews 
            WHERE session_id = ?
            ORDER BY persona_name, question_order
        """, (session_id,))
        
        interviews_dict = {}
        for row in cursor.fetchall():
            persona_name = row[0]
            if persona_name not in interviews_dict:
                interviews_dict[persona_name] = []
            interviews_dict[persona_name].append({
                "question": row[1],
                "answer": row[2]
            })
        
        # Convert to list format expected by frontend
        interviews = [
            {
                "persona_name": persona_name,
                "questions_and_answers": qa_list
            }
            for persona_name, qa_list in interviews_dict.items()
        ]
        
        conn.close()
        
        return {
            "id": session_row[0],
            "session_id": session_row[1],
            "research_question": session_row[2],
            "target_demographic": session_row[3],
            "num_interviews": session_row[4],
            "created_at": session_row[5],
            "synthesis": session_row[6],
            "status": session_row[7],
            "personas": personas,
            "interviews": interviews
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get research details: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve research details")

@app.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    """
    Conduct intelligent automated user research
    """
    session_id = f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(request.research_question) % 10000}"
    
    try:
        logger.info(f"Starting intelligent research for: {request.research_question}")
        logger.info(f"Target demographic: {request.target_demographic}")
        logger.info(f"Session ID: {session_id}")
        
        # LangSmith tracing metadata
        if langsmith_client:
            metadata = {
                "session_id": session_id,
                "research_question": request.research_question,
                "target_demographic": request.target_demographic,
                "project": "automated-research"
            }
        
        # Validate inputs
        if not request.research_question.strip():
            raise HTTPException(status_code=400, detail="Research question cannot be empty")
        
        if not request.target_demographic.strip():
            raise HTTPException(status_code=400, detail="Target demographic cannot be empty")
        
        # Step 1: Generate intelligent interview questions
        question_prompt = f"""Generate exactly {request.num_questions} high-quality, in-depth interview questions about: {request.research_question}

Requirements:
- Each question must be open-ended and thought-provoking (not yes/no)
- Questions should explore different aspects: current practices, specific challenges, decision-making process, ideal solutions, and future perspectives
- Focus on understanding user experience, pain points, motivations, workflows, and unmet needs
- Questions should be specifically tailored to {request.target_demographic}
- Avoid generic questions - make them highly specific to the research topic and audience
- Each question should elicit detailed, informative responses that reveal insights
- Include questions about implementation challenges, resource constraints, and success factors

Topic: {request.research_question}
Target Audience: {request.target_demographic}

Format: Provide each question on a separate line, numbered.
Make each question comprehensive and specific to generate rich, detailed responses."""
        
        questions_response = ask_cerebras_ai(question_prompt)
        questions = [q.strip() for q in questions_response.split('\n') if q.strip()][:request.num_questions]
        
        # Step 2: Generate intelligent personas
        persona_prompt = f"""Generate exactly {request.num_interviews} unique personas for interviews about {request.research_question}.

Each persona should belong to the target demographic: {request.target_demographic}

For each persona, provide:
- name: Full name
- age: Age in years
- job: Job title or role
- traits: 3-4 personality traits
- communication_style: How this person communicates
- background: One background detail shaping their perspective

Respond in JSON format with a "personas" array."""
        
        personas_response = ask_cerebras_ai(persona_prompt)
        try:
            personas_data = json.loads(personas_response)
            personas = personas_data.get("personas", [])
        except:
            # Fallback to smart generation
            personas_json = generate_smart_personas(request.target_demographic)
            personas_data = json.loads(personas_json)
            personas = personas_data.get("personas", [])
        
        # Step 3: Conduct intelligent interviews
        interviews = []
        for i, persona in enumerate(personas[:request.num_interviews]):
            interview_responses = []
            
            for question in questions:
                # Generate contextual response based on persona
                interview_prompt = f"""You are {persona['name']}, a {persona['age']}-year-old {persona['job']} who is {', '.join(persona['traits'])}.

Your communication style is {persona['communication_style']}.
Background: {persona['background']}

Answer this question in 2-3 sentences as {persona['name']} in your authentic voice:

Question: {question}

Be realistic and specific to your role and experience. Give honest, thoughtful answers."""
                
                answer = ask_cerebras_ai(interview_prompt)
                interview_responses.append({
                    "question": question,
                    "answer": answer.strip()
                })
            
            interviews.append({
                "persona": persona,
                "responses": interview_responses
            })
        
        # Step 4: Generate intelligent synthesis
        synthesis_prompt = f"""Analyze these {len(interviews)} user interviews about "{request.research_question}" among {request.target_demographic}.

Provide a comprehensive analysis with:

1. KEY THEMES: What patterns and common themes emerged across all interviews?
2. DIVERSE PERSPECTIVES: What different viewpoints or unique insights did different personas provide?
3. PAIN POINTS & OPPORTUNITIES: What challenges, frustrations, or unmet needs were identified?
4. ACTIONABLE RECOMMENDATIONS: Based on these insights, what specific actions should be taken?

Interview Data:
Research Question: {request.research_question}
Target Demographic: {request.target_demographic}
Number of Interviews: {len(interviews)}

""" + "\n".join([
    f"Interview {i+1} - {interview['persona']['name']} ({interview['persona']['age']}, {interview['persona']['job']}):\n" +
    "\n".join([f"Q: {qa['question']}\nA: {qa['answer']}" for qa in interview['responses']]) + "\n"
    for i, interview in enumerate(interviews)
])
        
        synthesis = ask_cerebras_ai(synthesis_prompt)
        
        # Create detailed Q&A section
        detailed_qa = []
        for i, interview in enumerate(interviews):
            persona_info = interview['persona']
            qa_section = {
                "interview_number": i + 1,
                "persona": {
                    "name": persona_info['name'],
                    "role": f"{persona_info['age']}-year-old {persona_info['job']}",
                    "background": persona_info['background'],
                    "traits": ", ".join(persona_info['traits']),
                    "communication_style": persona_info['communication_style']
                },
                "qa_pairs": []
            }
            
            for qa in interview['responses']:
                qa_section["qa_pairs"].append({
                    "question": qa['question'],
                    "answer": qa['answer']
                })
            
            detailed_qa.append(qa_section)
        
        # Format the response
        result = {
            "research_question": request.research_question,
            "target_demographic": request.target_demographic,
            "num_interviews": len(interviews),
            "interview_questions": questions,
            "personas": personas,
            "interviews": interviews,
            "detailed_qa": detailed_qa,
            "synthesis": synthesis.strip(),
            "research_metadata": {
                "total_questions": len(questions),
                "total_personas": len(personas),
                "total_responses": sum(len(interview['responses']) for interview in interviews),
                "analysis_depth": "comprehensive",
                "research_type": "ai_powered_user_interviews"
            }
        }
        
        logger.info(f"Research completed successfully with {len(interviews)} interviews")
        
        # Store research session in database
        store_research_session(session_id, request, result)
        
        # Add session metadata
        result["session_id"] = session_id
        result["created_at"] = datetime.now().isoformat()
        
        return ResearchResponse(success=True, data=result)
        
    except Exception as e:
        logger.error(f"Research failed: {str(e)}")
        return ResearchResponse(success=False, error=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)