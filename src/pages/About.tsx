import React from 'react';
import { Clock, Brain, Target, TrendingUp, CheckCircle, Timer, Zap, Award } from 'lucide-react';

const About: React.FC = () => {
  const benefits = [
    {
      icon: Brain,
      title: 'Enhanced Focus',
      description: 'Train your brain to maintain deep concentration for extended periods'
    },
    {
      icon: Target,
      title: 'Better Time Management',
      description: 'Learn to estimate and allocate time more effectively for your tasks'
    },
    {
      icon: TrendingUp,
      title: 'Increased Productivity',
      description: 'Accomplish more meaningful work in less time with structured sessions'
    },
    {
      icon: CheckCircle,
      title: 'Reduced Procrastination',
      description: 'Break large tasks into manageable chunks to overcome overwhelm'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Choose a Task',
      description: 'Select something you want to work on and estimate how many Pomodoros it will take'
    },
    {
      step: 2,
      title: 'Start the Timer',
      description: 'Begin a 25-minute focused work session without any distractions'
    },
    {
      step: 3,
      title: 'Take a Break',
      description: 'When the timer rings, take a 5-minute break to recharge'
    },
    {
      step: 4,
      title: 'Repeat & Track',
      description: 'After 4 Pomodoros, take a longer 15-minute break and review your progress'
    }
  ];

  const features = [
    {
      icon: Timer,
      title: 'Smart Timer',
      description: 'Automatic break scheduling with visual progress tracking'
    },
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Link your Pomodoro sessions to specific tasks and projects'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Beautiful charts showing your productivity patterns and trends'
    },
    {
      icon: Zap,
      title: 'Session Tracking',
      description: 'Detailed logs of all your focus sessions and achievements'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-teal-200 dark:border-teal-800 transition-colors duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Clock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
          Master Your Time with TimeVault
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
          TimeVault combines the proven Pomodoro Technique with modern task management 
          and analytics to help you achieve peak productivity and maintain laser-sharp focus.
        </p>
      </div>

      {/* What is the Pomodoro Technique */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center transition-colors duration-300">
          <Brain className="w-8 h-8 mr-3 text-teal-600 dark:text-teal-400" />
          What is the Pomodoro Technique?
        </h2>
        <div className="prose max-w-none text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <p className="text-lg mb-4">
            The Pomodoro Technique is a time management method developed by Francesco Cirillo 
            in the late 1980s. It uses a timer to break work into intervals, traditionally 
            25 minutes in length, separated by short breaks.
          </p>
          <p>
            Named after the tomato-shaped kitchen timer Cirillo used as a university student, 
            this technique is based on the idea that frequent breaks can improve mental agility 
            and help maintain focus throughout your work sessions.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center transition-colors duration-300">
          How the Pomodoro Technique Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center transition-colors duration-300">
          Why the Pomodoro Technique Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                <benefit.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TimeVault Features */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center transition-colors duration-300">
          TimeVault Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Backing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center transition-colors duration-300">
          <Award className="w-8 h-8 mr-3 text-orange-600 dark:text-orange-400" />
          Scientific Research
        </h2>
        <div className="prose max-w-none text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <p className="mb-4">
            Research in cognitive psychology supports the effectiveness of the Pomodoro Technique:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Attention Restoration:</strong> Regular breaks help restore mental resources 
              and prevent cognitive fatigue
            </li>
            <li>
              <strong>Time Boxing:</strong> Parkinson's Law states that work expands to fill available time. 
              Fixed intervals create urgency and focus
            </li>
            <li>
              <strong>Flow State:</strong> 25-minute sessions are optimal for entering deep work states 
              without mental exhaustion
            </li>
            <li>
              <strong>Habit Formation:</strong> The structured routine helps build consistent work habits 
              and reduces decision fatigue
            </li>
          </ul>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of users who have already improved their focus and achieved their goals with TimeVault.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2 text-teal-100">
            <CheckCircle className="w-5 h-5" />
            <span>Free to use</span>
          </div>
          <div className="flex items-center space-x-2 text-teal-100">
            <CheckCircle className="w-5 h-5" />
            <span>No ads or distractions</span>
          </div>
          <div className="flex items-center space-x-2 text-teal-100">
            <CheckCircle className="w-5 h-5" />
            <span>Beautiful analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;