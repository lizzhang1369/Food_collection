import { useState, useEffect, useRef } from 'react';
import { Plus, UtensilsCrossed, Loader2, LayoutGrid, Square, Drumstick, Leaf, Clock, ChevronDown, Download } from 'lucide-react';
import { MealCard } from './components/MealCard';
import { MealForm } from './components/MealForm';
import { SoupLogo } from './components/SoupLogo';
import { AnimatePresence, motion } from 'motion/react';

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

const INITIAL_PAGE_SIZE = 4;
const LOAD_MORE_COUNT = 4;

export default function App() {
  const [allMeals, setAllMeals] = useState<Meal[]>([
    { id: 1, author: "小厨神", dishName: "黄金蛋炒饭", deliciousness: 5, difficulty: 2, time: 15, category: '素菜', image: "https://picsum.photos/seed/friedrice/800/800", date: "2024/03/14" },
    { id: 2, author: "美食达人", dishName: "秘制红烧肉", deliciousness: 5, difficulty: 4, time: 90, category: '荤菜', image: "https://picsum.photos/seed/pork/800/800", date: "2024/03/13" },
    { id: 3, author: "甜点控", dishName: "草莓奶油蛋糕", deliciousness: 5, difficulty: 3, time: 60, category: '素菜', image: "https://picsum.photos/seed/cake/800/800", date: "2024/03/12" },
    { id: 4, author: "面条王", dishName: "老北京炸酱面", deliciousness: 4, difficulty: 2, time: 30, category: '荤菜', image: "https://picsum.photos/seed/noodles/800/800", date: "2024/03/11" },
    { id: 5, author: "海鲜迷", dishName: "清蒸大螃蟹", deliciousness: 5, difficulty: 1, time: 20, category: '荤菜', image: "https://picsum.photos/seed/crab/800/800", date: "2024/03/10" },
    { id: 6, author: "火锅狂人", dishName: "麻辣牛油火锅", deliciousness: 5, difficulty: 1, time: 45, category: '荤菜', image: "https://picsum.photos/seed/hotpot/800/800", date: "2024/03/09" },
    { id: 7, author: "早餐达人", dishName: "全麦三明治", deliciousness: 4, difficulty: 1, time: 10, category: '素菜', image: "https://picsum.photos/seed/sandwich/800/800", date: "2024/03/08" },
    { id: 8, author: "意面控", dishName: "番茄肉酱面", deliciousness: 5, difficulty: 2, time: 25, category: '荤菜', image: "https://picsum.photos/seed/pasta/800/800", date: "2024/03/07" },
    { id: 9, author: "沙拉派", dishName: "牛油果鸡肉沙拉", deliciousness: 4, difficulty: 1, time: 15, category: '荤菜', image: "https://picsum.photos/seed/salad/800/800", date: "2024/03/06" },
    { id: 10, author: "披萨迷", dishName: "玛格丽特披萨", deliciousness: 5, difficulty: 3, time: 40, category: '荤菜', image: "https://picsum.photos/seed/pizza/800/800", date: "2024/03/05" },
    { id: 11, author: "日料粉", dishName: "三文鱼刺身", deliciousness: 5, difficulty: 1, time: 10, category: '荤菜', image: "https://picsum.photos/seed/sushi/800/800", date: "2024/03/04" },
    { id: 12, author: "烧烤王", dishName: "炭烤羊肉串", deliciousness: 5, difficulty: 2, time: 30, category: '荤菜', image: "https://picsum.photos/seed/bbq/800/800", date: "2024/03/03" },
  ]);

  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [filter, setFilter] = useState<'全部' | '荤菜' | '素菜'>('全部');
  const [timeFilter, setTimeFilter] = useState<'全部' | '快速' | '常规' | '慢炖'>('全部');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const addMeal = (newMeal: Meal) => {
    setAllMeals([newMeal, ...allMeals]);
    setIsFormOpen(false);
  };

  const deleteMeal = (id: number) => {
    setAllMeals(allMeals.filter(meal => meal.id !== id));
  };

  const filteredMeals = allMeals.filter(meal => {
    const categoryMatch = filter === '全部' || meal.category === filter;
    let timeMatch = true;
    if (timeFilter === '快速') timeMatch = meal.time <= 20;
    else if (timeFilter === '常规') timeMatch = meal.time > 20 && meal.time <= 45;
    else if (timeFilter === '慢炖') timeMatch = meal.time > 45;
    
    return categoryMatch && timeMatch;
  });

  const displayedMeals = filteredMeals.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMeals.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const loadMore = () => {
    setIsLoading(true);
    // 模拟网络延迟
    setTimeout(() => {
      setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoading(false);
    }, 800);
  };

  const exportToPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    
    try {
      // Lazy-load heavy export libraries so the initial bundle stays small and deployments are faster.
      const [html2canvasMod, jspdfMod] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const html2canvas = (html2canvasMod as any).default || html2canvasMod;
      const jsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default;

      // Wait for a bit to ensure the hidden element is rendered if we were to use one
      // But we'll just use the exportRef which we will add to the DOM hidden
      const element = exportRef.current;
      if (!element) return;

      // Temporarily show the element for capturing
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#F5F5F0', // Match the warm background
      });
      
      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`美食瞬间_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-chick-yellow cartoon-border border-t-0 border-x-0 rounded-b-[40px] px-6 pt-12 pb-8 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <h1 className="text-3xl font-black text-stone-800 flex items-center gap-2">
              美食瞬间 <UtensilsCrossed className="text-orange-warm" />
            </h1>
            <p className="text-stone-700 font-bold mt-1 opacity-80">记录你的美味生活 ✨</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={exportToPDF}
              disabled={isExporting}
              className="w-10 h-10 bg-white rounded-xl cartoon-border flex items-center justify-center text-stone-600 hover:text-orange-warm transition-colors disabled:opacity-50"
              title="导出 PDF"
            >
              {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            </motion.button>
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-16 h-16 bg-white rounded-2xl cartoon-border flex items-center justify-center overflow-hidden"
            >
              <SoupLogo />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto p-6">
        {/* View Toggle & Filter */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Category Filter */}
              <div className="flex bg-stone-100 p-1 rounded-2xl cartoon-border border-2 flex-1 sm:flex-none">
                {(['全部', '荤菜', '素菜'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilter(type);
                      setVisibleCount(INITIAL_PAGE_SIZE);
                    }}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
                      filter === type 
                        ? 'bg-white text-orange-warm shadow-sm' 
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {type === '荤菜' && <Drumstick size={14} />}
                    {type === '素菜' && <Leaf size={14} />}
                    {type}
                  </button>
                ))}
              </div>

              {/* Time Filter Dropdown */}
              <div className="relative" ref={timeDropdownRef}>
                <button
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2 cartoon-border border-2 ${
                    timeFilter !== '全部' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Clock size={16} />
                  <span className="hidden sm:inline">{timeFilter === '全部' ? '准备时间' : timeFilter}</span>
                  <span className="sm:hidden">{timeFilter === '全部' ? '' : timeFilter}</span>
                  <ChevronDown size={14} className={`transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isTimeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-40 bg-white cartoon-border border-2 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      {(['全部', '快速', '常规', '慢炖'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTimeFilter(t);
                            setVisibleCount(INITIAL_PAGE_SIZE);
                            setIsTimeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-bold flex items-center justify-between transition-colors ${
                            timeFilter === t ? 'bg-emerald-50 text-emerald-600' : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{t === '全部' ? '全部时间' : t}</span>
                            {t !== '全部' && (
                              <span className="text-[10px] opacity-60 font-normal">
                                {t === '快速' && '≤20分钟'}
                                {t === '常规' && '20-45分钟'}
                                {t === '慢炖' && '>45分钟'}
                              </span>
                            )}
                          </div>
                          {timeFilter === t && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-white cartoon-border rounded-2xl p-1 flex gap-1 self-end sm:self-auto">
              <button
                onClick={() => setIsGalleryMode(false)}
                className={`p-2 rounded-xl transition-all ${!isGalleryMode ? 'bg-chick-yellow text-stone-800' : 'text-stone-400 hover:bg-stone-50'}`}
                title="大图模式"
              >
                <Square size={20} />
              </button>
              <button
                onClick={() => setIsGalleryMode(true)}
                className={`p-2 rounded-xl transition-all ${isGalleryMode ? 'bg-chick-yellow text-stone-800' : 'text-stone-400 hover:bg-stone-50'}`}
                title="相册模式"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className={isGalleryMode ? "grid grid-cols-4 gap-2" : "grid grid-cols-2 sm:grid-cols-3 gap-4"}>
          <AnimatePresence mode="popLayout">
            {displayedMeals.map((meal) => (
              isGalleryMode ? (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="aspect-square cartoon-border overflow-hidden rounded-xl group cursor-pointer relative"
                >
                  <img
                    src={meal.image}
                    alt={meal.dishName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-white text-[10px] font-bold leading-tight line-clamp-2 drop-shadow-md">{meal.dishName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定删除？')) deleteMeal(meal.id);
                      }}
                      className="absolute top-1 right-1 bg-white/20 backdrop-blur-md text-white/80 p-1 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-white/30"
                    >
                      <Plus size={10} className="rotate-45" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <MealCard key={meal.id} meal={meal} onDelete={() => deleteMeal(meal.id)} />
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Infinite Scroll Loader */}
        <div ref={loaderRef} className="py-12 flex flex-col items-center justify-center gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-orange-warm font-bold">
              <Loader2 className="animate-spin" size={32} />
              <span>正在寻找更多美味...</span>
            </div>
          ) : hasMore ? (
            <div className="text-stone-400 text-sm font-bold italic">继续下滑发现惊喜 🍰</div>
          ) : allMeals.length > 0 ? (
            <div className="flex flex-col items-center gap-2 text-stone-300 font-bold">
              <div className="text-4xl">🏁</div>
              <span>已经到底啦，快去创作新菜吧！</span>
            </div>
          ) : null}
        </div>

        {allMeals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥣</div>
            <p className="text-stone-400 font-bold">还没有分享过美食呢，快去上传吧！</p>
          </div>
        )}

        {/* Hidden Export Content */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={exportRef} style={{ width: '800px', padding: '40px', background: '#F5F5F0' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#2D2D2D' }}>我的美食瞬间清单</h1>
              <p style={{ color: '#666', marginTop: '10px' }}>导出日期: {new Date().toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {allMeals.map(meal => (
                <div key={meal.id} style={{ 
                  background: 'white', 
                  borderRadius: '20px', 
                  border: '3px solid #2D2D2D', 
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    borderRadius: '15px', 
                    overflow: 'hidden',
                    border: '2px solid #2D2D2D'
                  }}>
                    <img src={meal.image} alt={meal.dishName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#2D2D2D' }}>{meal.dishName}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                      <p style={{ fontSize: '12px', color: '#666' }}>作者: {meal.author} | 日期: {meal.date}</p>
                      <div style={{ 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        padding: '2px 8px', 
                        borderRadius: '6px', 
                        border: '1px solid #2D2D2D',
                        backgroundColor: meal.category === '荤菜' ? '#FEF2F2' : '#F0FDF4',
                        color: meal.category === '荤菜' ? '#EF4444' : '#22C55E'
                      }}>
                        {meal.category}
                      </div>
                    </div>
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>美味: {'⭐'.repeat(meal.deliciousness)}</span>
                      <span>难度: {'🔥'.repeat(meal.difficulty)}</span>
                    </div>
                    <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>
                        准备时间: {meal.time} 分钟
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFormOpen(true)}
          className="cartoon-button flex items-center gap-2 shadow-xl pointer-events-auto"
        >
          <Plus size={24} strokeWidth={3} />
          <span className="text-lg">上传美食</span>
        </motion.button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <MealForm
            onSubmit={addMeal}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-4 -z-10 opacity-20 pointer-events-none rotate-12">
        <div className="text-8xl">🍳</div>
      </div>
      <div className="fixed bottom-20 right-4 -z-10 opacity-20 pointer-events-none -rotate-12">
        <div className="text-8xl">🍕</div>
      </div>
    </div>
  );
}
