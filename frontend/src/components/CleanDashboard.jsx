/* eslint-disable no-unused-vars */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Network, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const gapData = [
  { name: '1 Янв', "Новые требования (Backlog)": 15, "Реализовано (Released)": 8 },
  { name: '15 Янв', "Новые требования (Backlog)": 38, "Реализовано (Released)": 14 },
  { name: '1 Фев', "Новые требования (Backlog)": 85, "Реализовано (Released)": 22 },
  { name: '15 Фев', "Новые требования (Backlog)": 142, "Реализовано (Released)": 31 },
  { name: '1 Мар', "Новые требования (Backlog)": 210, "Реализовано (Released)": 38 },
  { name: 'Сегодня', "Новые требования (Backlog)": 275, "Реализовано (Released)": 45 },
];

export default function CleanDashboard() {
  return (
    <div className="flex flex-col gap-8">
      
      <div className="grid grid-cols-2 gap-8">
        
        {/* АУДИТ 1: СБ АРБИТР */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-900/50 text-blue-400 rounded-xl border border-blue-800">
              <Network size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Фокус разработки</p>
              <h2 className="text-2xl font-bold text-white">СБ Арбитр</h2>
            </div>
          </div>
          
          <ul className="space-y-4 text-slate-300 text-sm">
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              <span><strong>Интеграционный слой:</strong> Усложненная бизнес-логика открытия счетов требует постоянного рефакторинга API и адаптации моделей данных.</span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              <span><strong>Матрица доступов (RBAC):</strong> Внедрение новых ролей (Арбитражные управляющие, ОТР, Физ.лица) требует пересмотра архитектуры авторизации.</span>
            </li>
          </ul>
        </motion.div>

        {/* АУДИТ 2: ССПБ ID */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-indigo-900/50 text-indigo-400 rounded-xl border border-indigo-800">
              <Database size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Технический аудит</p>
              <h2 className="text-2xl font-bold text-white">ССПБ ID</h2>
            </div>
          </div>
          
          <ul className="space-y-4 text-slate-300 text-sm">
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong>Технический долг архитектуры:</strong> Интеграция Zitadel вместо Keycloak генерирует аномальный объем дефектов в базовых процессах аутентификации.</span>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong>Деградация пропускной способности:</strong> Скорость выявления дефектов QA-инженерами кратно превышает Capacity (емкость) команды разработки.</span>
            </li>
            <li className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <Activity className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <span><strong>Утилизация ресурсов (100%+):</strong> Проект поддерживается силами двух инженеров (Трофим, А. Светиков), что создает единую точку отказа (SPOF).</span>
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
            <h2 className="text-2xl font-bold mb-2 text-white">Динамика накопления требований (Tech Debt)</h2>
            <p className="text-slate-400 text-sm">Разрыв между объемом поступающих задач и скоростью их реализации (Velocity).</p>
          </div>
          <div className="flex gap-6">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-sm text-slate-300">Backlog (Требования)</span></div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-sm text-slate-300">Released (Выполнено)</span></div>
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
              
              <Area type="monotone" dataKey="Реализовано (Released)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDone)" />
              <Area type="monotone" dataKey="Новые требования (Backlog)" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}