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

## Mock JSON server

A mock `json-server` can be used instead by running `npm run dev-mock`. Mock data will be served on `http://localhost:8080`.

## Database

The server uses SQLite3 for storing persistent data. A `docker-compose.yml` is provided to set up a web interface for managing the data. It can be accessed from `http://localhost:8081`.
