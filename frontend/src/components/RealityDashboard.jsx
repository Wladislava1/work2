// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { AlertOctagon, Bug, FileText, ServerCrash } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
export default function RealityDashboard() {
  return (
    <div className="space-y-8">
      {/* Шокирующая статистика */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-red-950/40 p-6 rounded-2xl border border-red-800/50">
          <p className="text-red-300 text-sm font-semibold uppercase tracking-wider">Всего сгенерировано задач</p>
          <p className="text-5xl font-black text-red-500 mt-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">482</p>
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-orange-950/40 p-6 rounded-2xl border border-orange-800/50">
          <p className="text-orange-300 text-sm font-semibold uppercase tracking-wider">Зависло в "Тестировании"</p>
          <p className="text-5xl font-black text-orange-500 mt-2">156</p>
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-purple-950/40 p-6 rounded-2xl border border-purple-800/50">
          <p className="text-purple-300 text-sm font-semibold uppercase tracking-wider">Требования БА (в ожидании)</p>
          <p className="text-5xl font-black text-purple-500 mt-2">89</p>
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-emerald-950/40 p-6 rounded-2xl border border-emerald-800/50 opacity-50">
          <p className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">Выгружено на PROD</p>
          <p className="text-5xl font-black text-emerald-500 mt-2">12</p>
        </motion.div>
      </div>

      {/* Симулятор выдергивания из контекста */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-red-900/50 relative overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ServerCrash className="text-red-500" /> 
          Мясорубка контекста (Как мы реально работаем)
        </h3>
        
        <div className="flex gap-6 h-64 relative">
          {/* Колонка Разработчика */}
          <div className="w-1/3 bg-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-end relative border-t-4 border-cyan-500">
            <span className="absolute top-4 font-bold text-cyan-400">Разработка</span>
            
            {/* Задача, которую бросили */}
            <motion.div 
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{ y: 120, opacity: 0.2, rotate: -12 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="w-full bg-slate-700 p-3 rounded-lg text-sm text-slate-300 mb-2 border border-slate-600 line-through"
            >
              SSPB ID. Доработки формы (Фронт)
            </motion.div>

            {/* Внезапный критический баг, который прилетел сверху */}
            <motion.div 
              initial={{ y: -200, opacity: 0, scale: 1.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
              className="w-full bg-red-900/80 p-4 rounded-lg text-sm text-white font-bold border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] flex gap-2 items-start z-10"
            >
              <AlertOctagon size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>СРОЧНО: Прод упал! Разворачивание Zitadel сломало аутентификацию</span>
            </motion.div>
          </div>

          {/* Колонка Аналитика/QA */}
          <div className="w-1/3 bg-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-start relative border-t-4 border-purple-500 overflow-hidden">
             <span className="font-bold text-purple-400 mb-4">Бизнес-Анализ & QA</span>
             
             {/* Бесконечный поток задач сверху */}
             {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: i * 60, opacity: 1 }}
                  transition={{ delay: i * 0.8, type: "spring" }}
                  className="absolute w-11/12 bg-purple-900/40 p-3 rounded-lg text-xs text-purple-200 border border-purple-700/50 flex gap-2 items-center"
                >
                  <FileText size={14} /> Интеграция: СБ Арбитр (Уточнить доки)
                </motion.div>
             ))}
          </div>
          
          {/* Колонка Блокеров */}
          <div className="w-1/3 bg-slate-800/50 rounded-xl p-4 relative border-t-4 border-orange-500">
             <span className="font-bold text-orange-400 block mb-4">Заблокировано</span>
             <motion.div 
                animate={{ x: [-2, 2, -2, 2, 0] }} 
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="w-full bg-orange-900/40 p-4 rounded-lg text-sm text-orange-200 border border-orange-700 flex gap-2"
              >
               <Bug size={16} className="shrink-0" />
               Верификация ССПБ ID (Ждем API от смежной команды)
             </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}