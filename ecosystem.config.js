module.exports = {
  apps: [{
    name: "tradfri-control-panel",
    script: "yarn start",
    watch: false,
    env: {
      NODE_ENV: "production",
      HOST: "0.0.0.0",
      PORT: 8080
    }
  }],
  deploy: {
    production: {
      user: "pi",
      key: "~/.ssh/id_rsa",
      host: process.env.DEPLOY_HOST,
      repo: "https://github.com/sipe90/tradfri-control-panel.git",
      ref: process.env.DEPLOY_REF,
      path: "/var/tradfri-control-panel",
      "post-deploy": "yarn install && yarn build && pm2 startOrRestart ecosystem.config.js"
    }
  }
}