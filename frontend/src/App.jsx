/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, CalendarDays, ChevronUp, ChevronDown } from 'lucide-react';
import CleanDashboard from './components/CleanDashboard';
import TeamDashboard from './components/TeamDashboard';
import { initialTasks } from './data'; 

function App() {
  const [isRealityMode, setIsRealityMode] = useState(false);
  const [tasks, setTasks] = useState(initialTasks); 
  const [isMeetingOpen, setIsMeetingOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 overflow-x-hidden relative transition-colors duration-700">
      <div className="mb-8">
        <button 
          onClick={() => setIsMeetingOpen(!isMeetingOpen)}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors mb-2 px-2"
        >
          <CalendarDays size={20} />
          Повестка совещания (13.03.2026)
          {isMeetingOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        <AnimatePresence>
          {isMeetingOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/60 border border-indigo-500/30 p-6 rounded-2xl shadow-lg mt-2 relative">
                <h3 className="text-lg font-bold text-white mb-3">Цель совещания:</h3>
                <ol className="space-y-4 text-sm list-decimal list-inside ml-2">
                  <li>
                    <strong className="text-indigo-300 text-base">Демонстрация текущей ситуации по задачам и загрузки команды.</strong>
                    <p className="mt-1 ml-5 text-slate-400 leading-relaxed">Показать распределение задач, текущие статусы работ и фактическую нагрузку на разработчиков.</p>
                  </li>
                  <li>
                    <strong className="text-indigo-300 text-base">Демонстрация выполненных работ по SSPB ID.</strong>
                    <p className="mt-1 ml-5 text-slate-400 leading-relaxed">Показать пользовательский сценарий: процесс регистрации, вход в систему, переход из SSPB ID в продукты экосистемы и обратный переход, а также текущую степень готовности интеграции.</p>
                  </li>
                  <li>
                    <strong className="text-indigo-300 text-base">Обсуждение и утверждение задач по ИДО.</strong>
                    <p className="mt-1 ml-5 text-slate-400 leading-relaxed">Рассмотреть планируемые доработки продукта, уточнить приоритеты задач и согласовать дальнейшие шаги по развитию системы.</p>
                  </li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <header className="flex justify-between items-center mb-10 relative z-50 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Статус системы: 
            <span className="text-amber-500 font-medium px-3 py-1 bg-amber-500/10 rounded-lg text-xl border border-amber-500/20">
              Высокая нагрузка
            </span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Сводный отчет по распределению ресурсов</p>
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