import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, Clock } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

const TaskManager: React.FC = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimated_pomodoros: 1,
  });

  const handleCreate = async () => {
    if (newTask.title.trim()) {
      await createTask(newTask);
      setNewTask({ title: '', description: '', estimated_pomodoros: 1 });
      setIsCreating(false);
    }
  };

  const handleEdit = async (id: string, updates: any) => {
    await updateTask(id, updates);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Create Task Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">Task Manager</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Create Task Form */}
      {isCreating && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-teal-500 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Create New Task</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Estimated Pomodoros
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newTask.estimated_pomodoros}
                onChange={(e) => setNewTask({ ...newTask, estimated_pomodoros: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Create Task
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewTask({ title: '', description: '', estimated_pomodoros: 1 });
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
          Active Tasks ({activeTasks.length})
        </h2>
        <div className="grid gap-4">
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              onEdit={(updates) => handleEdit(task.id, updates)}
              onDelete={() => handleDelete(task.id)}
              onToggleComplete={() => toggleComplete(task.id)}
              onStartEdit={() => setEditingId(task.id)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active tasks. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isEditing={false}
                onDelete={() => handleDelete(task.id)}
                onToggleComplete={() => toggleComplete(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: any;
  isEditing: boolean;
  onEdit?: (updates: any) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isEditing,
  onEdit,
  onDelete,
  onToggleComplete,
  onStartEdit,
  onCancelEdit,
}) => {
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    estimated_pomodoros: task.estimated_pomodoros,
  });

  const handleSave = () => {
    onEdit?.(editForm);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-colors duration-300">
        <div className="space-y-4">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            rows={3}
          />
          <input
            type="number"
            min="1"
            max="20"
            value={editForm.estimated_pomodoros}
            onChange={(e) => setEditForm({ ...editForm, estimated_pomodoros: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
          />
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${task.completed ? 'border-green-500 opacity-75' : 'border-gray-300 dark:border-gray-600'} hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={onToggleComplete}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {task.completed && <Check className="w-4 h-4" />}
            </button>
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`mb-3 transition-colors duration-300 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{task.estimated_pomodoros} Pomodoro{task.estimated_pomodoros !== 1 ? 's' : ''}</span>
            </span>
            <span>
              Created {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {!task.completed && onStartEdit && (
            <button
              onClick={onStartEdit}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-300"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
