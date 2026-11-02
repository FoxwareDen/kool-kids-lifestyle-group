module.exports = {
  apps: [
    {
      name: "tanstack-app",
      script: "./.output/server/index.mjs",
      // Option A: Pass env variables directly here
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
        VITE_CMS_URI: "https://cms.foxwareden.co.za",
        CMS_URI: "https://cms.foxwareden.co.za",
        PAYMENT_SERVER_KEY: process.env.PAYMENT_SERVER_KEY
      },
      // Option B: Load a .env file (Node 20.6.0+)
      // node_args: "--env-file=.env",
      // Auto-restart parameters
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
    },
  ],
};