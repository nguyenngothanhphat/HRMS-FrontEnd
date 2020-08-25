// https://umijs.org/config/
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const { pwa, theme } = defaultSettings;
const { APP_TYPE } = process.env;
const TARGET = 'http://localhost:4500';
const API_SERVER = '/server/api/';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true,
        default: 'en-US',
        baseNavigator: false,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
    },
  ],
];

export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: APP_TYPE || '',
  },
  treeShaking: true,
  routes: pageRoutes,
  // Theme for antd
  theme,
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
    '/api/attachments': {
      target: TARGET,
      changeOrigin: true,
    },
    [API_SERVER]: {
      target: TARGET,
      changeOrigin: true,
      pathRewrite: { [`^${API_SERVER}`]: '' },
    },
    '/image/': {
      target: TARGET,
      changeOrigin: true,
    },
    '/server/apigoogle/': {
      target: 'https://maps.googleapis.com/maps/api',
      changeOrigin: true,
      pathRewrite: { '^/server/apigoogle/': '' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `intranet-${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
