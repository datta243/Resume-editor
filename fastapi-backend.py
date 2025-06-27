from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import os
from datetime import datetime
import random

app = FastAPI(title="Resume Editor API", description="Backend API for Resume Editor", version="1.0.0")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for resumes (in production, use a database)
resume_storage = {}

# Pydantic models for request/response
class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class AIEnhanceResponse(BaseModel):
    enhanced_content: str
    original_content: str
    section: str

class PersonalInfo(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    summary: str

class Experience(BaseModel):
    id: int
    title: str
    company: str
    duration: str
    description: str

class Education(BaseModel):
    id: int
    degree: str
    school: str
    year: str
    gpa: str

class Skill(BaseModel):
    id: int
    name: str
    level: str

class Resume(BaseModel):
    personalInfo: PersonalInfo
    experience: List[Experience]
    education: List[Education]
    skills: List[Skill]

class SaveResumeResponse(BaseModel):
    message: str
    resume_id: str
    timestamp: str

# Mock AI enhancement templates
AI_ENHANCEMENT_TEMPLATES = {
    "summary": [
        "Results-driven professional with proven expertise in {domain}. {original} Demonstrated ability to lead cross-functional teams and deliver innovative solutions that drive business growth.",
        "Accomplished {role} with extensive experience in {field}. {original} Known for exceptional problem-solving skills and commitment to excellence in all endeavors.",
        "Dynamic professional with a track record of success in {industry}. {original} Passionate about leveraging cutting-edge technologies to create impactful solutions."
    ],
    "experience": [
        "{original} Successfully collaborated with diverse stakeholders to ensure project alignment with business objectives and user requirements.",
        "{original} Implemented industry best practices and mentored junior team members, contributing to overall team productivity and knowledge sharing.",
        "{original} Utilized agile methodologies to streamline processes, resulting in improved efficiency and faster time-to-market for key initiatives."
    ],
    "education": [
        "{original} Completed rigorous coursework in advanced topics including data structures, algorithms, and software engineering principles.",
        "{original} Participated in research projects and maintained academic excellence while developing practical skills through hands-on learning experiences.",
        "{original} Engaged in collaborative learning environments and contributed to academic community through peer tutoring and study groups."
    ],
    "skills": [
        "{original} - Demonstrated through successful implementation in multiple high-impact projects and continuous professional development.",
        "{original} - Applied in real-world scenarios with measurable results and positive feedback from stakeholders and team members.",
        "{original} - Continuously expanding knowledge through ongoing training, certifications, and hands-on practice in emerging technologies."
    ]
}

def mock_ai_enhance(section: str, content: str) -> str:
    """Mock AI enhancement function that improves resume content"""
    if not content.strip():
        return "Please provide content to enhance."
    
    # Get appropriate templates for the section
    templates = AI_ENHANCEMENT_TEMPLATES.get(section, AI_ENHANCEMENT_TEMPLATES["experience"])
    
    # Choose a random template
    template = random.choice(templates)
    
    # Try to extract domain/role/field information for more personalized enhancement
    enhanced_content = template.format(original=content)
    
    # Additional section-specific enhancements
    if section == "summary":
        # Extract potential roles or domains
        if "developer" in content.lower():
            enhanced_content = enhanced_content.replace("{domain}", "software development").replace("{role}", "developer").replace("{field}", "technology").replace("{industry}", "technology")
        elif "manager" in content.lower():
            enhanced_content = enhanced_content.replace("{domain}", "project management").replace("{role}", "manager").replace("{field}", "leadership").replace("{industry}", "business")
        else:
            enhanced_content = enhanced_content.replace("{domain}", "their field").replace("{role}", "professional").replace("{field}", "their area of expertise").replace("{industry}", "their industry")
    
    # Clean up any remaining placeholders
    enhanced_content = enhanced_content.replace("{domain}", "").replace("{role}", "").replace("{field}", "").replace("{industry}", "")
    
    return enhanced_content.strip()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Resume Editor API is running!", "status": "healthy"}

@app.post("/ai-enhance", response_model=AIEnhanceResponse)
async def ai_enhance(request: AIEnhanceRequest):
    """
    Enhance resume section content using mock AI
    """
    try:
        # Validate input
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        valid_sections = ["summary", "experience", "education", "skills"]
        if request.section not in valid_sections:
            raise HTTPException(status_code=400, detail=f"Invalid section. Must be one of: {valid_sections}")
        
        # Mock AI enhancement
        enhanced_content = mock_ai_enhance(request.section, request.content)
        
        return AIEnhanceResponse(
            enhanced_content=enhanced_content,
            original_content=request.content,
            section=request.section
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@app.post("/save-resume", response_model=SaveResumeResponse)
async def save_resume(resume: Resume):
    """
    Save resume data to storage
    """
    try:
        # Generate unique resume ID
        resume_id = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}"
        timestamp = datetime.now().isoformat()
        
        # Convert resume to dict for storage
        resume_data = {
            "resume_id": resume_id,
            "timestamp": timestamp,
            "data": resume.dict()
        }
        
        # Store in memory (in production, save to database)
        resume_storage[resume_id] = resume_data
        
        # Also save to file for persistence (optional)
        os.makedirs("saved_resumes", exist_ok=True)
        file_path = f"saved_resumes/{resume_id}.json"
        
        with open(file_path, 'w') as f:
            json.dump(resume_data, f, indent=2)
        
        return SaveResumeResponse(
            message="Resume saved successfully",
            resume_id=resume_id,
            timestamp=timestamp
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save resume: {str(e)}")

@app.get("/resume/{resume_id}")
async def get_resume(resume_id: str):
    """
    Retrieve a saved resume by ID
    """
    if resume_id not in resume_storage:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume_storage[resume_id]

@app.get("/resumes")
async def list_resumes():
    """
    List all saved resumes
    """
    return {
        "resumes": list(resume_storage.keys()),
        "count": len(resume_storage)
    }

@app.delete("/resume/{resume_id}")
async def delete_resume(resume_id: str):
    """
    Delete a saved resume
    """
    if resume_id not in resume_storage:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Remove from memory storage
    del resume_storage[resume_id]
    
    # Remove file if it exists
    file_path = f"saved_resumes/{resume_id}.json"
    if os.path.exists(file_path):
        os.remove(file_path)
    
    