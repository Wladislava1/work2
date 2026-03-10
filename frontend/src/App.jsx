/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users } from 'lucide-react';
import CleanDashboard from './components/CleanDashboard';
import TeamDashboard from './components/TeamDashboard';
import { initialTasks } from './data'; 

function App() {
  const [isRealityMode, setIsRealityMode] = useState(false);
  const [tasks, setTasks] = useState(initialTasks); 

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 overflow-x-hidden relative transition-colors duration-700">
      
      <header className="flex justify-between items-center mb-10 relative z-50 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Статус системы: 
            <span className="text-amber-500 font-medium px-3 py-1 bg-amber-500/10 rounded-lg text-xl border border-amber-500/20">
              Высокая нагрузка
            </span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Сводный отчет по распределению инженерных ресурсов</p>
        </div>

        <button
          onClick={() => setIsRealityMode(!isRealityMode)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border border-indigo-500/50"
        >
          {!isRealityMode ? <Users size={20} /> : <LayoutDashboard size={20} />}
          {!isRealityMode ? 'ДЕТАЛИЗАЦИЯ ПО КОМАНДЕ' : 'НАЗАД К ОБЩЕЙ СВОДКЕ'}
        </button>
      </header>

      <main className="relative">
        {!isRealityMode ? (
          <motion.div key="clean" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <CleanDashboard />
          </motion.div>
        ) : (
          <motion.div key="reality" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, type: 'spring' }}>
            <TeamDashboard tasks={tasks} /> 
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;