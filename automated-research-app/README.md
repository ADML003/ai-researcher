# Automated Research App

An intelligent AI-powered user research system that generates user personas, conducts interviews, and synthesizes insights with professional formatting. Built with FastAPI backend and Next.js frontend featuring a comprehensive dashboard with research history storage.

## Features

- 🧠 **Intelligent AI Research**: Advanced user persona generation and interviews with professional formatting
- 📊 **Comprehensive Dashboard**: Complete research history tracking with SQLite storage
- 🎯 **Professional Analysis**: Clean, readable research outputs without excessive formatting
- 💾 **Local Database Storage**: SQLite-based persistence for all research sessions
- 🔍 **LangSmith Integration**: Optional workflow monitoring and tracing
- 🎨 **Apple-Inspired Design**: Clean, minimalist UI with light/dark mode
- ⚡ **Fast Results**: Complete research insights in under 60 seconds
- 🔄 **Real-time Processing**: Live updates during research workflow

### Backend

- **FastAPI**: Modern, fast web framework with intelligent research endpoints
- **SQLite**: Local database for research history and session storage
- **LangChain**: LLM orchestration and tooling
- **LangGraph**: Multi-agent workflow management
- **Cerebras**: Ultra-fast LLM inference
- **LangSmith**: Optional tracing and workflow monitoring

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with professional research formatting
- **Lucide React**: Beautiful icons
- **Dashboard**: Comprehensive research analytics and history interface

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Cerebras API key
- LangSmith API key (optional, for monitoring)

## Quick Start

### Option 1: One-Command Start

```bash
./start.sh
```

The unified start script will:

- ✅ Check environment and dependencies
- 📦 Install required packages automatically
- 🧠 Start intelligent backend with database
- 🎨 Launch frontend with dashboard
- 🔍 Configure LangSmith integration (if provided)

### Option 2: Manual Setup

### 1. Environment Configuration

Create `.env` file with your API keys:

```env
# API Keys
CEREBRAS_API_KEY=your_cerebras_api_key_here
LANGSMITH_TRACING=your_langsmith_api_key_here

# LangChain Configuration
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=automated-research
LANGCHAIN_API_KEY=your_langsmith_api_key_here

# Backend Configuration
BACKEND_HOST=localhost
BACKEND_PORT=8000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Open the App**: Navigate to `http://localhost:3000`

2. **Enter Research Details**:

   - Research Question: What you want to investigate
   - Target Demographic: Who you want to interview

3. **Start Research**: Click "Start Research" to begin the automated workflow

4. **View Results**:
   - Generated personas
   - Interview questions
   - Complete interview transcripts
   - Synthesized insights and recommendations

## API Documentation

The backend provides a REST API with the following endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /research` - Conduct automated research
- `GET /config` - Get current configuration

API documentation is available at `http://localhost:8000/docs` when the backend is running.

## Configuration

### Default Settings

- **Number of Interviews**: 10 personas
- **Questions per Interview**: 5 questions
- **Model**: Llama 3.3 70B via Cerebras
- **Temperature**: 0.7 for creative responses

### Customization

You can modify these settings in the `.env` file:

```env
DEFAULT_NUM_INTERVIEWS=10
DEFAULT_NUM_QUESTIONS=5
```

## Features Overview

### Multi-Agent Workflow

1. **Configuration Node**: Generates interview questions
2. **Persona Generation Node**: Creates diverse user profiles
3. **Interview Node**: Conducts Q&A with each persona
4. **Synthesis Node**: Analyzes and synthesizes insights

### Frontend Features

- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Real-time Updates**: Live progress indicators
- **Apple-inspired UI**: Clean, modern interface
- **Detailed Results**: Expandable interview details

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
python main.py
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your Cerebras API key is valid and has sufficient credits
2. **CORS Issues**: Make sure the frontend URL is in the CORS allowed origins
3. **Import Errors**: Ensure all dependencies are installed correctly

### Backend Logs

The backend provides detailed logging. Check the console output for debugging information.

### Frontend Errors

Check the browser developer console for any JavaScript errors or network issues.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For issues and questions:

- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

## Acknowledgments

- **Cerebras**: For ultra-fast LLM inference
- **LangChain/LangGraph**: For LLM orchestration
- **Next.js**: For the React framework
- **Tailwind CSS**: For styling utilities
