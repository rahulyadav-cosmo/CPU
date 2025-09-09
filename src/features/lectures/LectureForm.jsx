import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function LectureForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addLecture, updateLecture } = useApp();
  
  const isEditing = Boolean(id);
  const existingLecture = isEditing ? state.lectures.find(l => l.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && existingLecture) {
      setFormData({
        title: existingLecture.title || '',
        description: existingLecture.description || '',
        content: existingLecture.content || '',
        image: existingLecture.image || ''
      });
    }
  }, [isEditing, existingLecture]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const lectureData = {
      ...formData,
      createdAt: existingLecture?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isEditing) {
      updateLecture({ ...lectureData, id });
    } else {
      addLecture(lectureData);
    }

    navigate('/lectures');
  };

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const sampleContent = `# Introduction to System Design

System design is the process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements.

## Key Concepts

1. **Scalability** - The ability to handle increased load
2. **Reliability** - The probability a system performs correctly
3. **Availability** - The percentage of time a system is operational
4. **Consistency** - All nodes see the same data simultaneously

## System Architecture

\`\`\`mermaid
graph TB
    A[Client] --> B[Load Balancer]
    B --> C[Web Server 1]
    B --> D[Web Server 2]
    C --> E[Database]
    D --> E
\`\`\`

### Load Balancer
Distributes incoming requests across multiple servers to ensure no single server bears too much demand.

### Code Example

\`\`\`javascript
// Simple load balancer implementation
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.current = 0;
  }
  
  getNextServer() {
    const server = this.servers[this.current];
    this.current = (this.current + 1) % this.servers.length;
    return server;
  }
}
\`\`\`

## Summary

Understanding these fundamental concepts is crucial for designing scalable systems.`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/lectures" className="hover:text-gray-700">Lectures</Link>
          <span>→</span>
          <span className="text-gray-900">{isEditing ? 'Edit' : 'New'} Lecture</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Lecture' : 'Create New Lecture'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEditing 
            ? 'Update the lecture content and information'
            : 'Create an interactive lecture with rich content and diagrams'
          }
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange('title')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter lecture title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange('description')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of the lecture content"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="image"
              value={formData.image}
              onChange={handleInputChange('image')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">
              Add an image URL to display at the top of the lecture
            </p>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, content: sampleContent })}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Load Sample Content
              </button>
            </div>
            <textarea
              id="content"
              rows={20}
              value={formData.content}
              onChange={handleInputChange('content')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter lecture content using Markdown syntax..."
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            
            <div className="mt-2 text-sm text-gray-500">
              <p className="font-medium mb-1">Supported formats:</p>
              <ul className="space-y-1 text-xs">
                <li>• Headers: # H1, ## H2, ### H3</li>
                <li>• Lists: - item or 1. numbered item</li>
                <li>• Code blocks: ```javascript ... ```</li>
                <li>• Mermaid diagrams: ```mermaid ... ```</li>
                <li>• **Bold text**, *italic text*</li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t">
            <Link
              to="/lectures"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? 'Update Lecture' : 'Create Lecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}