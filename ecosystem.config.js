module.exports = {
  apps: [{
    name: "tradfri-control-panel",
    script: "npm start",
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
      ref: process.env.DEPLOY_BRANCH,
      path: "/var/tradfri-control-panel",
      ssh_options: "StrictHostKeyChecking=no",
      "post-deploy": "npm i && npm run build && pm2 startOrRestart"
    }
  }
}