import Taro, {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Image, Text, View} from '@tarojs/components';
import React, {useMemo, useState} from 'react';

import type {Meal} from '@/types';
import {deleteMeal as deleteMealFromStore, getMeals} from '@/services/meals';
import {RatingDots} from '@/components/RatingDots';

const INITIAL_PAGE_SIZE = 6;
const LOAD_MORE_COUNT = 6;

function MealCard({meal, onDelete}: {meal: Meal; onDelete: () => void}) {
  return (
    <View className={`cartoon-border cartoon-card`} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <View className="cartoon-border" style={{borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1'}}>
        <Image
          src={meal.image}
          mode="aspectFill"
          style={{width: '100%', height: '100%'}}
          showMenuByLongpress
        />
        <View
          className="cartoon-border"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(255,255,255,0.92)',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'var(--stone-800)',
            borderRadius: 999,
            padding: '4px 10px',
            boxShadow: 'none',
          }}
        >
          <Text style={{fontSize: 11, fontWeight: 900, color: 'var(--orange-warm)'}}>{meal.date}</Text>
        </View>
        <Button
          size="mini"
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            padding: '0 10px',
            height: 28,
            lineHeight: '28px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.25)',
            color: '#fff',
            fontSize: 12,
          }}
          onClick={onDelete}
        >
          删除
        </Button>
      </View>

      <View>
        <Text style={{fontSize: 18, fontWeight: 900}}>{meal.dishName}</Text>
        <View style={{marginTop: 4}}>
          <Text style={{fontSize: 12, color: 'var(--stone-500)', fontWeight: 700}}>by {meal.author}</Text>
        </View>
      </View>

      <View style={{borderTop: '1px solid #f5f5f4', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8}}>
        <View style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 11, fontWeight: 800, color: '#a8a29e'}}>美味</Text>
          <RatingDots value={meal.deliciousness} color="var(--orange-warm)" />
        </View>
        <View style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 11, fontWeight: 800, color: '#a8a29e'}}>难度</Text>
          <RatingDots value={meal.difficulty} color="var(--chick-yellow)" />
        </View>
        <View style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 11, fontWeight: 800, color: '#a8a29e'}}>耗时</Text>
          <RatingDots value={meal.time} color="#6ee7b7" />
        </View>
      </View>
    </View>
  );
}

export default function IndexPage() {
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [isGalleryMode, setIsGalleryMode] = useState(false);

  const displayedMeals = useMemo(() => allMeals.slice(0, visibleCount), [allMeals, visibleCount]);
  const hasMore = visibleCount < allMeals.length;

  useDidShow(() => {
    // Refresh when coming back from create page.
    const meals = getMeals();
    setAllMeals(meals);
    setVisibleCount(INITIAL_PAGE_SIZE);
  });

  useReachBottom(() => {
    if (!hasMore) return;
    setVisibleCount((v) => v + LOAD_MORE_COUNT);
  });

  const handleDelete = async (id: number) => {
    const res = await Taro.showModal({title: '删除', content: '确定删除这条美食记录吗？'});
    if (!res.confirm) return;
    deleteMealFromStore(id);
    setAllMeals(getMeals());
  };

  return (
    <View className="page">
      <View className="header cartoon-border" style={{borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0}}>
        <View style={{maxWidth: 680, margin: '0 auto'}}>
          <Text className="headerTitle">美食瞬间</Text>
          <View>
            <Text className="headerSub">记录你的美味生活</Text>
          </View>
        </View>
      </View>

      <View className="container" style={{maxWidth: 680, margin: '0 auto'}}>
        <View className="toolbar">
          <View className={`toggle cartoon-border`} style={{borderWidth: 3, boxShadow: '2px 2px 0 rgba(41,37,36,1)'}}>
            <View
              className={`${'toggleBtn'} ${!isGalleryMode ? 'toggleBtnActive' : ''}`}
              onClick={() => setIsGalleryMode(false)}
            >
              大图
            </View>
            <View
              className={`${'toggleBtn'} ${isGalleryMode ? 'toggleBtnActive' : ''}`}
              onClick={() => setIsGalleryMode(true)}
            >
              相册
            </View>
          </View>
        </View>

        <View className={`grid ${isGalleryMode ? 'grid3' : 'grid2'}`}>
          {displayedMeals.map((meal) => (
            <View className="cardWrap" key={meal.id}>
              {isGalleryMode ? (
                <View
                  className="cartoon-border"
                  style={{borderRadius: 16, overflow: 'hidden', aspectRatio: '1 / 1', position: 'relative'}}
                  onClick={() => Taro.previewImage({urls: [meal.image]})}
                >
                  <Image src={meal.image} mode="aspectFill" style={{width: '100%', height: '100%'}} />
                </View>
              ) : (
                <MealCard meal={meal} onDelete={() => handleDelete(meal.id)} />
              )}
            </View>
          ))}
        </View>

        <View style={{padding: '22px 0', textAlign: 'center'}}>
          {hasMore ? (
            <Text style={{fontSize: 12, color: '#a8a29e', fontWeight: 700}}>继续下滑发现惊喜</Text>
          ) : allMeals.length ? (
            <Text style={{fontSize: 12, color: '#d6d3d1', fontWeight: 800}}>已经到底啦，快去创作新菜吧</Text>
          ) : (
            <Text style={{fontSize: 12, color: '#a8a29e', fontWeight: 700}}>还没有分享过美食呢</Text>
          )}
        </View>
      </View>

      <View className="fabWrap">
        <Button
          className={`cartoon-border cartoon-button fab`}
          onClick={() => Taro.navigateTo({url: '/pages/create/index'})}
        >
          + 上传美食
        </Button>
      </View>
    </View>
  );
}

