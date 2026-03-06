/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlignLeft, AlertOctagon, X, Calendar, Activity, ListTodo, PauseCircle, HelpCircle } from 'lucide-react';
import UserTasksView from './UserTasksView';

const PROJECTS = ['Все', 'ССПБ ID', 'СБ Арбитр', 'АУ Публикатор', 'Про Решения', 'Сириус'];

const mockTeam = [
  { id: 1, name: "Трофим", role: "Frontend", color: "text-cyan-400", bg: "bg-cyan-900/30", border: "border-cyan-500" },
  { id: 2, name: "Саша Светиков", role: "Backend", color: "text-emerald-400", bg: "bg-emerald-900/30", border: "border-emerald-500" },
  { id: 3, name: "Федор", role: "Backend", color: "text-emerald-400", bg: "bg-emerald-900/30", border: "border-emerald-500" },
  { id: 4, name: "Паша", role: "Frontend", color: "text-cyan-400", bg: "bg-cyan-900/30", border: "border-cyan-500" },
  { id: 6, name: "Влада", role: "BA/QA", color: "text-purple-400", bg: "bg-purple-900/30", border: "border-purple-500" },
  { id: 7, name: "Надя", role: "BA/QA", color: "text-purple-400", bg: "bg-purple-900/30", border: "border-purple-500" },
  { id: 5, name: "Стас", role: "Уволился", color: "text-gray-500", bg: "bg-gray-800", border: "border-gray-600" }
];

// Функция определения статусов
export const normalizeStatus = (status) => {
  if (!status) return 'future';
  const s = status.toLowerCase().trim();
  if (s.includes('выполнен') || s.includes('готов') || s.includes('закрыт')) return 'completed';
  if (s.includes('в работе') || s.includes('progress')) return 'inProgress';
  if (s.includes('открыто') || s.includes('open')) return 'open';
  return 'future'; // Будущие
};

// Универсальная карточка задачи
export const TaskCard = ({ task, showProject, delay, onClick }) => {
  const isCritical = task.priority === 'Critical';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} onClick={onClick}
      className={`p-4 rounded-xl border-2 shadow-lg mb-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(8,145,178,0.3)] ${
        isCritical ? 'bg-red-950/40 border-red-500/50' : 'bg-slate-800/80 border-slate-700'
      }`}
    >
      {showProject && <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{task.project}</span>}
      <p className={`text-sm font-medium text-white mb-3 leading-relaxed ${showProject ? 'mt-1' : ''}`}>{task.title}</p>
      {task.description && (
         <div className="flex items-center gap-1 text-slate-400 mb-3"><AlignLeft size={14} /><span className="text-[10px] uppercase">Есть описание</span></div>
      )}
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-md ${isCritical ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-slate-700 text-slate-300'}`}>
          {task.type === 'Баг' ? 'Баг' : 'Задача'} • {isCritical ? 'КРИТИЧНО' : task.priority === 'High' ? 'Высокий' : 'Обычный'}
        </span>
        {isCritical && <AlertOctagon size={16} className="text-red-500 animate-pulse" />}
      </div>
    </motion.div>
  );
};

export default function TeamDashboard({ tasks }) {
  const [activeProject, setActiveProject] = useState('Все');
  const [activeView, setActiveView] = useState('analytics'); // 'analytics' или 'backlog'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // ГЛОБАЛЬНЫЙ ФИЛЬТР: Применяется ко всему (и к бэклогу, и к статистике)
  const projectTasks = activeProject === 'Все' ? tasks : tasks.filter(t => t.project === activeProject);

  // Считаем Бэклог (Открытые + Будущие)
  const openTasks = projectTasks.filter(t => normalizeStatus(t.status) === 'open');
  const futureTasks = projectTasks.filter(t => normalizeStatus(t.status) === 'future');
  const totalBacklog = openTasks.length + futureTasks.length;

  // Если выбран человек - показываем ЕГО страницу
  if (selectedUser) {
    const userTasks = projectTasks.filter(t => t.assignee_id === selectedUser.id);
    return <UserTasksView user={selectedUser} tasks={userTasks} activeProject={activeProject} onBack={() => setSelectedUser(null)} />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative min-h-[70vh]">
      
      {/* 1. ГЛОБАЛЬНЫЕ ФИЛЬТРЫ ПРОЕКТА */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-slate-700/50">
        <span className="text-slate-400 font-bold self-center mr-4">Проект:</span>
        {PROJECTS.map(proj => (
          <button key={proj} onClick={() => setActiveProject(proj)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeProject === proj ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            {proj}
          </button>
        ))}
      </div>

      {/* 2. ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ (Аналитика / Бэклог) */}
      <div className="flex gap-4 mb-10">
        <button onClick={() => setActiveView('analytics')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeView === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
          <Activity size={20} /> Аналитика команды
        </button>
        <button onClick={() => setActiveView('backlog')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeView === 'backlog' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
          <ListTodo size={20} /> Бэклог проекта ({totalBacklog})
        </button>
      </div>

      {/* ================= АНАЛИТИКА КОМАНДЫ ================= */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Бутылочное горлышко */}
          <div className="mb-16 bg-slate-800/50 p-8 rounded-3xl border border-red-900/50 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Нагрузка по проекту: {activeProject}</h3>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl bg-gradient-to-b from-purple-900/80 to-red-900/80 p-6 rounded-t-3xl border-t-4 border-red-500 text-center relative shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <p className="text-red-200 text-sm uppercase tracking-widest mb-2">Задач в Бэклоге (Будущие + Открытые)</p>
                <p className="text-6xl font-black text-white">{totalBacklog} <span className="text-2xl text-red-300">задач</span></p>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[30px] border-r-[30px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 z-10" />
              </div>
              <div className="w-64 bg-slate-900 p-4 rounded-b-3xl border-b-4 border-cyan-500 text-center mt-2 z-20 shadow-xl">
                 <p className="text-cyan-400 text-sm mb-1">Разработчиков в строю</p>
                 <p className="text-4xl font-bold text-white">4 <span className="text-xl text-cyan-700">чел.</span></p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-6">Команда (Нажми на карточку для деталей)</h3>
          <div className="grid grid-cols-4 gap-6">
            {mockTeam.map((user, index) => {
              // ВАЖНО: Считаем только задачи "В работе" и "Выполнено"
              const userActiveTasks = projectTasks.filter(t => t.assignee_id === user.id && ['inProgress', 'completed'].includes(normalizeStatus(t.status)));
              const completedCount = userActiveTasks.filter(t => normalizeStatus(t.status) === 'completed').length;

              return (
                <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser(user)} whileHover={{ scale: 1.05, translateY: -5 }} 
                  className={`relative p-6 rounded-2xl cursor-pointer transition-colors border-2 ${user.bg} ${user.border} hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
                >
                  <h4 className="text-xl font-bold text-white mb-1">{user.name}</h4>
                  <p className={`text-sm font-semibold uppercase tracking-wider ${user.color}`}>{user.role}</p>
                  
                  <div className="mt-4 flex justify-between items-center border-t border-slate-700/50 pt-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Сделано</p>
                      <p className="text-xl font-bold text-emerald-400">{completedCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">В работе</p>
                      <p className="text-xl font-bold text-white">{userActiveTasks.length - completedCount}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ================= БЭКЛОГ ПРОЕКТА ================= */}
      {activeView === 'backlog' && (
        // Добавили items-start, чтобы колонки не растягивались
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-8 items-start">
          
          {/* Колонка 1: Открыто */}
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-t-4 border-t-blue-500 flex flex-col">
            <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2 shrink-0">
              <HelpCircle size={22} /> Открыто ({openTasks.length})
            </h3>
            {/* ВНУТРЕННИЙ СКРОЛЛ */}
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {openTasks.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
              {openTasks.length === 0 && <p className="text-slate-500 text-center py-10">Нет открытых задач</p>}
            </div>
          </div>

          {/* Колонка 2: Будущие */}
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-t-4 border-t-purple-500 flex flex-col">
            <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2 shrink-0">
              <PauseCircle size={22} /> Будущие ({futureTasks.length})
            </h3>
            {/* ВНУТРЕННИЙ СКРОЛЛ */}
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {futureTasks.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
              {futureTasks.length === 0 && <p className="text-slate-500 text-center py-10">Бэклог пуст</p>}
            </div>
          </div>
          
        </motion.div>
      )}

      {/* Модальное окно просмотра задачи (работает и из Бэклога) */}
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
    </div>
  );
}