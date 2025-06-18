import React from 'react';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useTasks } from '../../hooks/useTasks';

const PomodoroTimer: React.FC = () => {
  const {
    timeLeft,
    isRunning,
    sessionType,
    completedPomodoros,
    currentTaskId,
    start,
    pause,
    reset,
    skip,
    setCurrentTask,
    formatTime,
  } = usePomodoro();

  const { tasks } = useTasks();
  const currentTask = tasks.find(task => task.id === currentTaskId);

  const getSessionTitle = () => {
    switch (sessionType) {
      case 'focus':
        return 'Focus Session';
      case 'short_break':
        return 'Short Break';
      case 'long_break':
        return 'Long Break';
    }
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'from-teal-500 to-teal-600';
      case 'short_break':
        return 'from-blue-500 to-blue-600';
      case 'long_break':
        return 'from-orange-500 to-orange-600';
    }
  };

  const progress = () => {
    const total = sessionType === 'focus' ? 25 * 60 : sessionType === 'short_break' ? 5 * 60 : 15 * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const activeTasks = tasks.filter(task => !task.completed);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-lg mx-auto transition-colors duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{getSessionTitle()}</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          {completedPomodoros} Pomodoro{completedPomodoros !== 1 ? 's' : ''} completed today
        </p>
      </div>

      {/* Progress Ring */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-gray-700 transition-colors duration-300"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress() / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`text-teal-500`} stopColor="currentColor" />
              <stop offset="100%" className={`text-teal-600`} stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
              {formatTime(timeLeft)}
            </div>
            {currentTask && (
              <div className="text-sm text-gray-600 dark:text-gray-400 max-w-32 truncate transition-colors duration-300">
                {currentTask.title}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Selection */}
      {sessionType === 'focus' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Current Task (Optional)
          </label>
          <select
            value={currentTaskId || ''}
            onChange={(e) => setCurrentTask(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            disabled={isRunning}
          >
            <option value="">No specific task</option>
            {activeTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => isRunning ? pause() : start()}
          className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getSessionColor()} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        
        <button
          onClick={reset}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <Square className="w-5 h-5" />
        </button>
        
        <button
          onClick={skip}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Session Info */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
        {sessionType === 'focus' && "Focus for 25 minutes"}
        {sessionType === 'short_break' && "Take a 5-minute break"}
        {sessionType === 'long_break' && "Enjoy a 15-minute break"}
      </div>
    </div>
  );
};

export default PomodoroTimer;