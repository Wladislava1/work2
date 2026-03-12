/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Plus, X, AlignLeft, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { normalizeStatus, TaskCard } from './TeamDashboard';

const PROJECTS = ['ССПБ ID', 'СБ Арбитр', 'АУ Публикатор', 'Про Решения', 'Сириус', 'ССПБ', 'Апогей'];

export default function UserTasksView({ user, tasks, activeProject, onBack }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', project: activeProject === 'Все' ? 'ССПБ ID' : activeProject, status: 'В работе', type: 'Задача', priority: 'Medium', start_date: '', end_date: ''
  });

  const inProgress = tasks.filter(t => normalizeStatus(t.status) === 'inProgress');
  const completed = tasks.filter(t => normalizeStatus(t.status) === 'completed');

  // ================= АНАЛИТИКА В СТИЛЕ JELLYFISH =================
  // 1. Cycle Time (Только для выполненных задач с датами)
  const completedWithDates = completed.filter(t => t.start_date && t.end_date);
  let totalDays = 0;
  completedWithDates.forEach(t => {
     const diffDays = Math.ceil(Math.abs(new Date(t.end_date) - new Date(t.start_date)) / (1000 * 60 * 60 * 24));
     totalDays += diffDays;
  });
  const avgCycleTime = completedWithDates.length ? Math.round(totalDays / completedWithDates.length) : null;
  const getTaskWeight = (task) => {
    let weight = 0;
    if (task.priority === 'Critical') weight += 5;
    else if (task.priority === 'High') weight += 3;
    else weight += 1; // Medium / Low

    if (task.type === 'Баг') weight += 1; // Накидываем за баг
    
    return weight;
  };
  // 2. Нагрузка / Выгорание (Work In Progress Limit)
  const ALLOCATION_NORM = 9; // Идеально 3 задачи в параллели
  const currentLoad = inProgress.reduce((sum, task) => sum + getTaskWeight(task), 0);
  
  const loadPercent = Math.min(Math.round((currentLoad / ALLOCATION_NORM) * 100), 200); // Ограничиваем шкалу 200%
  const isOverloaded = currentLoad > ALLOCATION_NORM;

  // 3. Распределение (Allocation: Баги vs Фичи)
  const allActive = [...completed, ...inProgress];
  const bugCount = allActive.filter(t => t.type === 'Баг' || t.title.toLowerCase().includes('баг')).length;
  const bugPercent = allActive.length ? Math.round((bugCount / allActive.length) * 100) : 0;
  const featurePercent = 100 - bugPercent;

  const generateChartData = () => {
    const data = [];
    const today = new Date();
    // Точка отсчета: 1 января текущего года
    const startDate = new Date(today.getFullYear(), 0, 1); 
    
    // Считаем сколько дней прошло с 1 января до сегодня
    const diffDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));

    // Идем циклом от 1 января до сегодняшнего дня
    for(let i = diffDays; i >= 0; i--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      currentDate.setHours(23, 59, 59, 999); 
      
      let activeCount = 0, completedCount = 0;

      tasks.forEach(task => {
        const taskStatus = normalizeStatus(task.status);
        const start = task.start_date ? new Date(task.start_date) : null;
        const end = task.end_date ? new Date(task.end_date) : null;

        if (taskStatus === 'completed') {
          if (end && currentDate >= end) completedCount++; 
          else if (start && currentDate >= start && (!end || currentDate < end)) activeCount++; 
          else if (!end && !start) completedCount++; 
        } 
        else if (taskStatus === 'inProgress') {
           if (start && currentDate >= start) activeCount++; 
           else if (!start) activeCount++; 
        }
      });
      data.push({ name: `${currentDate.getDate()} ${currentDate.toLocaleString('ru-RU', { month: 'short' }).replace('.', '')}`, "В работе": activeCount, "Выполнено": completedCount });
    }
    return data;
  };
  
  const activityData = generateChartData();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreateModalOpen(false);
    alert(`Задача "${formData.title}" добавлена!`);
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Не указана';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full relative pb-10">
      
      {/* ШАПКА ПРОФИЛЯ */}
      <div className="flex items-center gap-6 mb-8 border-b border-slate-700 pb-6">
        <button onClick={onBack} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"><ArrowLeft size={24} /></button>
        <div>
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${user.color}`}>{user.role} • Проект: {activeProject}</p>
        </div>
      </div>

      {/* JELLYFISH METRICS ROW */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        
        {/* Cycle Time */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
           <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Скорость выполнения</h4>
           <div className="flex items-end gap-2">
             <span className="text-4xl font-black text-white">{avgCycleTime !== null ? avgCycleTime : '-'}</span>
             <span className="text-slate-500 mb-1">дней</span>
           </div>
           <p className="text-xs text-slate-500 mt-2">В среднем от взятия в работу до выполнения</p>
        </div>

        {/* Capacity / Burnout (Gauge Bar) */}
        <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-colors flex flex-col justify-between ${isOverloaded ? 'bg-rose-950/20 border-rose-900/50' : 'bg-slate-900/60 border-slate-800'}`}>
           <div>
             <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isOverloaded ? 'text-rose-400' : 'text-slate-400'}`}>Уровень нагрузки</h4>
             
             <div className="flex items-end gap-2 mb-1">
               <span className={`text-4xl font-black ${isOverloaded ? 'text-rose-500' : 'text-white'}`}>{currentLoad}</span>
               <span className="text-slate-500 mb-1">/ {ALLOCATION_NORM} баллов</span>
             </div>

             <div className="h-3 w-full bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(loadPercent, 100)}%` }} className={`h-full ${isOverloaded ? 'bg-rose-500' : 'bg-emerald-500'}`} />
             </div>
             
             <p className={`text-xs mt-3 font-bold ${isOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
               {isOverloaded ? `Перегруз (${loadPercent}%)` : `Запас: ${ALLOCATION_NORM - currentLoad} балл`}
             </p>
           </div>
           
           {/* ЛЕГЕНДА С ВЕСАМИ ЗАДАЧ */}
           <div className="text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-700/50 leading-relaxed">
             <p><b>Оценка сложности:</b> Критическая = 5, Серьезная = 3, Обычная = 1</p>
             <p className="italic">*Баги добавляют +1 балл к сложности</p>
           </div>
        </div>

        {/* Allocation Bar */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
           <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Распределение (Allocation)</h4>
           <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-black text-indigo-400">{featurePercent}% <span className="text-xs text-slate-500 font-normal">Задачи</span></span>
              <span className="text-2xl font-black text-rose-500">{bugPercent}% <span className="text-xs text-slate-500 font-normal">Баги</span></span>
           </div>
           <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${featurePercent}%` }} className="bg-indigo-500 h-full" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${bugPercent}%` }} className="bg-rose-500 h-full" />
           </div>
        </div>
      </div>

      {/* СТАРЫЙ ГРАФИК ПРОДУКТИВНОСТИ */}
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
              <Brush dataKey="name" height={30} stroke="#6366f1" fill="#0f172a" tickFormatter={() => ''} startIndex={Math.max(0, activityData.length - 15)} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* КОЛОНКИ С ЗАДАЧАМИ */}
      <div className="grid grid-cols-2 gap-8 items-start">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-t-4 border-t-amber-500 flex flex-col">
          <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2 shrink-0"><Clock size={22} /> В работе ({inProgress.length})</h3>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {inProgress.map((t, i) => <TaskCard key={t.id} task={t} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(t)} />)}
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-t-4 border-t-emerald-500 flex flex-col">
          <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2 shrink-0"><CheckCircle size={22} /> Выполнена ({completed.length})</h3>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {completed.map((t, i) => <TaskCard key={t.id} task={t} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(t)} />)}
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ПРОСМОТРА ЗАДАЧИ (БЕЗ ИЗМЕНЕНИЙ) */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar pr-6"
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
                  <div><h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Тип</h4><span className="text-white block">{selectedTask.type === 'Баг' ? 'Баг' : 'Задача'}</span></div>
                  <div>
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Calendar size={14}/> Даты</h4>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 mb-1">Взятие в работу: <span className="text-slate-200">{formatDate(selectedTask.start_date)}</span></p>
                       <p className="text-xs text-slate-400">Выполнение: <span className="text-slate-200">{formatDate(selectedTask.end_date)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}