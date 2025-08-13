import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { triggerAction } from '../lib/uiActions';

const CampaignCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    organizer: '',
    email: '',
    phone: '',
    goalAmount: '',
    endDate: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Documentation',
    'Equipment',
    'Education',
    'Support',
    'Community',
    'Preservation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      triggerAction(`Campaign created: ${formData.title} with goal ₱${parseInt(formData.goalAmount).toLocaleString()}`);
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        organizer: '',
        email: '',
        phone: '',
        goalAmount: '',
        endDate: '',
        imageUrl: ''
      });
    }, 2000);
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
          <h1 className="text-2xl font-serif text-cordillera-olive mb-4">Campaign Created Successfully!</h1>
          <p className="text-cordillera-olive/70 mb-8">
            Your campaign has been submitted for review. We'll contact you soon to discuss next steps.
          </p>
          <div className="space-y-3">
            <Link
              to="/stories"
              className="block w-full bg-cordillera-gold text-cordillera-olive py-3 px-6 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
            >
              Back to Stories
            </Link>
            <button
              onClick={() => setShowSuccess(false)}
              className="block w-full border border-cordillera-olive/20 text-cordillera-olive py-3 px-6 rounded-lg font-medium hover:bg-cordillera-olive/5 transition-colors"
            >
              Create Another Campaign
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
            <span className="text-cordillera-cream/60">Create Campaign</span>
          </div>
        </div>
      </div>

      {/* Return Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link 
          to="/stories" 
          className="inline-flex items-center text-cordillera-olive hover:text-cordillera-gold transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Stories
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-cordillera-olive mb-6">
            Start Your Campaign
          </h1>
          <p className="text-xl text-cordillera-olive/70 max-w-2xl mx-auto leading-relaxed">
            Launch a fundraising campaign to support Cordillera weaving heritage projects 
            and rally community support for preserving our cultural traditions.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter your campaign title"
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

            <div>
              <label className="block text-sm font-medium text-cordillera-olive mb-2">
                Campaign Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Describe your campaign goals, impact, and how the funds will be used..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter organizer name"
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Goal Amount (₱) *
                </label>
                <input
                  type="number"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                  required
                  min="1000"
                  step="1000"
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="Enter goal amount"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">
                  Campaign Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="bg-cordillera-sage/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-cordillera-olive mb-3">Campaign Guidelines</h3>
              <ul className="text-sm text-cordillera-olive/70 space-y-2">
                <li>• Campaigns must support Cordillera weaving heritage preservation</li>
                <li>• Provide clear goals and how funds will be used</li>
                <li>• Set realistic funding goals and timelines</li>
                <li>• Include high-quality images that represent your project</li>
                <li>• We'll review your campaign and may request additional information</li>
                <li>• Campaigns typically run for 30-90 days</li>
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
                    Creating...
                  </span>
                ) : (
                  'Create Campaign'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationPage;
