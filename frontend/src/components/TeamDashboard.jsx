/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlignLeft, AlertOctagon, X, Calendar, Activity, ListTodo, ChevronDown, ChevronUp, CheckCircle, PauseCircle, HelpCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import UserTasksView from './UserTasksView';

const PROJECTS = ['Все', 'ССПБ ID', 'СБ Арбитр', 'АУ Публикатор', 'Про Решения', 'Сириус', 'ССПБ', 'Апогей'];

// ОБНОВЛЕННЫЙ СПИСОК КОМАНДЫ
const coreTeam = [
  { id: 1, name: "Трофим", role: "Frontend", color: "text-indigo-400", bg: "bg-indigo-900/20", border: "border-indigo-500/50" },
  { id: 2, name: "Саша Светиков", role: "Backend", color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-500/50" },
  { id: 3, name: "Федор", role: "Backend", color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-500/50" },
  { id: 4, name: "Паша", role: "Frontend", color: "text-indigo-400", bg: "bg-indigo-900/20", border: "border-indigo-500/50" }
];

// 2. ПРИВЛЕЧЕННЫЕ СПЕЦИАЛИСТЫ
const externalTeam = [
  { id: 5, name: "Дима Панов", role: "Fullstack", color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-500/50" },
  { id: 6, name: "Люба", role: "Frontend", color: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-500/50" },
  { id: 7, name: "Ron", role: "Fullstack", color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-500/50" }
];

// eslint-disable-next-line react-refresh/only-export-components
export const normalizeStatus = (status) => {
  if (!status) return 'future';
  const s = status.toLowerCase().trim();
  if (s.includes('выполнен') || s.includes('готов') || s.includes('закрыт')) return 'completed';
  if (s.includes('работ') || s.includes('progress')) return 'inProgress';
  if (s.includes('открыт') || s.includes('open')) return 'open';
  return 'future'; 
};

export const TaskCard = ({ task, showProject, delay, onClick }) => {
  const isCritical = task.priority === 'Critical';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} onClick={onClick}
      className={`p-4 rounded-xl border shadow-sm mb-3 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
        isCritical ? 'bg-rose-950/20 border-rose-900/50' : 'bg-slate-800/50 border-slate-700'
      }`}
    >
      {showProject && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{task.project}</span>}
      <p className={`text-sm font-medium text-white mb-3 leading-relaxed ${showProject ? 'mt-1' : ''}`}>{task.title}</p>
      {task.description && task.description !== '-' && (
         <div className="flex items-center gap-1 text-slate-500 mb-3"><AlignLeft size={14} /><span className="text-[10px] uppercase">Спецификация</span></div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 rounded-md bg-slate-900/80 text-slate-400 border border-slate-700">
          {task.type === 'Баг' ? 'Баг' : 'Задача'} • {task.priority}
        </span>
        {isCritical && <AlertOctagon size={16} className="text-rose-500" />}
      </div>
    </motion.div>
  );
};

export default function TeamDashboard({ tasks }) {
  const [activeProject, setActiveProject] = useState('Все');
  const [activeView, setActiveView] = useState('analytics'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showBacklogList, setShowBacklogList] = useState(false);

  // Фильтруем задачи по выбранному проекту (или берем все)
  const projectTasks = activeProject === 'Все' ? tasks : tasks.filter(t => t.project === activeProject);

  // Распределяем задачи ТЕКУЩЕГО выбранного проекта по статусам
  const openTasks = projectTasks.filter(t => normalizeStatus(t.status) === 'open');
  const futureTasks = projectTasks.filter(t => normalizeStatus(t.status) === 'future');
  const inProgressTasks = projectTasks.filter(t => normalizeStatus(t.status) === 'inProgress');
  const completedTasks = projectTasks.filter(t => normalizeStatus(t.status) === 'completed');
  
  // Объем оставшейся работы
  const totalBacklog = openTasks.length + futureTasks.length;

  // ДАННЫЕ ДЛЯ ГРАФИКА: Строго по статусам задач
  const donutData = [
    { name: 'Выполнено', value: completedTasks.length, color: '#10b981' }, // Изумрудный
    { name: 'В работе', value: inProgressTasks.length, color: '#f59e0b' },      // Янтарный
    { name: 'Открыто', value: openTasks.length, color: '#6366f1' },            // Индиго
  ].filter(d => d.value > 0); // Скрываем куски с нулями

  if (selectedUser) {
    const userTasks = projectTasks.filter(t => t.assignee_id === selectedUser.id);
    return <UserTasksView user={selectedUser} tasks={userTasks} activeProject={activeProject} onBack={() => setSelectedUser(null)} />;
  }

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Не указана';

  return (
    <div className="relative min-h-[70vh]">
      
      {/* ФИЛЬТРЫ ПРОЕКТА */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-slate-800">
        <span className="text-slate-400 font-bold self-center mr-4 text-sm">Проект:</span>
        {PROJECTS.map(proj => (
          <button key={proj} onClick={() => setActiveProject(proj)}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${activeProject === proj ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            {proj}
          </button>
        ))}
      </div>

      {/* ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ */}
      <div className="flex gap-4 mb-10 border-b border-slate-800 pb-2">
        <button onClick={() => setActiveView('analytics')} className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all border-b-2 ${activeView === 'analytics' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
          <Activity size={18} /> Ресурсы команды
        </button>
        <button onClick={() => setActiveView('backlog')} className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all border-b-2 ${activeView === 'backlog' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
          <ListTodo size={18} /> Структура задач
        </button>
      </div>

      {/* ================= АНАЛИТИКА КОМАНДЫ ================= */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="grid grid-cols-3 gap-6 mb-12">
             <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Объем (Открыто)</p>
               <p className="text-4xl font-bold text-white">{totalBacklog} <span className="text-lg text-slate-500 font-normal">задач</span></p>
             </div>
             <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Командный состав</p>
               <p className="text-4xl font-bold text-white">{coreTeam.length} <span className="text-lg text-slate-500 font-normal">чел.</span></p>
             </div>
             <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Очередь задач на разработчика</p>
               <p className="text-4xl font-bold text-amber-400">{Math.round(totalBacklog / coreTeam.length) || 0} <span className="text-lg text-slate-500 font-normal">открытых задач/чел.</span></p>
             </div>
          </div>

          {/* БЛОК 1: ОСНОВНАЯ КОМАНДА */}
          <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-3">Основная команда</h3>
          <div className="grid grid-cols-4 gap-6 mb-10">
            {coreTeam.map((user, index) => {
              const userActiveTasks = projectTasks.filter(t => t.assignee_id === user.id && ['inProgress', 'completed'].includes(normalizeStatus(t.status)));
              const completedCount = userActiveTasks.filter(t => normalizeStatus(t.status) === 'completed').length;

              return (
                <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser(user)} whileHover={{ translateY: -4 }} 
                  className={`p-6 rounded-2xl cursor-pointer transition-all border ${user.bg} ${user.border}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-0.5">{user.name}</h4>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${user.color}`}>{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                    <div className="text-center w-1/2 border-r border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase">Выполнено</p>
                      <p className="text-xl font-bold text-emerald-400">{completedCount}</p>
                    </div>
                    <div className="text-center w-1/2">
                      <p className="text-[10px] text-slate-400 uppercase">В работе</p>
                      <p className="text-xl font-bold text-white">{userActiveTasks.length - completedCount}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* БЛОК 2: ПРИВЛЕЧЕННЫЕ СПЕЦИАЛИСТЫ */}
          <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-3">Привлеченные специалисты</h3>
          <div className="grid grid-cols-3 gap-6">
            {externalTeam.map((user, index) => {
              const userActiveTasks = projectTasks.filter(t => t.assignee_id === user.id && ['inProgress', 'completed'].includes(normalizeStatus(t.status)));
              const completedCount = userActiveTasks.filter(t => normalizeStatus(t.status) === 'completed').length;

              return (
                <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser(user)} whileHover={{ translateY: -4 }} 
                  className={`p-6 rounded-2xl cursor-pointer transition-all border ${user.bg} ${user.border}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-0.5">{user.name}</h4>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${user.color}`}>{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                    <div className="text-center w-1/2 border-r border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase">Выполнено</p>
                      <p className="text-xl font-bold text-emerald-400">{completedCount}</p>
                    </div>
                    <div className="text-center w-1/2">
                      <p className="text-[10px] text-slate-400 uppercase">В работе</p>
                      <p className="text-xl font-bold text-white">{userActiveTasks.length - completedCount}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ================= СТРУКТУРА ЗАДАЧ (DONUT CHART & LIST) ================= */}
      {activeView === 'backlog' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          
          <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 mb-8 flex items-center justify-between">
             <div className="w-1/2">
               {/* ОБНОВЛЕННЫЕ ЗАГОЛОВКИ */}
               <h3 className="text-xl font-bold text-white mb-2">Состав бэклога: Выполнено / Открыто / В работе</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">Распределение всех задач выбранного проекта ({activeProject}) по текущим фазам готовности.</p>
               
               {donutData.length > 0 ? (
                 <ul className="space-y-3">
                   {donutData.map((entry) => (
                     <li key={entry.name} className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                       <span className="text-slate-300 font-medium">{entry.name}</span>
                       <span className="text-slate-500 text-sm ml-auto">{entry.value} задач</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-slate-500 italic">В данном проекте пока нет задач.</p>
               )}
             </div>

             <div className="w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} itemStyle={{color: '#fff'}} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          <button 
             onClick={() => setShowBacklogList(!showBacklogList)} 
             className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 mb-8 border border-slate-700"
          >
             {showBacklogList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
             {showBacklogList ? 'Скрыть детализированный реестр' : `Развернуть детализированный реестр (${projectTasks.length} записей)`}
          </button>

          <AnimatePresence>
            {showBacklogList && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                
                {/* 4 КОЛОНКИ ЗАДАЧ */}
                <div className="grid grid-cols-2 gap-6 items-start pb-6">
                  
                  {/* Открыто */}
                  <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 flex flex-col">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2 shrink-0 border-b border-slate-800 pb-3"><HelpCircle size={16} /> Открыто ({openTasks.length})</h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {openTasks.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
                      {openTasks.length === 0 && <p className="text-slate-600 text-xs text-center py-6">Нет данных</p>}
                    </div>
                  </div>

                  {/* В работе (WIP) */}
                  <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 flex flex-col">
                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2 shrink-0 border-b border-slate-800 pb-3"><Clock size={16} /> В работе ({inProgressTasks.length})</h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {inProgressTasks.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
                      {inProgressTasks.length === 0 && <p className="text-slate-600 text-xs text-center py-6">Нет данных</p>}
                    </div>
                  </div>


                  {/* Выполнено */}
                  <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 flex flex-col">
                    <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2 shrink-0 border-b border-slate-800 pb-3"><CheckCircle size={16} /> Выполнено ({completedTasks.length})</h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {completedTasks.map((task, i) => <TaskCard key={task.id} task={task} showProject={activeProject === 'Все'} delay={i * 0.05} onClick={() => setSelectedTask(task)} />)}
                      {completedTasks.length === 0 && <p className="text-slate-600 text-xs text-center py-6">Нет данных</p>}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}

      {/* Модальное окно просмотра */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-900/20 px-3 py-1 rounded-md">{selectedTask.project}</span>
                    <span className={`text-xs px-3 py-1 rounded-md border ${selectedTask.priority === 'Critical' ? 'bg-rose-900/20 text-rose-400 border-rose-800/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Priority: {selectedTask.priority}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{selectedTask.title}</h3>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-slate-500 hover:text-white bg-slate-800/50 p-2 rounded-lg transition-colors"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                  <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"><AlignLeft size={14} /> Спецификация</h4>
                  <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/50 min-h-[150px]">
                    {selectedTask.description && selectedTask.description !== '-' ? <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">{selectedTask.description}</p> : <p className="text-slate-600 text-sm italic">Спецификация не предоставлена.</p>}
                  </div>
                </div>
                <div className="col-span-1 space-y-6">
                  <div><h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Статус (Phase)</h4><span className="text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 block w-fit text-sm">{selectedTask.status}</span></div>
                  <div><h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Тип (Type)</h4><span className="text-slate-300 block text-sm">{selectedTask.type === 'Баг' ? 'Defect' : 'Feature'}</span></div>
                  <div>
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Calendar size={14}/> Timeline</h4>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                       <p className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider">Start: <span className="text-slate-300 ml-1">{formatDate(selectedTask.start_date)}</span></p>
                       <p className="text-[11px] text-slate-500 uppercase tracking-wider">End: <span className="text-slate-300 ml-1">{formatDate(selectedTask.end_date)}</span></p>
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