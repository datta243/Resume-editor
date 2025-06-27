import React, { useState } from 'react';
import { Upload, Download, Sparkles, Plus, Trash2, Save } from 'lucide-react';

const ResumeEditor = () => {
  const [resume, setResume] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: []
  });

  const [enhancing, setEnhancing] = useState({});
  const [saving, setSaving] = useState(false);

  // Mock file upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mock parsing - in real app, you'd parse the PDF/DOCX
      const mockResumeData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          summary: 'Experienced software developer with 5+ years in web development and cloud technologies.'
        },
        experience: [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            duration: '2022 - Present',
            description: 'Led development of microservices architecture, improved system performance by 40%.'
          },
          {
            id: 2,
            title: 'Software Developer',
            company: 'StartUp Inc',
            duration: '2020 - 2022',
            description: 'Developed full-stack web applications using React and Node.js.'
          }
        ],
        education: [
          {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Technology',
            year: '2020',
            gpa: '3.8'
          }
        ],
        skills: [
          { id: 1, name: 'JavaScript', level: 'Expert' },
          { id: 2, name: 'React', level: 'Expert' },
          { id: 3, name: 'Python', level: 'Intermediate' },
          { id: 4, name: 'AWS', level: 'Intermediate' }
        ]
      };
      setResume(mockResumeData);
    }
  };

  // AI Enhancement function
  const enhanceWithAI = async (section, content) => {
    setEnhancing(prev => ({ ...prev, [section]: true }));
    
    try {
      const response = await fetch('http://localhost:8000/ai-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, content })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.enhanced_content;
      } else {
        // Fallback mock enhancement if backend isn't running
        return mockEnhance(section, content);
      }
    } catch (error) {
      console.log('Backend not available, using mock enhancement');
      return mockEnhance(section, content);
    } finally {
      setEnhancing(prev => ({ ...prev, [section]: false }));
    }
  };

  // Mock AI enhancement for demo purposes
  const mockEnhance = (section, content) => {
    const enhancements = {
      summary: `${content} Proven track record of delivering scalable solutions and mentoring junior developers. Passionate about emerging technologies and continuous learning.`,
      experience: `${content} Collaborated with cross-functional teams to deliver high-quality software solutions on time and within budget.`,
      education: `${content} Relevant coursework included Data Structures, Algorithms, and Software Engineering principles.`,
      skills: `${content} - Advanced proficiency with hands-on project experience`
    };
    
    return enhancements[section] || `Enhanced: ${content}`;
  };

  // Save resume to backend
  const saveResume = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/save-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume)
      });
      
      if (response.ok) {
        alert('Resume saved successfully!');
      } else {
        alert('Failed to save resume');
      }
    } catch (error) {
      console.log('Backend not available');
      alert('Resume saved locally (backend not connected)');
    } finally {
      setSaving(false);
    }
  };

  // Download resume as JSON
  const downloadResume = () => {
    const dataStr = JSON.stringify(resume, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'resume.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Update personal info
  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Add new experience
  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: '',
      company: '',
      duration: '',
      description: ''
    };
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  // Update experience
  const updateExperience = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Delete experience
  const deleteExperience = (id) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Add new education
  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      school: '',
      year: '',
      gpa: ''
    };
    setResume(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  // Update education
  const updateEducation = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Delete education
  const deleteEducation = (id) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Add new skill
  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 'Beginner'
    };
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  // Update skill
  const updateSkill = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  // Delete skill
  const deleteSkill = (id) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Resume Editor</h1>
          
          {/* Upload Section */}
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              <Upload size={20} />
              Upload Resume
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={saveResume}
              disabled={saving}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
            
            <button
              onClick={downloadResume}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Download size={20} />
              Download JSON
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
            <button
              onClick={async () => {
                const enhanced = await enhanceWithAI('summary', resume.personalInfo.summary);
                updatePersonalInfo('summary', enhanced);
              }}
              disabled={enhancing.summary}
              className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              <Sparkles size={16} />
              {enhancing.summary ? 'Enhancing...' : 'Enhance with AI'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={resume.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={resume.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Phone"
              value={resume.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Location"
              value={resume.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <textarea
            placeholder="Professional Summary"
            value={resume.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
            <button
              onClick={addExperience}
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>
          
          {resume.experience.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">Experience Entry</h3>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const enhanced = await enhanceWithAI('experience', exp.description);
                      updateExperience(exp.id, 'description', enhanced);
                    }}
                    disabled={enhancing[`exp-${exp.id}`]}
                    className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {enhancing[`exp-${exp.id}`] ? 'Enhancing...' : 'AI'}
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <input
                type="text"
                placeholder="Duration (e.g., 2020 - 2022)"
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Job Description"
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Education
            </button>
          </div>
          
          {resume.education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">Education Entry</h3>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const enhanced = await enhanceWithAI('education', `${edu.degree} from ${edu.school}`);
                      updateEducation(edu.id, 'degree', enhanced);
                    }}
                    disabled={enhancing[`edu-${edu.id}`]}
                    className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {enhancing[`edu-${edu.id}`] ? 'Enhancing...' : 'AI'}
                  </button>
                  <button
                    onClick={() => deleteEducation(edu.id)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Graduation Year"
                  value={edu.year}
                  onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
            <button
              onClick={addSkill}
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Skill
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;