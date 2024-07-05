// Sky ER110 Router - Internet Reconnect Script
// Used to quickly reconnect sky router to the internet,
//   which usually fixes speed drop and/or lags.
// (C) Jixun Moe <jixun.moe@gmail.com>
// MIT Licensed

import Axios from 'axios';

const { ip, user, pass } = require('./config.js');

const axios = Axios.create({
  baseURL: `http://${ip}`,
});

axios.interceptors.request.use((config) => {
  config.auth = { username: user, password: pass };

  return config;
});

const ROUTER_PAGE = '/sky_st_poe.html';
const ROUTER_ACTION_ENDPOINT = '/sky_st_poe.sky';

async function preloadSession() {
  await request(ROUTER_PAGE);
}

async function routerGetSessionKey() {
  const html = await request(ROUTER_PAGE);
  const match = html.match(/sessionKey" value="(\d+)"/);
  return match ? match[1] : '';
}

async function routerAction(action) {
  const sessionKey = await routerGetSessionKey();

  await request(ROUTER_ACTION_ENDPOINT, {
    method: 'POST',
    body: { interval: 0, todo: action, sessionKey },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

async function restartRouter() {
  console.info('disconnect...');
  await routerAction('disconnect');

  console.info('connect...');
  await routerAction('connect');
}

async function main() {
  console.info('initialise session...');
  await preloadSession();

  for (let i = 0; i < 3; i++) {
    try {
      console.info('try to restart connection...');
      await restartRouter();
      console.info('done');
      break;
    } catch (error) {
      console.info('failed');
    }
  }
}

main().catch(console.error);
