import Taro from '@tarojs/taro';
import type {Meal} from '@/types';

const STORAGE_KEY = 'meal_moments_meals_v1';

const seedMeals: Meal[] = [
  {
    id: 1,
    author: '小厨神',
    dishName: '黄金蛋炒饭',
    deliciousness: 5,
    difficulty: 2,
    time: 1,
    image: 'https://picsum.photos/seed/friedrice/800/800',
    date: '2024/03/14',
  },
  {
    id: 2,
    author: '美食达人',
    dishName: '秘制红烧肉',
    deliciousness: 5,
    difficulty: 4,
    time: 5,
    image: 'https://picsum.photos/seed/pork/800/800',
    date: '2024/03/13',
  },
];

export function getMeals(): Meal[] {
  const raw = Taro.getStorageSync(STORAGE_KEY);
  if (!raw) return seedMeals;
  try {
    const parsed = JSON.parse(raw) as Meal[];
    return Array.isArray(parsed) ? parsed : seedMeals;
  } catch {
    return seedMeals;
  }
}

export function setMeals(meals: Meal[]) {
  Taro.setStorageSync(STORAGE_KEY, JSON.stringify(meals));
}

export function addMeal(meal: Meal) {
  const meals = getMeals();
  setMeals([meal, ...meals]);
}

export function deleteMeal(id: number) {
  const meals = getMeals().filter((m) => m.id !== id);
  setMeals(meals);
}

