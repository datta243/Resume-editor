# Resume Editor - Complete Setup Guide

This is a full-stack Resume Editor application with a React frontend and FastAPI backend that allows users to upload, edit, enhance, and save their resumes.

## Features

### Frontend (React)
- ✅ Upload resume files (.pdf, .docx) with mock parsing
- ✅ Edit all resume sections (Personal Info, Experience, Education, Skills)
- ✅ AI enhancement for each section using mock AI backend
- ✅ Add/remove entries dynamically
- ✅ Save resume to backend
- ✅ Download resume as JSON
- ✅ Modern, responsive UI with Tailwind CSS

### Backend (FastAPI)
- ✅ `/ai-enhance` endpoint with mock AI enhancement
- ✅ `/save-resume` endpoint for storing resumes
- ✅ Resume retrieval and management endpoints
- ✅ CORS enabled for frontend integration
- ✅ File-based persistence
- ✅ Comprehensive error handling

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn

### Backend Setup

1. **Create a new directory and set up Python environment:**
```bash
mkdir resume-editor-backend
cd resume-editor-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. **Install dependencies:**
```bash
pip install fastapi uvicorn python-multipart
```

3. **Create the FastAPI backend file:**
- Copy the FastAPI backend code into a file named `main.py`

4. **Run the backend:**
```bash
python main.py
```

The backend will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`

### Frontend Setup

1. **Create React application:**
```bash
# In a new terminal/directory
npx create-react-app resume-editor-frontend
cd resume-editor-frontend

# Install additional dependencies
npm install lucide-react
```

2. **Replace the default App.js:**
- Copy the React component code into `src/App.js`
- Make sure to import the component properly

3. **Update src/App.js:**
```javascript
import React from 'react';
import ResumeEditor from './ResumeEditor'; // If you create a separate component file
// OR just paste the entire component code here

function App() {
  return (
    <div className="App">
      <ResumeEditor />
    </div>
  );
}

export default App;
```

4. **Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

5. **Configure Tailwind (tailwind.config.js):**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

6. **Add Tailwind to src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

7. **Run the frontend:**
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### POST /ai-enhance
Enhance resume section content using mock AI.

**Request:**
```json
{
  "section": "summary",
  "content": "Experienced developer with 5+ years in web development."
}
```

**Response:**
```json
{
  "enhanced_content": "Results-driven professional with proven expertise in software development. Experienced developer with 5+ years in web development. Demonstrated ability to lead cross-functional teams and deliver innovative solutions that drive business growth.",
  "original_content": "Experienced developer with 5+ years in web development.",
  "section": "summary"
}
```

### POST /save-resume
Save complete resume data.

**Request:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "location": "New York, NY",
    "summary": "Experienced developer..."
  },
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

**Response:**
```json
{
  "message": "Resume saved successfully",
  "resume_id": "resume_20241127_143022_1234",
  "timestamp": "2024-11-27T14:30:22.123456"
}
```

### Additional Endpoints
- `GET /` - Health check
- `GET /resume/{resume_id}` - Retrieve specific resume
- `GET /resumes` - List all saved resumes
- `DELETE /resume/{resume_id}` - Delete a resume
- `GET /health` - Detailed health check
- `POST /test-enhance` - Test AI enhancement functionality

## Usage Instructions

1. **Upload Resume:** Click "Upload Resume" to load sample data (mocked parsing)
2. **Edit Sections:** Modify personal information, experience, education, and skills
3. **AI Enhancement:** Click "Enhance with AI" buttons to improve content using mock AI
4. **Add/Remove Entries:** Use + and trash icons to manage experience, education, and skills
5. **Save Resume:** Click "Save Resume" to store data on backend
6. **Download:** Click "Download JSON" to save resume locally

## File Structure

```
resume-editor/
├── backend/
│   ├── main.py
│   ├── saved_resumes/ (created automatically)
│   └── venv/
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── ResumeEditor.js (optional separate file)
    │   └── index.css
    ├── public/
    └── package.json
```

## Customization Options

### Backend Customization
- **Database Integration:** Replace in-memory storage with PostgreSQL, MongoDB, etc.
- **Real AI Integration:** Connect to OpenAI, Anthropic, or other AI services
- **File Parsing:** Add real PDF/DOCX parsing using libraries like PyPDF2, python-docx
- **Authentication:** Add user authentication and authorization
- **File Upload:** Implement actual file upload handling

### Frontend Customization
- **Styling:** Customize colors, layout, and components
- **Additional Sections:** Add projects, certifications, languages, etc.
- **Export Options:** Add PDF export functionality
- **Templates:** Create multiple resume templates
- **Real-time Preview:** Add live resume preview

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure backend CORS is configured for your frontend URL
   - Check that both frontend and backend are running

2. **Module Not Found:**
   - Ensure all dependencies are installed
   - Check virtual environment activation for backend

3. **Port Conflicts:**
   - Backend default: port 8000
   - Frontend default: port 3000
   - Change ports if needed

4. **AI Enhancement Not Working:**
   - Check backend connection
   - Verify API endpoints are accessible
   - The app will fallback to mock enhancement if backend is unavailable

### Development Tips

- Use browser developer tools to debug API calls
- Check backend logs for error details
- Test API endpoints directly using the FastAPI docs at `/docs`
- Monitor network requests in browser dev tools

## Next Steps

1. **Deploy Backend:** Use services like Heroku, AWS, or DigitalOcean
2. **Deploy Frontend:** Use Netlify, Vercel, or AWS S3
3. **Add Database:** Integrate PostgreSQL or MongoDB
4. **Real AI Integration:** Connect to actual AI services
5. **Authentication:** Add user accounts and login
6. **PDF Export:** Implement PDF generation
7. **File Upload:** Add real file parsing capabilities

## Dependencies

### Backend
```
fastapi>=0.104.1
uvicorn>=0.24.0
python-multipart>=0.0.6
pydantic>=2.4.2
```

### Frontend
```
react>=18.0.0
lucide-react>=0.263.1
tailwindcss>=3.3.0
```

This setup provides a fully functional resume editor with both frontend and backend components ready for development and customization.
