export default {
  dev: {
    // for umi request - all in project
    '/api/': {
      // target: 'http://localhost:4500',
      target: 'https://stghrms.paxanimi.ai',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    // for axios request - timesheet
    API_TIMESHEET: 'https://stghrms.paxanimi.ai/timesheet',
    // API_TIMESHEET: 'http://10.20.29.171:8000',
  },
};
