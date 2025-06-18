import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Clock, Target, TrendingUp, CheckCircle, Timer } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, parseISO } from 'date-fns';

interface SessionData {
  id: string;
  session_type: string;
  actual_duration: number;
  started_at: string;
  task_id: string | null;
  task_title?: string;
}

interface StatsData {
  totalSessions: number;
  totalFocusTime: number;
  completedTasks: number;
  averageSessionLength: number;
  todaySessions: number;
  thisWeekSessions: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalSessions: 0,
    totalFocusTime: 0,
    completedTasks: 0,
    averageSessionLength: 0,
    todaySessions: 0,
    thisWeekSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month'>('week');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, timeFrame]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch sessions with task data
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('pomodoro_sessions')
        .select(`
          id,
          session_type,
          actual_duration,
          started_at,
          task_id,
          tasks(title)
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('started_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Fetch completed tasks count
      const { count: completedTasksCount, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('completed', true);

      if (tasksError) throw tasksError;

      const processedSessions = sessionsData?.map(session => ({
        ...session,
        task_title: session.tasks?.title || 'No Task'
      })) || [];

      setSessions(processedSessions);
      calculateStats(processedSessions, completedTasksCount || 0);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionsData: SessionData[], completedTasks: number) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const focusSessions = sessionsData.filter(s => s.session_type === 'focus');
    const totalFocusTime = focusSessions.reduce((sum, s) => sum + (s.actual_duration || 0), 0);
    
    const todaySessions = sessionsData.filter(s => 
      format(parseISO(s.started_at), 'yyyy-MM-dd') === today
    ).length;

    const thisWeekSessions = sessionsData.filter(s => {
      const sessionDate = parseISO(s.started_at);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    }).length;

    setStats({
      totalSessions: focusSessions.length,
      totalFocusTime,
      completedTasks,
      averageSessionLength: focusSessions.length > 0 ? totalFocusTime / focusSessions.length : 0,
      todaySessions,
      thisWeekSessions
    });
  };

  const getDailyData = () => {
    const days = timeFrame === 'week' ? 7 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => 
        format(parseISO(s.started_at), 'yyyy-MM-dd') === dateStr &&
        s.session_type === 'focus'
      );
      
      data.push({
        date: format(date, timeFrame === 'week' ? 'EEE' : 'MMM dd'),
        sessions: daySessions.length,
        minutes: daySessions.reduce((sum, s) => sum + (s.actual_duration || 0), 0)
      });
    }
    
    return data;
  };

  const getTaskDistribution = () => {
    const taskSessions = sessions
      .filter(s => s.session_type === 'focus' && s.task_id)
      .reduce((acc, session) => {
        const taskTitle = session.task_title || 'Unknown Task';
        if (!acc[taskTitle]) {
          acc[taskTitle] = 0;
        }
        acc[taskTitle] += session.actual_duration || 0;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(taskSessions)
      .map(([task, minutes]) => ({ task, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const COLORS = ['#14B8A6', '#3B82F6', '#F97316', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const dailyData = getDailyData();
  const taskDistribution = getTaskDistribution();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">Productivity Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeFrame('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFrame === 'week'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFrame('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFrame === 'month'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-teal-500 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Focus Time</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{formatDuration(stats.totalFocusTime)}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
              <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Focus Sessions</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{stats.totalSessions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
              <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{stats.completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Today's Sessions</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{stats.todaySessions}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sessions Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
            Daily Focus Sessions ({timeFrame === 'week' ? 'This Week' : 'This Month'})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <XAxis dataKey="date" stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
              <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
              <Tooltip 
                formatter={(value) => [value, 'Sessions']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #ffffff)',
                  border: '1px solid var(--tooltip-border, #e5e7eb)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sessions" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Time by Task (Top 5)</h3>
          {taskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="minutes"
                  label={({ task, minutes }) => `${task}: ${formatDuration(minutes)}`}
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatDuration(value as number), 'Time']}
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg, #ffffff)',
                    border: '1px solid var(--tooltip-border, #e5e7eb)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No task data available</p>
                <p className="text-sm">Complete some focus sessions with tasks assigned</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Focus Time Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
          Focus Time Trend ({timeFrame === 'week' ? 'This Week' : 'This Month'})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
            <XAxis dataKey="date" stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
            <Tooltip 
              formatter={(value) => [formatDuration(value as number), 'Focus Time']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'var(--tooltip-bg, #ffffff)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="minutes" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center transition-colors duration-300">
          <TrendingUp className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
          Productivity Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">Average Session Length</p>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {formatDuration(Math.round(stats.averageSessionLength))} per focus session
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">This Week's Progress</p>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {stats.thisWeekSessions} sessions completed
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">Task Completion Rate</p>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {stats.completedTasks} tasks finished
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">Today's Focus</p>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {stats.todaySessions} sessions today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;