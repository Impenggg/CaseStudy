import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { triggerAction } from '../lib/uiActions';
import { storiesAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const StorySubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    email: '',
    readTime: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UI labels -> backend enum mapping
  const CATEGORY_MAP: Record<string, 'tradition' | 'technique' | 'artisan' | 'community'> = {
    'Artisan Profile': 'artisan',
    'Artisan': 'artisan',
    'Techniques': 'technique',
    'Technique': 'technique',
    'Cultural Heritage': 'tradition',
    'Tradition': 'tradition',
    'Community': 'community',
    // Fallback labels route to a sensible default
    'Business': 'community',
    'Education': 'community',
  };

  const categories = [
    'Artisan Profile',
    'Techniques',
    'Cultural Heritage',
    'Community'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (!user) {
        // Preserve intent and redirect to login
        sessionStorage.setItem('intended_path', '/submit-story');
        navigate('/login');
        return;
      }

      // Build payload. Excerpt from first 160 chars; server will associate author from auth.
      const excerpt = formData.content.slice(0, 160);
      const backendCategory = CATEGORY_MAP[formData.category] ?? 'community';

      const payload: any = {
        title: formData.title,
        content: formData.content,
        excerpt,
        category: backendCategory,
        media_url: '',
        media_type: 'image',
        tags: [],
        featured: false,
        published: true,
        reading_time: Number(formData.readTime) || 1,
      };

      await storiesAPI.create(payload as any);
      triggerAction(`Story submitted: ${formData.title}`);
      setShowSuccess(true);
      setFormData({ title: '', content: '', category: '', author: '', email: '', readTime: 5 });
    } catch (err: any) {
      console.error('[StorySubmissionPage] create failed', err?.response?.data || err);
      setErrorMsg(err?.response?.data?.message || 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-cordillera-cream flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-cordillera-olive mb-4">Story Submitted Successfully!</h1>
          <p className="text-cordillera-olive/70 mb-8">
            Thank you for sharing your story. Our team will review it and get back to you soon.
          </p>
          <div className="space-y-3">
            <Link
              to="/my-stories"
              className="block w-full bg-cordillera-gold text-cordillera-olive py-3 px-6 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
            >
              Go to My Stories
            </Link>
            <button
              onClick={() => setShowSuccess(false)}
              className="block w-full border border-cordillera-olive/20 text-cordillera-olive py-3 px-6 rounded-lg font-medium hover:bg-cordillera-olive/5 transition-colors"
            >
              Submit Another Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {/* Breadcrumb */}
      <div className="bg-cordillera-olive py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-cordillera-cream">
            <Link to="/stories" className="hover:text-cordillera-gold transition-colors">Stories</Link>
            <span>/</span>
            <span className="text-cordillera-cream/60">Submit Story</span>
          </div>
        </div>
      </div>

      {/* Return Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackLink to="/stories" className="mb-6">Back to Stories</BackLink>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-cordillera-olive mb-6">
            Share Your Story
          </h1>
          <p className="text-xl text-cordillera-olive/70 max-w-2xl mx-auto leading-relaxed">
            Help preserve Cordillera heritage by sharing your weaving journey, techniques, 
            or cultural insights with our community.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">
                {errorMsg}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter your story title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cordillera-olive mb-2">
                Story Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Share your story, techniques, or cultural insights..."
              />
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Estimated Read Time (minutes)
                </label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-cordillera-sage/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-cordillera-olive mb-3">Submission Guidelines</h3>
              <ul className="text-sm text-cordillera-olive/70 space-y-2">
                <li>• Stories should be authentic and related to Cordillera weaving heritage</li>
                <li>• Include personal experiences, techniques, or cultural insights</li>
                <li>• Respect cultural traditions and community values</li>
                <li>• We'll review your submission and may contact you for additional details</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-6">
              <Link
                to="/stories"
                className="flex-1 px-6 py-3 border border-cordillera-olive/20 rounded-lg text-cordillera-olive hover:bg-cordillera-olive/5 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-cordillera-gold text-cordillera-olive py-3 px-6 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Story'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StorySubmissionPage;
