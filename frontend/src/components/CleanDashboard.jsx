/* eslint-disable no-unused-vars */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skull, Flame, Bug, AlertOctagon, ShieldAlert, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

// Моковые данные с экспоненциальным разрывом с января
const gapData = [
  { name: '1 Янв', "Новые требования (Написано)": 15, "Реализовано (PROD)": 8 },
  { name: '15 Янв', "Новые требования (Написано)": 38, "Реализовано (PROD)": 14 },
  { name: '1 Фев', "Новые требования (Написано)": 52, "Реализовано (PROD)": 22 },
  { name: '15 Фев', "Новые требования (Написано)": 84, "Реализовано (PROD)": 31 },
  { name: '1 Мар', "Новые требования (Написано)": 102, "Реализовано (PROD)": 38 },
  { name: 'Сегодня', "Новые требования (Написано)": 132, "Реализовано (PROD)": 45 },
];

export default function CleanDashboard() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* БЛОК С "БОССАМИ" */}
      <div className="grid grid-cols-2 gap-8">
        
        {/* БОСС 1: СБ АРБИТР */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-slate-900/80 p-8 rounded-3xl border-2 border-orange-900/50 shadow-[0_0_30px_rgba(194,65,12,0.15)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-950 text-orange-500 rounded-xl border border-orange-800">
              <ShieldAlert size={32} />
            </div>
            <div>
              <p className="text-orange-500 text-sm font-bold uppercase tracking-widest">Цель #1 (Опасность: Высокая)</p>
              <h2 className="text-3xl font-black text-white">СБ Арбитр</h2>
            </div>
          </div>
          
          <ul className="space-y-4 text-slate-300">
            <li className="flex gap-3 items-start">
              <Swords className="text-orange-500 shrink-0 mt-1" size={18} />
              <span><strong>Интеграции и открытие счетов:</strong> Сложная бизнес-логика, требующая постоянных переработок.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Swords className="text-orange-500 shrink-0 mt-1" size={18} />
              <span><strong>Вывод новых ролей:</strong> Арбитражные управляющие, ОТР, Физ.лица — запутанная матрица прав доступа.</span>
            </li>
          </ul>
        </motion.div>

        {/* БОСС 2: ССПБ ID (ГЛАВНЫЙ БОСС) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-red-950/40 p-8 rounded-3xl border-2 border-red-800/60 shadow-[0_0_40px_rgba(220,38,38,0.2)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/30 transition-all"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-red-900 text-red-400 rounded-xl border border-red-700 animate-pulse">
              <Skull size={32} />
            </div>
            <div>
              <p className="text-red-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                ГЛАВНЫЙ БОСС <Flame size={14} className="animate-bounce" />
              </p>
              <h2 className="text-3xl font-black text-white">ССПБ ID</h2>
            </div>
          </div>
          
          <ul className="space-y-4 text-slate-300 relative z-10">
            <li className="flex gap-3 items-start">
              <AlertOctagon className="text-red-500 shrink-0 mt-1" size={18} />
              <span><strong>Сырой продукт & Ошибка архитектуры:</strong> Изначально выбрали <span className="text-white font-bold border-b border-red-500">Zitadel вместо Keycloak</span>. Это генерирует бесконечный поток критических ошибок.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Bug className="text-red-500 shrink-0 mt-1" size={18} />
              <span><strong>Огромное количество багов:</strong> Команда тестирования находит баги быстрее, чем физически возможно их исправить.</span>
            </li>
            <li className="flex gap-3 items-start bg-red-950/50 p-3 rounded-lg border border-red-900/50">
              <AlertOctagon className="text-red-400 shrink-0 mt-1" size={18} />
              <span><strong>Выживающие:</strong> Проект тянут на себе только <span className="text-red-300 font-bold">Трофим</span> и <span className="text-red-300 font-bold">Саша Светиков</span>. Лимит пропускной способности исчерпан.</span>
            </li>
          </ul>
        </motion.div>

      </div>

      {/* ГРАФИК РАЗРЫВА */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold mb-2 text-white flex items-center gap-3">
          График разрыва: <span className="text-red-500">Накопление технического долга</span>
        </h2>
        <p className="text-slate-400 mb-8">Скорость генерации новых требований и баг-репортов многократно превышает скорость физической разработки из-за нехватки рук.</p>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gapData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {/* Градиент для лавины требований (Красный) */}
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                {/* Градиент для реальной разработки (Зеленый) */}
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickMargin={10} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              
              {/* Площадь реальной работы (Снизу) */}
              <Area 
                type="monotone" 
                dataKey="Реализовано (PROD)" 
                stroke="#10b981" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorDone)" 
              />
              {/* Площадь нарастающего долга (Сверху) */}
              <Area 
                type="monotone" 
                dataKey="Новые требования (Написано)" 
                stroke="#ef4444" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorReq)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}