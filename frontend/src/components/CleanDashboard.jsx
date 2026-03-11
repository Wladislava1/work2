/* eslint-disable no-unused-vars */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Network, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const gapData = [
  { name: '1 Янв', "Уже написано": 35, "Реализовано": 12 },
  { name: '15 Янв', "Уже написано": 64, "Реализовано": 28 },
  { name: '1 Фев', "Уже написано": 85, "Реализовано": 46 },
  { name: '15 Фев', "Уже написано": 120, "Реализовано": 63 },
  { name: '1 Мар', "Уже написано": 153, "Реализовано": 82 },
  { name: 'Сегодня', "Уже написано": 195, "Реализовано": 100 },
];


export default function CleanDashboard() {
  return (
    <div className="flex flex-col gap-8">
      
      <div className="grid grid-cols-2 gap-8">
        
        {/* АУДИТ 1: ССПБ ID (ГЛАВНЫЙ ФОКУС) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-indigo-900/50 text-indigo-400 rounded-xl border border-indigo-800">
              <Database size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Главный приоритет</p>
              <h2 className="text-2xl font-bold text-white">ССПБ ID</h2>
            </div>
          </div>
          
          {/* УВЕЛИЧЕННЫЙ ШРИФТ: text-base вместо text-sm */}
          <ul className="space-y-4 text-slate-300 text-base">
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Запуск продаж и интеграции:</strong> Сейчас необходимо убедиться в стабильности работы сервиса, завершить интеграцию всех продуктов внутри системы и обновить дизайн. </span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Система авторизации Zitadel:</strong> В текущей реализации иногда возникают проблемы с пользовательскими сессиями, из-за чего требуется дополнительная доработка логики работы авторизации. </span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Новая архитектура продукта:</strong> ССПБ ID разрабатывается на архитектуре, которая ранее не использовалась в наших продуктах, поэтому часть времени уходит на её настройку и адаптацию.</span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Использование React во фронтенде</strong> </span>
            </li>
            <li className="flex gap-3 items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <Activity className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <span><strong>Использование Cursor:</strong> Любой сгенерированный код требует проверки и понимания со стороны разработчика. Чтобы корректно применить его в работе, необходимо понимать архитектуру проекта и чётко представлять, какой результат должен быть на выходе.</span>
            </li>
          </ul>
        </motion.div>

        {/* АУДИТ 2: СБ АРБИТР */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-900/50 text-blue-400 rounded-xl border border-blue-800">
              <Network size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Главный приоритет</p>
              <h2 className="text-2xl font-bold text-white">СБ Арбитр</h2>
            </div>
          </div>
          
          {/* УВЕЛИЧЕННЫЙ ШРИФТ: text-base вместо text-sm */}
          <ul className="space-y-4 text-slate-300 text-base">
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
              <span><strong>Интеграция с банком:</strong> Идет реализация большого раздела для открытия счетов. Требуется создать новую роль (сотрудник банка), новые справочники и настроить сложную таблицу связей.</span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
              <span><strong>Раздел заявок:</strong> С нуля создается интерфейс для работы с заявками на счета. Разрабатываются статусы заявок, переходы между ними и логика обработки ошибок.</span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
             <span><strong>Интеграция с SSPB ID:</strong> Необходимо завершить интеграцию SSPB ID и СБ Арбитр. Для этого требуется вывести новую роль пользователя и реализовать логику работы системы с учетом этой роли, включая корректное распределение прав доступа и взаимодействие с существующими разделами.</span>
            </li>
          </ul>
        </motion.div>

      </div>

      {/* ГРАФИК РАЗРЫВА */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 shadow-xl"
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Динамика накопления требований</h2>
            <p className="text-slate-400 text-sm">Разрыв между объемом поступающих задач и скоростью их реализации</p>
          </div>
          <div className="flex gap-6">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-sm text-slate-300">Написано</span></div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-sm text-slate-300">Выполнено</span></div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gapData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} tickMargin={10} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              
              <Area type="monotone" dataKey="Реализовано" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDone)" />
              <Area type="monotone" dataKey="Уже написано" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}