# 🔬 AI User Research Platform

<div align="center">

![AI Research](https://img.shields.io/badge/AI-Research-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)

**🚀 An intelligent AI-powered user research system that generates user personas, conducts interviews, and synthesizes insights with professional-grade analysis.**

_Built with Next.js 15, FastAPI, and powered by Cerebras AI for lightning-fast inference_

</div>

---

## ✨ **Features**

### 🎯 **Core Capabilities**

- 🧠 **Intelligent AI Research**: Advanced persona generation with contextual interviews
- 📊 **Comprehensive Dashboard**: Complete research history with delete functionality
- � **Professional Analysis**: Clean, readable insights without formatting clutter
- 💾 **PostgreSQL Storage**: Robust data persistence with user isolation
- 🔒 **Secure Authentication**: Clerk-powered user management
- ⚡ **Lightning Fast**: Complete research insights in under 60 seconds
- � **Real-time Processing**: Live progress updates during workflow

### 🛠️ **Technical Excellence**

- 🌐 **Production Ready**: Optimized for Vercel deployment
- 📱 **Responsive Design**: Apple-inspired UI with dark/light mode
- 🔍 **LangSmith Integration**: Comprehensive workflow monitoring
- 🗑️ **CRUD Operations**: Full research session management with confirmation dialogs
- � **User Data Isolation**: Secure multi-tenant architecture

---

## 🏗️ **Tech Stack**

### **Backend**

- **🚀 FastAPI**: Modern, fast web framework with automatic API docs
- **🐘 PostgreSQL**: Production-grade database with Neon hosting
- **🦙 LangChain**: Advanced LLM orchestration and tooling
- **📊 LangGraph**: Multi-agent workflow management
- **⚡ Cerebras AI**: Ultra-fast LLM inference engine
- **📈 LangSmith**: Workflow monitoring and tracing
- **🔐 Clerk JWT**: Secure authentication validation

### **Frontend**

- **⚛️ Next.js 15**: React framework with App Router and TypeScript
- **🎨 Tailwind CSS**: Utility-first styling with professional formatting
- **🔐 Clerk**: Complete authentication solution
- **🎭 Lucide React**: Beautiful, consistent iconography
- **📊 Interactive Dashboard**: Research analytics and session management

---

## 🚀 **Quick Start**

### **Prerequisites**

- 🐍 Python 3.9+
- 📦 Node.js 18+
- 🔑 Cerebras API key
- 🔑 Clerk authentication keys
- 🔑 LangSmith API key (optional)

### **1. Clone & Setup**

```bash
git clone https://github.com/your-username/ai-user-research-platform.git
cd ai-user-research-platform
```

### **2. Environment Configuration**

Create `.env` files with your API keys:

**Backend `.env`:**

```env
DATABASE_URL=your_postgresql_url
CEREBRAS_API_KEY=your_cerebras_api_key
LANGSMITH_API_KEY=your_langsmith_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=automated-research-app
CLERK_PUBLISHABLE_KEY=pk_test_your_key
```

**Frontend `.env.local`:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **3. Backend Setup**

```bash
cd backend
pip install -r requirements.txt
python main_intelligent.py
```

🌐 Backend runs at `http://localhost:8000`

### **4. Frontend Setup**

```bash
# From root directory
npm install
npm run dev
```

🌐 Frontend runs at `http://localhost:3000`

---

## 🎯 **How to Use**

### **Step 1: Authentication**

- 🔐 Sign up or sign in using Clerk authentication
- 🛡️ Your data is completely isolated and secure

### **Step 2: Create Research**

- 📝 Enter your research question
- 🎯 Define your target demographic
- ⚙️ Customize interview parameters

### **Step 3: AI Processing**

- 🧠 AI generates diverse user personas
- 💬 Conducts contextual interviews
- 📊 Synthesizes comprehensive insights

### **Step 4: Review & Manage**

- 📋 View detailed results in dashboard
- 🔍 Access individual interview transcripts
- 📈 Download professional reports
- 🗑️ Delete sessions with confirmation

---

## 📊 **Dashboard Features**

### **Research Management**

- 📈 **Statistics Overview**: Total sessions, personas, interviews
- 📅 **Recent Activity**: Timeline of research sessions
- 🔍 **Search & Filter**: Find specific research quickly
- 🗑️ **Delete with Confirmation**: Secure session removal

### **Interview Analysis**

- 👥 **Persona Breakdown**: Detailed character profiles
- 💬 **Q&A Transcripts**: Complete interview records
- 📊 **Synthesis Reports**: Professional insights and recommendations

---

## 🛠️ **API Documentation**

The FastAPI backend provides comprehensive REST API:

- `GET /health` - System health check
- `POST /research` - Create new research session
- `GET /research/{session_id}` - Get research details
- `DELETE /research/{session_id}` - Delete research session
- `GET /dashboard/stats` - Dashboard statistics
- `GET /interviews` - Get all interviews

📚 **Full API docs**: `http://localhost:8000/docs`

---

## 🌐 **Production Deployment**

### **Vercel (Frontend)**

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### **Railway/Render (Backend)**

1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click

_See deployment guide for detailed instructions_

---

## 🤝 **Acknowledgments**

### **Special Thanks**

🚀 **[Cerebras AI](https://cerebras.ai)** - For providing ultra-fast LLM inference that makes real-time research generation possible. Their cutting-edge hardware acceleration enables our platform to deliver insights in under 60 seconds.

🦙 **[LangChain](https://langchain.com)** - For the incredible LLM orchestration framework that powers our multi-agent research workflow. LangGraph makes complex AI workflows simple and reliable.

💻 **[WeMakeDevs](https://wemakedevs.org)** - For the amazing opportunity to build with Cerebras AI and showcase the future of AI-powered applications. Thank you for fostering innovation in the developer community!

### **Built With Love Using**

- ⚛️ **Next.js** - The React framework for production
- 🚀 **FastAPI** - Modern, fast web framework for building APIs
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔐 **Clerk** - Complete authentication solution
- 🐘 **PostgreSQL** - Robust relational database
- 📊 **Neon** - Modern serverless PostgreSQL

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. ✨ Make your changes
4. 🧪 Add tests if applicable
5. 📥 Submit a pull request

---

## 📞 **Support**

Need help? We're here for you!

- 📚 Check our [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/your-username/ai-user-research-platform/issues)
- 💬 [Join Discussions](https://github.com/your-username/ai-user-research-platform/discussions)
- 📧 Contact: support@yourplatform.com

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

_Built with ❤️ by the AI Research Platform Team_

</div>
