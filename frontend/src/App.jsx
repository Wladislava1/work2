/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users } from 'lucide-react'; // Изменил иконку
import axios from 'axios';
import CleanDashboard from './components/CleanDashboard';
import TeamDashboard from './components/TeamDashboard';

function App() {
  const [isRealityMode, setIsRealityMode] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке задач из базы:", error);
      });
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isRealityMode ? 'bg-slate-900' : 'bg-red-950/20'} text-slate-200 p-8 overflow-x-hidden relative`}>
      
      <header className="flex justify-between items-center mb-10 relative z-50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Статус проекта: <span className="text-red-500 animate-pulse">
              КРИТИЧЕСКАЯ УГРОЗА СРОКАМ
            </span>
          </h1>
          <p className="text-slate-400 mt-1">Отчет для руководства о нехватке ресурсов</p>
        </div>

        <button
          onClick={() => setIsRealityMode(!isRealityMode)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            !isRealityMode 
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.6)]' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {/* НОВЫЙ ТЕКСТ КНОПОК */}
          {!isRealityMode ? <Users size={20} /> : <AlertTriangle size={20} />}
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