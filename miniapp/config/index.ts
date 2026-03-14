import {defineConfig} from '@tarojs/cli';
import path from 'path';

import dev from './dev';
import prod from './prod';

export default defineConfig((merge, {mode}) => {
  const baseConfig = {
    projectName: 'meal-moments-miniapp',
    date: '2026-03-14',
    designWidth: 375,
    deviceRatio: {
      375: 2,
      750: 1,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    framework: 'react',
    compiler: 'webpack5',
    plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-weapp'],
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    cache: {
      enable: false,
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 10240,
          },
        },
        cssModules: {
          enable: false,
        },
      },
    },
    h5: {},
  };

  return merge({}, baseConfig, mode === 'development' ? dev : prod);
});
