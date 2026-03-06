/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Plus, X, AlignLeft, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { normalizeStatus, TaskCard } from './TeamDashboard';

const PROJECTS = ['ССПБ ID', 'СБ Арбитр', 'АУ Публикатор', 'Про Решения', 'Сириус'];

export default function UserTasksView({ user, tasks, activeProject, onBack }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', project: activeProject === 'Все' ? 'ССПБ ID' : activeProject, status: 'В работе', type: 'Задача', priority: 'Medium', start_date: '', end_date: ''
  });

  const inProgress = tasks.filter(t => normalizeStatus(t.status) === 'inProgress');
  const completed = tasks.filter(t => normalizeStatus(t.status) === 'completed');

  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for(let i = 14; i >= 0; i--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      currentDate.setHours(23, 59, 59, 999); 
      
      let activeCount = 0;
      let completedCount = 0;

      tasks.forEach(task => {
        const taskStatus = normalizeStatus(task.status);
        const start = task.start_date ? new Date(task.start_date) : null;
        const end = task.end_date ? new Date(task.end_date) : null;

        if (taskStatus === 'completed') {
          if (end && currentDate >= end) {
            completedCount++; 
          } else if (start && currentDate >= start && (!end || currentDate < end)) {
            activeCount++; 
          } else if (!end && !start) {
            completedCount++; 
          }
        } 
        else if (taskStatus === 'inProgress') {
           if (start && currentDate >= start) {
             activeCount++; 
           } else if (!start) {
             activeCount++; 
           }
        }
      });

      data.push({ 
        name: `${currentDate.getDate()} ${currentDate.toLocaleString('ru-RU', { month: 'short' }).replace('.', '')}`, 
        "В работе": activeCount, 
        "Выполнено": completedCount 
      });
    }
    return data;
  };
  
  const activityData = generateChartData();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Отправляем на сервер:", { ...formData, assignee_id: user.id });
    setIsCreateModalOpen(false);
    alert(`Задача "${formData.title}" добавлена!`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full relative pb-10">
      
      <div className="flex items-center gap-6 mb-8 border-b border-slate-700 pb-6">
        <button onClick={onBack} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${user.color}`}>{user.role} • Проект: {activeProject}</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)]">
          <Plus size={20} /> ВЗЯТЬ ЗАДАЧУ
        </button>
      </div>

      <div className="mb-10 bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-bold text-slate-300 mb-6">График продуктивности</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="В работе" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Выполнено" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
              <Brush dataKey="name" height={30} stroke="#0891b2" fill="#1e293b" tickFormatter={() => ''} startIndex={5} endIndex={14} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================== */}
      {/* КОЛОНКИ С ВНУТРЕННИМ СКРОЛЛОМ (max-h)      */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 gap-8 items-start">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-t-4 border-t-amber-500 flex flex-col">
          <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2 shrink-0">
            <Clock size={22} /> В работе ({inProgress.length})
          </h3>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {inProgress.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
            {inProgress.length === 0 && <p className="text-slate-500 text-center py-10">Нет активных задач</p>}
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-t-4 border-t-emerald-500 flex flex-col">
          <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2 shrink-0">
            <CheckCircle size={22} /> Выполнена ({completed.length})
          </h3>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {completed.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
            {completed.length === 0 && <p className="text-slate-500 text-center py-10">Пока ничего не готово</p>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full">{selectedTask.project}</span>
                    <span className={`text-xs px-3 py-1 rounded-full ${selectedTask.priority === 'Critical' ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-slate-800 text-slate-300'}`}>Приоритет: {selectedTask.priority}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{selectedTask.title}</h3>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"><X size={24} /></button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                  <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"><AlignLeft size={16} /> Описание</h4>
                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 min-h-[150px]">
                    {selectedTask.description ? <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">{selectedTask.description}</p> : <p className="text-slate-500 italic">Описание отсутствует.</p>}
                  </div>
                </div>
                <div className="col-span-1 space-y-6">
                  <div><h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Статус</h4><span className="text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 block w-fit">{selectedTask.status}</span></div>
                  <div><h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Тип</h4><span className="text-white block">{selectedTask.type === 'Баг' ? '🐛 Баг' : '📝 Задача'}</span></div>
                  <div>
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Calendar size={14}/> Даты</h4>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 mb-1">Старт: <span className="text-slate-200">{formatDate(selectedTask.start_date)}</span></p>
                       <p className="text-xs text-slate-400">Финиш: <span className="text-slate-200">{formatDate(selectedTask.end_date)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <h3 className="text-2xl font-bold text-white">Новая задача: <span className="text-cyan-400">{user.name}</span></h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Название *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Подробное описание</label>
                  <textarea rows="5" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 whitespace-pre-wrap font-mono text-sm"></textarea>
                </div>
                
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Проект</label>
                    <select value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                      {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Тип</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                      <option value="Задача">Задача</option><option value="Баг">Баг</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Статус</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                      <option value="В работе">В работе</option><option value="Выполнена">Выполнена</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Приоритет</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                      <option value="Low">Обычная</option><option value="High">Высокий</option><option value="Critical">Критичная</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Дата взятия в работу</label>
                    <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white color-scheme-dark" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Дата выполнения</label>
                    <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white color-scheme-dark" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">СОЗДАТЬ И ПРИВЯЗАТЬ</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}