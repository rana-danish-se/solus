"use client";

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { Check, Plus, Trash2, ListTodo } from 'lucide-react';

const defaultTasks = [
  { id: 1, label: 'Review Pull Requests', done: false },
  { id: 2, label: 'Update Q3 Product Roadmap', done: false },
  { id: 3, label: 'Prep for client strategy call', done: false },
];

export default function DailyChecklist() {
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storageKey = 'solus_daily_checklist';
    const currentDate = new Date().toDateString();
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.lastDate !== currentDate) {
          // Reset all checks for the new day
          const resetTasks = (parsed.tasks || []).map(t => ({ ...t, done: false }));
          setTasks(resetTasks);
          localStorage.setItem(storageKey, JSON.stringify({ lastDate: currentDate, tasks: resetTasks }));
        } else {
          setTasks(parsed.tasks || []);
        }
      } catch (err) {
        setTasks(defaultTasks);
        localStorage.setItem(storageKey, JSON.stringify({ lastDate: currentDate, tasks: defaultTasks }));
      }
    } else {
      setTasks(defaultTasks);
      localStorage.setItem(storageKey, JSON.stringify({ lastDate: currentDate, tasks: defaultTasks }));
    }
    setIsLoaded(true);
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('solus_daily_checklist', JSON.stringify({
      lastDate: new Date().toDateString(),
      tasks: newTasks
    }));
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks(updated);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;
    const newTask = {
      id: Date.now(),
      label: newTaskLabel.trim(),
      done: false
    };
    saveTasks([...tasks, newTask]);
    setNewTaskLabel('');
    setIsAdding(false);
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  if (!isLoaded) {
    return (
      <Card className="flex flex-col h-full min-h-[250px] animate-pulse">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-foreground">Daily Checklist</h3>
          <ListTodo className="w-5 h-5 text-highlight" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-5 bg-highlight/10 rounded w-3/4"></div>
          <div className="h-5 bg-highlight/10 rounded w-5/6"></div>
          <div className="h-5 bg-highlight/10 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-foreground">Daily Checklist</h3>
        <ListTodo className="w-5 h-5 text-highlight" />
      </div>

      <div className="flex-1 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-highlight italic py-2">No tasks for today. Add one below!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#F5F5F7] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {task.done ? (
                  <div className="w-5 h-5 rounded bg-glow text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded border-2 border-highlight/30 group-hover:border-glow transition-all flex-shrink-0 active:scale-95" />
                )}
                <span className={`text-sm leading-snug truncate transition-all ${task.done ? 'text-highlight line-through' : 'text-foreground font-medium'}`}>
                  {task.label}
                </span>
              </div>
              <button
                onClick={(e) => deleteTask(task.id, e)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-highlight hover:text-red-500 transition-all rounded-lg hover:bg-white flex-shrink-0"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-glow hover:text-glow/80 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      ) : (
        <form onSubmit={addTask} className="mt-5 relative flex items-center">
          <input
            type="text"
            autoFocus
            value={newTaskLabel}
            onChange={(e) => setNewTaskLabel(e.target.value)}
            placeholder="Enter task description..."
            className="w-full pl-4 pr-16 py-2.5 bg-white border border-highlight/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-glow/40 transition-all placeholder:text-highlight"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="submit"
              className="w-7 h-7 rounded-lg bg-glow text-white flex items-center justify-center hover:bg-glow/80 transition-colors"
              title="Add"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setNewTaskLabel(''); }}
              className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors text-xs font-bold"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
