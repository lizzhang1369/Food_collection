import Taro from '@tarojs/taro';
import {Button, Image, Input, Picker, Text, View} from '@tarojs/components';
import React, {useMemo, useState} from 'react';

import {addMeal} from '@/services/meals';
import type {Meal} from '@/types';

function todayYmd() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function StarPicker({
  label,
  value,
  onChange,
  activeColor,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  activeColor: string;
}) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);
  return (
    <View className="field">
      <Text className="label">{label}</Text>
      <View className="stars">
        {stars.map((s) => (
          <Text
            key={s}
            className="star"
            style={{color: s <= value ? activeColor : '#d6d3d1'}}
            onClick={() => onChange(s)}
          >
            ★
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function CreatePage() {
  const [author, setAuthor] = useState('');
  const [dishName, setDishName] = useState('');
  const [date, setDate] = useState(todayYmd());
  const [deliciousness, setDeliciousness] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [time, setTime] = useState(3);
  const [imageDataUrl, setImageDataUrl] = useState<string>('');

  const pickImage = async () => {
    const res = await Taro.chooseImage({count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera']});
    const filePath = res.tempFilePaths?.[0];
    if (!filePath) return;
    const ext = (filePath.split('.').pop() || 'jpeg').toLowerCase();
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

    // Convert to base64 so it survives app restarts when stored in local storage.
    const fs = Taro.getFileSystemManager();
    const base64 = await new Promise<string>((resolve, reject) => {
      fs.readFile({
        filePath,
        encoding: 'base64',
        success: (r) => resolve(String(r.data || '')),
        fail: reject,
      });
    });
    setImageDataUrl(`data:${mime};base64,${base64}`);
  };

  const submit = async () => {
    if (!author.trim() || !dishName.trim() || !imageDataUrl) {
      await Taro.showToast({title: '请填写作者、菜名并上传照片', icon: 'none'});
      return;
    }

    const meal: Meal = {
      id: Date.now(),
      author: author.trim(),
      dishName: dishName.trim(),
      deliciousness,
      difficulty,
      time,
      image: imageDataUrl,
      date: date.replace(/-/g, '/'),
    };

    addMeal(meal);
    await Taro.showToast({title: '已发布', icon: 'success'});
    Taro.navigateBack();
  };

  return (
    <View className="wrap">
      <View className="field">
        <Text className="label">作者</Text>
        <Input
          className={`input cartoon-border`}
          value={author}
          onInput={(e) => setAuthor(e.detail.value)}
          placeholder="你的大名..."
        />
      </View>

      <View className="field">
        <Text className="label">菜名</Text>
        <Input
          className={`input cartoon-border`}
          value={dishName}
          onInput={(e) => setDishName(e.detail.value)}
          placeholder="这道菜叫什么？"
        />
      </View>

      <View className="field">
        <Text className="label">记录日期</Text>
        <Picker
          mode="date"
          value={date}
          onChange={(e) => setDate(String(e.detail.value))}
        >
          <View className={`pickerRow cartoon-border`}>
            <Text style={{fontWeight: 800}}>{date}</Text>
            <Text style={{color: '#a8a29e', fontWeight: 800}}>选择</Text>
          </View>
        </Picker>
      </View>

      <StarPicker label="美味程度" value={deliciousness} onChange={setDeliciousness} activeColor="var(--orange-warm)" />
      <StarPicker label="制作难度" value={difficulty} onChange={setDifficulty} activeColor="var(--chick-yellow)" />
      <StarPicker label="制作时间" value={time} onChange={setTime} activeColor="#6ee7b7" />

      <View className="field">
        <Text className="label">美食照片</Text>
        <View className={`photoBox cartoon-border`} onClick={pickImage}>
          {imageDataUrl ? (
            <Image src={imageDataUrl} mode="aspectFill" style={{width: '100%', height: '100%'}} />
          ) : (
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
              <Text style={{fontSize: 36}}>📷</Text>
              <Text className="hint">点击选择/拍照上传</Text>
            </View>
          )}
        </View>
      </View>

      <Button className={`cartoon-border cartoon-button`} onClick={submit}>
        发布瞬间
      </Button>
    </View>
  );
}

