# Trådfri Control Panel

This repository contains the source code for my latest hobby project: The Trådfri control panel.

*TODO: Description*

## Running the app

First install dependencies with `npm install`

To run the application in development mode:

```
npm run dev
```

Or in production mode:

```
npm build
npm start
```

The client application runs on port 3000 by default. You can run the app in a different port by launching the app like this: `PORT=<PORT_NUMBER> npm start`.
In development mode all fetch-requests to `/api` are proxied to `localhost:8080` where the express server is hosted.

In production mode, the `dist` folder contents built by webpack will be served by the back-end server at `localhost:8080`

### Registering gateways

When you launch the application the first time, you will be prompted with a setup wizard for registering your gateway.

## Deploying to a remote server (like Raspberry Pi)

First make sure you have `git`, `node` (tested working with version `10.14`), `webpack@^4.x.x`, `webpack-cli` and `pm2` installed on your server.
PM2 also has to be installed on the computer where you run the deployment.

Webpack is required for now since the bundle is built during deployment. This might change in the future.

I have created a PM2 deployment template called `ecosystem.deploy.json.template`. You can use it as a base for creating your deployment configuration.

The deployment is done over SSH so make sure you have a public key installed to your server to allow easier deployments without the need for passwords. More information about this can be found [from PM2 deploy documentation](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/)

When you have created the deploy configuration, you can deploy the app with:

```
pm2 deploy ecosystem.deploy.json production setup
pm2 deploy ecosystem.deploy.json production
```

To deploy a specific branch use:

```
pm2 deploy ecosystem.deploy.json production ref origin/<BRANCH>
```

## Development

### Mock JSON server

A mock `json-server` can be used instead by running `npm run dev-mock`. Mock data will be served on `http://localhost:8080`.
