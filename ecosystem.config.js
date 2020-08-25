module.exports = {
  apps: [
    {
      name: 'Expenso Enterprise FrontEnd',
      script: 'yarn start',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

/* Run with pm2 
- Production:   pm2 start ecosystem.config.js
*/
