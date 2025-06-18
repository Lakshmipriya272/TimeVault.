import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Lightbulb, Bug, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Feedback: React.FC = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState({
    type: 'suggestion',
    subject: '',
    message: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' },
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30' },
    { value: 'compliment', label: 'Compliment', icon: Heart, color: 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30' },
    { value: 'general', label: 'General', icon: MessageSquare, color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          type: feedback.type,
          subject: feedback.subject,
          message: feedback.message,
          rating: feedback.rating,
          user_email: user.email
        });

      if (error) throw error;

      setSubmitted(true);
      setFeedback({
        type: 'suggestion',
        subject: '',
        message: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center transition-colors duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
            Thank You for Your Feedback!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
            We appreciate you taking the time to help us improve TimeVault. 
            Your input is valuable and helps us create a better experience for everyone.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Submit More Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-teal-200 dark:border-teal-800 transition-colors duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">We'd Love Your Feedback</h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Help us make TimeVault even better! Share your thoughts, suggestions, 
          or report any issues you've encountered.
        </p>
      </div>

      {/* Feedback Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
              What type of feedback is this?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, type: type.value })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    feedback.type === type.value
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${type.color}`}>
                      <type.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
              How would you rate your overall experience with TimeVault?
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, rating: star })}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    star <= feedback.rating
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
                  }`}
                >
                  <Star className="w-6 h-6 mx-auto fill-current" />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {feedback.rating} star{feedback.rating !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Subject
            </label>
            <input
              type="text"
              value={feedback.subject}
              onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Your Message
            </label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-300 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Tell us more about your experience, suggestions, or any issues you've encountered..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;