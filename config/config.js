// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
    'padding-lg': '24px',
    'padding-md': '16px',
    'margin-lg': '24px',
    'margin-md': '16px',
    'table-font-size': '13px',
    'pagination-item-link-bg': '#f0f2f6',
    // tabs
    'tabs-title-font-size': '18px',
    'tabs-active-color': defaultSettings.primaryColor,
    // table
    'table-header-bg': defaultSettings.primaryColor,
    'table-header-color': '#ffffff',
    'table-padding-vertical-md': '8px',
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
});
