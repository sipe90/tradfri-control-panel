module.exports = {
  apps: [{
    name: "tradfri-control-panel",
    script: "yarn start",
    watch: false,
    env: {
      NODE_ENV: "production",
      HOST: process.env.HOST || "0.0.0.0",
      PORT: process.env.PORT || 8080
    }
  }],
  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      key: process.env.DEPLOY_KEY || undefined,
      host: process.env.DEPLOY_HOST,
      repo: "https://github.com/sipe90/tradfri-control-panel.git",
      ref: process.env.DEPLOY_REF,
      path: process.env.DEPLOY_PATH || "/var/tradfri-control-panel",
      "post-deploy": "yarn install && yarn build && pm2 startOrRestart ecosystem.config.js"
    }
  }
}