# Placement Preparation Portal

A full-stack, AI-powered web application built for students to track company job applications, generate company-specific interview questions, manage placement schedules, compare job offers, build ATS-friendly resumes, and organize prep resources.

---

## Key Features

### 🏢 Application Tracking & Analytics
- **Dashboard Summary**: Real-time counters for Total Applications, Active Statuses, Selected Offers, and Rejections.
- **CRUD Operations**: Log Company Name, Role Title, Application Date, Status (`Applied`, `Online Assessment`, `Technical Interview`, `HR Interview`, `Selected`, `Rejected`), CTC Salary, Location, and Interview Notes.
- **Search & Filtering**: Search applications by company or role with instant category filters.
- **Wishlist & CSV Export**: Star priority applications and export data directly to CSV.

### 🤖 AI Interview Prep & Question Generator
- **AI-Powered Question Engine**: Generate realistic, company-tailored technical, coding, system design, and behavioral questions powered by **OpenRouter AI (Llama 3.3 70B)** or **Google Gemini AI**.
- **Model Answer Guides**: View structured answer guides detailing Core Approach, Implementation Steps, Edge Cases, and Complexity.
- **Saved Question Notebook**: Save important questions into a personal revision notebook stored in MongoDB.
- **Animated Paper Dustbin Loader**: Interactive animated dustbin loading component while questions are drafted.

### 📄 ATS Resume Builder
- **7-Section Live Resume Generator**: Personal Info, Summary, Education, Experience, Projects, Skills, and Certifications.
- **Dynamic PDF Print**: Render ATS-friendly paper previews and print directly to PDF.

### 📅 Placement Schedule Calendar
- **Event & Deadline Manager**: Schedule Online Assessments, Technical Interviews, HR slots, and Application Deadlines.

### ⚖️ Offer Comparison Matrix
- **Side-by-Side Offer Evaluator**: Compare CTC, Base Pay, Stocks/RSUs, Joining Bonus, Location, and Work Mode.
- **MongoDB Persistence**: Save received offers directly to your account database.

### 🎨 UI & Interactive Effects
- **TargetCursor Component**: Custom GSAP cursor lock-on effect on interactive cards and buttons.
- **ScrollStack Smooth Stacking**: Interactive Lenis smooth-stacking card animation for generated question lists.
- **Teal Design System**: Vibrant Teal (`#06C3B4`) accent palette with dark mode support.

---

## Tech Stack

- **Frontend**: React 18, Vite, GSAP (`TargetCursor`), Lenis (`ScrollStack`), Lucide Icons, Vanilla CSS (Design Tokens & Dark Mode)
- **Backend**: Node.js, Express.js, JWT Authentication (`jsonwebtoken`), `bcryptjs`
- **Database**: MongoDB Atlas (`mongoose`)
- **AI Integrations**: OpenRouter API (`meta-llama/llama-3.3-70b-instruct`, `openrouter/free`) & Google Gemini API (`gemini-2.0-flash`)

---

## Getting Started & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas Connection URI

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd Alt+f4

# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend` directory (refer to `backend/.env.example`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.vwiulx1.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Run Application

Run both backend and frontend servers simultaneously using a single command from the root folder:

```bash
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

---

## License

MIT License
