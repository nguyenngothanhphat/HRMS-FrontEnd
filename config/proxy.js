export default {
  dev: {
    // for umi request
    '/api/': {
      // target: 'http://localhost:4500',
      target: 'http://api-stghrms.paxanimi.ai',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    // for axios request
    API_SQL: 'http://10.20.29.171:8000',
  },
};
