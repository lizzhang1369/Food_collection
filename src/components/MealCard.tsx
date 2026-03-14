import React from 'react';
import { StarRating } from './StarRating';
import { motion, AnimatePresence } from 'motion/react';
import { User, Trash2, Drumstick, Leaf } from 'lucide-react';

interface Meal {
  id: number;
  author: string;
  dishName: string;
  deliciousness: number;
  difficulty: number;
  time: number;
  category: '荤菜' | '素菜';
  image: string;
  date: string;
}

export const MealCard: React.FC<{ meal: Meal; onDelete: () => void }> = ({ meal, onDelete }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="cartoon-card p-3 flex flex-col gap-3 group"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden cartoon-border">
        <img src={meal.image} alt={meal.dishName} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-orange-warm cartoon-border border-2 shadow-none">
            {meal.date}
          </div>
        </div>
        
        <div className="absolute top-2 left-2 flex gap-1">
          <AnimatePresence mode="wait">
            {!isConfirming ? (
              <motion.button
                key="delete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirming(true);
                }}
                className="bg-white/20 backdrop-blur-md text-white/80 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-white/30 shadow-sm"
                title="删除记录"
              >
                <Trash2 size={14} strokeWidth={2} />
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-white/50 shadow-xl"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black hover:bg-red-600 transition-colors"
                >
                  确定
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConfirming(false);
                  }}
                  className="bg-stone-200 text-stone-600 px-3 py-1 rounded-lg text-[10px] font-black hover:bg-stone-300 transition-colors"
                >
                  取消
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-black text-stone-800 leading-tight line-clamp-1">{meal.dishName}</h3>
          <div className="flex items-center justify-between text-stone-500 text-[10px] mt-0.5">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span className="font-bold">{meal.author}</span>
            </div>
            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-bold cartoon-border border-2 shadow-none flex items-center gap-1 ${
              meal.category === '荤菜' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'
            }`}>
              {meal.category === '荤菜' ? <Drumstick size={10} /> : <Leaf size={10} />}
              {meal.category}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-1.5 border-t border-stone-100">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-400">美味</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < meal.deliciousness ? 'bg-orange-warm' : 'bg-stone-200'}`} />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-400">难度</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < meal.difficulty ? 'bg-chick-yellow' : 'bg-stone-200'}`} />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-400">准备时间</span>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {meal.time} 分钟
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
