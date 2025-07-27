# 🧠 Arthacharya - AI Financial Guru

> An intelligent financial advisor powered by agentic AI that provides personalized emergency fund management and financial crisis detection.

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat&logo=n8n&logoColor=white)](https://n8n.io/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)](https://golang.org/)

## 🎯 Project Overview

Arthacharya is an AI-powered financial advisory system that:
- **Analyzes** your financial situation in real-time
- **Detects** financial crises before they happen  
- **Provides** personalized emergency fund recommendations
- **Takes autonomous actions** to protect your financial health
- **Learns** from your financial patterns and preferences

### 🏆 Hackathon Highlights
- **Agentic AI**: Autonomous decision-making capabilities
- **Real-time Analysis**: Live financial data processing
- **Crisis Detection**: Proactive financial health monitoring
- **Firebase Integration**: Scalable cloud infrastructure
- **Mobile-First Design**: Fi Money inspired UI/UX


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI
- n8n (self-hosted or cloud)
- Go 1.19+
- Git

### 1. Clone Repository
git clone https://github.com/your-username/arthacharya-ai-financial-guru.git
cd arthacharya-ai

### 2. Setup Frontend
cd frontend
cp firebase-config.template.js firebase-config.js

Edit firebase-config.js with your Firebase credentials
Deploy to Firebase Hosting
firebase login
firebase init hosting
firebase deploy

### 3. Setup n8n Workflows
cd workflows

Import workflows into your n8n instance
Follow workflow-setup-guide.md for detailed instructions

### 4. Setup MCP Server
cd mcp-server
cp config.template.json config.json

Edit config.json with your credentials
go mod tidy
go run main.go


## 🔥 Key Features

### 🤖 Agentic AI Capabilities
- **Autonomous Decision Making**: AI makes financial decisions without human intervention
- **Context-Aware Analysis**: Understands your complete financial picture
- **Learning System**: Improves recommendations based on your responses
- **Crisis Prevention**: Proactively identifies and prevents financial issues

### 📱 User Experience
- **Fi Money UI**: Professional fintech interface design
- **Real-time Updates**: Live data synchronization across all pages
- **Mobile Responsive**: Optimized for all device sizes
- **Secure Authentication**: OTP-based login system

### 🔧 Technical Excellence
- **Firebase Integration**: Scalable cloud database and hosting
- **Workflow Automation**: Complex financial logic in visual workflows  
- **API Integration**: RESTful APIs for data exchange
- **Error Handling**: Robust error recovery and user feedback

## 📊 Demo Flow

1. **User Login**: OTP-based authentication
2. **Financial Analysis**: AI analyzes emergency fund status
3. **Crisis Detection**: System identifies inadequate coverage (0.16 months)
4. **AI Recommendation**: Suggests specific actions with confidence scores
5. **User Decision**: Accept/reject recommendations with one click
6. **Autonomous Action**: AI takes approved actions automatically
7. **Continuous Monitoring**: Ongoing financial health tracking

## 🛠️ Technology Stack

### Frontend
- **HTML5/CSS3/JavaScript**: Modern web standards
- **Firebase Hosting**: Global CDN and SSL
- **Responsive Design**: Mobile-first approach

### Backend & AI
- **n8n**: Visual workflow automation
- **Firebase Firestore**: NoSQL database
- **LLM Integration**: AI-powered decision engine
- **Go MCP Server**: Model Context Protocol integration

### Infrastructure
- **Firebase Cloud**: Hosting, database, authentication
- **n8n Cloud/Self-hosted**: Workflow execution
- **Git**: Version control and collaboration

## 📈 Business Impact

### Problem Solved
- **60% of Indians** have inadequate emergency funds
- **Financial crises** often go undetected until too late
- **Manual financial planning** is time-consuming and error-prone

### Solution Benefits
- **Proactive Protection**: Prevent financial crises before they happen
- **24/7 Monitoring**: Continuous financial health oversight
- **Personalized Advice**: AI tailored to individual financial situations
- **Autonomous Actions**: Hands-off financial management

## 🔐 Security & Privacy

- **No Plain Text Credentials**: All sensitive data encrypted
- **Firebase Security Rules**: Database access control
- **Session Management**: Secure user authentication
- **Data Encryption**: End-to-end data protection

## 📝 Documentation

- [Setup Guide](SETUP.md) - Detailed installation instructions
- [Architecture Guide](docs/architecture.md) - System design details
- [API Documentation](docs/api.md) - Endpoint specifications
- [Workflow Guide](workflows/README.md) - n8n workflow setup

## 🎮 Try It Live

**Demo URL**: [https://arthacharya-a1303.web.app](https://arthacharya-a1303.web.app)

**Test Credentials**:
- Phone: Any 10-digit number starting with 6-9
- OTP: Check browser console for demo OTP

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🏆 Hackathon Submission

### Innovation Points
- **Agentic AI**: Autonomous financial decision-making
- **Firebase Integration**: Professional cloud infrastructure  
- **Real-time Processing**: Live financial analysis
- **Crisis Prevention**: Proactive financial protection

### Technical Excellence
- **Clean Architecture**: Modular, maintainable codebase
- **Security First**: No hardcoded credentials, secure by design
- **User Experience**: Professional fintech-grade interface
- **Scalability**: Cloud-native, horizontally scalable

### Business Viability
- **Market Need**: Addresses real financial planning gaps
- **User-Centric**: Solves actual user pain points
- **Monetization**: Multiple revenue stream potential
- **Growth Potential**: Expandable to full financial suite

## 📞 Contact & Support

- **Team**: Arthacharya AI Team
- **Email**: team@arthacharya.ai
- **GitHub**: [Issues](https://github.com/your-username/arthacharya-ai-financial-guru/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the future of financial technology**
