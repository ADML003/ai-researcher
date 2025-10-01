# Project Structure

```
automated-research-app/
├── .env                          # Environment configuration with API keys
├── .gitignore                   # Git ignore patterns
├── README.md                    # Comprehensive documentation
├── start.sh                     # Automated startup script
├── health_check.py             # Health check and testing script
│
├── backend/                     # FastAPI Backend
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py               # Pydantic models and TypedDict definitions
│   ├── research_workflow.py    # LangGraph workflow implementation
│   └── requirements.txt        # Python dependencies
│
└── frontend/                   # Next.js Frontend
    ├── package.json            # Node.js dependencies and scripts
    ├── next.config.js          # Next.js configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── postcss.config.js       # PostCSS configuration
    ├── tsconfig.json          # TypeScript configuration
    │
    ├── app/                   # Next.js App Router
    │   ├── layout.tsx         # Root layout with theme provider
    │   ├── page.tsx           # Main application page
    │   └── globals.css        # Global styles and Apple-inspired CSS
    │
    └── components/            # React Components
        └── ThemeProvider.tsx  # Dark/light mode theme provider
```

## Key Features Implemented

### ✅ Backend (FastAPI)

- **Multi-agent workflow** using LangGraph
- **Cerebras LLM integration** for fast inference
- **LangSmith tracing** for debugging and evaluation
- **RESTful API** with comprehensive endpoints
- **Error handling** and validation
- **CORS configuration** for frontend integration

### ✅ Frontend (Next.js)

- **Apple-inspired design** with clean, minimalist UI
- **Dark/light mode** with automatic system detection
- **Responsive design** for all screen sizes
- **Real-time progress** indicators during research
- **Comprehensive results display** with collapsible sections
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### ✅ Environment & Configuration

- **Secure API key management** via environment variables
- **LangChain project setup** for "automated-research"
- **Docker-ready structure** (can be containerized)
- **Development scripts** for easy startup
- **Health checks** for monitoring

## Quick Start Commands

### Start Everything

```bash
cd automated-research-app
./start.sh
```

### Check System Health

```bash
python health_check.py
```

### Manual Startup

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed system status
- `POST /research` - Conduct automated research
- `GET /config` - Get configuration settings
- `GET /docs` - API documentation (Swagger UI)

## Environment Variables Configured

```env
CEREBRAS_API_KEY=csk-62ym29rrhdpppnrh4hkpyd5ffxpcmyhxf24dmcc6nv45dc42
LANGSMITH_TRACING=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
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=automated-research
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Workflow Overview

1. **User Input**: Research question + target demographic
2. **Question Generation**: AI creates interview questions
3. **Persona Creation**: Generates diverse user personas
4. **Interview Simulation**: Conducts Q&A with each persona
5. **Synthesis**: Analyzes responses and creates insights
6. **Results Display**: Comprehensive report with recommendations

## Design Principles

### Apple-Inspired UI

- **Minimalist design** with clean lines
- **SF Pro font family** for native feel
- **Rounded corners** and subtle shadows
- **Color palette** inspired by Apple's design system
- **Smooth animations** and transitions
- **Dark/light mode** with system integration

### Technical Excellence

- **Type safety** with TypeScript
- **Modern React** with hooks and functional components
- **Fast LLM inference** via Cerebras
- **Multi-agent orchestration** with LangGraph
- **Responsive design** with Tailwind CSS
- **Error boundaries** and comprehensive error handling

The application is now ready for use with a complete, production-ready structure that includes automated research functionality, beautiful UI, and comprehensive documentation.
