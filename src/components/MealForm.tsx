import React, { useState, useRef } from 'react';
import { Camera, X, Plus, Calendar as CalendarIcon, Drumstick, Leaf } from 'lucide-react';
import { StarRating } from './StarRating';
import { motion, AnimatePresence } from 'motion/react';

interface MealFormProps {
  onSubmit: (meal: any) => void;
  onClose: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({ onSubmit, onClose }) => {
  const [author, setAuthor] = useState('');
  const [dishName, setDishName] = useState('');
  const [deliciousness, setDeliciousness] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [category, setCategory] = useState<'荤菜' | '素菜'>('荤菜');
  const [time, setTime] = useState(30);
  const [date, setDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !dishName || !image) {
      alert('请填写完整信息并上传照片哦！');
      return;
    }
    onSubmit({
      id: Date.now(),
      author,
      dishName,
      deliciousness,
      difficulty,
      category,
      time,
      image,
      date: date.replace(/-/g, '/'),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="cartoon-card w-full max-w-md relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-orange-warm mb-6 flex items-center gap-2">
          <Plus className="bg-chick-yellow rounded-lg p-1" />
          分享我的美食
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-600">作者</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="你的大名..."
              className="w-full cartoon-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chick-yellow"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-600">菜名</label>
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="这道菜叫什么？"
              className="w-full cartoon-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chick-yellow"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-600">记录日期</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full cartoon-border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-chick-yellow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StarRating label="美味程度" value={deliciousness} onChange={setDeliciousness} />
            <StarRating label="制作难度" value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-600">分类</label>
            <div className="flex gap-2">
              {['荤菜', '素菜'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as '荤菜' | '素菜')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cartoon-border flex items-center justify-center gap-2 ${
                    category === cat 
                      ? 'bg-orange-warm text-white border-orange-warm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]' 
                      : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat === '荤菜' ? <Drumstick size={16} /> : <Leaf size={16} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-600">准备时间 (分钟)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              placeholder="花了多久？"
              className="w-full cartoon-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chick-yellow"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-600">美食照片</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cartoon-border rounded-2xl h-36 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-stone-400">
                  <Camera size={48} strokeWidth={1.5} />
                  <span className="text-sm font-bold mt-2">点击上传照片</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <button type="submit" className="w-full cartoon-button text-lg mt-4">
            发布瞬间 ✨
          </button>
        </form>
      </div>
    </motion.div>
  );
};
