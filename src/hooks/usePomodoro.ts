import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type SessionType = 'focus' | 'short_break' | 'long_break';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  sessionType: SessionType;
  completedPomodoros: number;
  currentTaskId: string | null;
  sessionId: string | null;
}

const FOCUS_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

const getInitialTime = (type: SessionType): number => {
  switch (type) {
    case 'focus':
      return FOCUS_TIME;
    case 'short_break':
      return SHORT_BREAK;
    case 'long_break':
      return LONG_BREAK;
  }
};

export const usePomodoro = () => {
  const { user } = useAuth();
  const [state, setState] = useState<PomodoroState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('pomodoro-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isRunning: false, // Always start paused after reload
        };
      } catch {
        // If parsing fails, use default state
      }
    }
    
    return {
      timeLeft: FOCUS_TIME,
      isRunning: false,
      sessionType: 'focus' as SessionType,
      completedPomodoros: 0,
      currentTaskId: null,
      sessionId: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoro-state', JSON.stringify(state));
  }, [state]);

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (state.isRunning && state.timeLeft > 0) {
      interval = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRunning, state.timeLeft]);

  // Handle session completion
  useEffect(() => {
    if (state.timeLeft === 0 && state.isRunning) {
      handleSessionComplete();
    }
  }, [state.timeLeft, state.isRunning]);

  const createSession = async (taskId: string | null, sessionType: SessionType) => {
    if (!user) return null;

    const plannedDuration = getInitialTime(sessionType) / 60; // Convert to minutes

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert({
        user_id: user.id,
        task_id: taskId,
        session_type: sessionType,
        planned_duration: plannedDuration,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return null;
    }

    return data.id;
  };

  const completeSession = async (sessionId: string, actualDuration: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('pomodoro_sessions')
      .update({
        actual_duration: actualDuration,
        ended_at: new Date().toISOString(),
        completed: true,
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleSessionComplete = async () => {
    const { sessionType, completedPomodoros, sessionId } = state;
    
    // Complete current session in database
    if (sessionId) {
      const actualDuration = (getInitialTime(sessionType)) / 60; // Full duration in minutes
      await completeSession(sessionId, actualDuration);
    }

    let nextSessionType: SessionType;
    let newCompletedPomodoros = completedPomodoros;

    if (sessionType === 'focus') {
      newCompletedPomodoros += 1;
      // After 4 focus sessions, take a long break
      nextSessionType = newCompletedPomodoros % 4 === 0 ? 'long_break' : 'short_break';
    } else {
      // After any break, go back to focus
      nextSessionType = 'focus';
    }

    setState(prev => ({
      ...prev,
      isRunning: false,
      sessionType: nextSessionType,
      timeLeft: getInitialTime(nextSessionType),
      completedPomodoros: newCompletedPomodoros,
      sessionId: null,
    }));

    // Play notification sound or show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TimeVault', {
        body: sessionType === 'focus' 
          ? 'Focus session completed! Time for a break.' 
          : 'Break time over! Ready for another focus session?',
        icon: '/vite.svg'
      });
    }
  };

  const start = useCallback(async (taskId?: string) => {
    if (!state.isRunning) {
      // Create new session when starting
      const sessionId = await createSession(
        taskId || state.currentTaskId, 
        state.sessionType
      );
      
      setState(prev => ({
        ...prev,
        isRunning: true,
        currentTaskId: taskId || prev.currentTaskId,
        sessionId,
      }));

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [state.isRunning, state.currentTaskId, state.sessionType, user]);

  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeLeft: getInitialTime(prev.sessionType),
      isRunning: false,
      sessionId: null,
    }));
  }, []);

  const skip = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeLeft: 0,
    }));
  }, []);

  const setCurrentTask = useCallback((taskId: string | null) => {
    setState(prev => ({
      ...prev,
      currentTaskId: taskId,
    }));
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    ...state,
    start,
    pause,
    reset,
    skip,
    setCurrentTask,
    formatTime,
  };
};