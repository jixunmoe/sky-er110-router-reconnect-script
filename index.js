// Sky ER110 - Internet Reconnect Script
// Used to quickly reconnect sky router to the internet,
//   which usually fixes speed drop and/or lags.
// (C) Jixun Moe <jixun.moe@gmail.com>
// MIT Licensed

const fetch = require('node-fetch');

const { ip, user, pass } = require('./config.js');

function getUrl(path) {
	return `http://${ip}${path}`;
}

function b64(text) {
	return Buffer.from(text).toString('base64');
}

const UrlGetSessionKey = getUrl('/sky_st_poe.html');
const UrlAction = getUrl('/sky_st_poe.sky');

const basicAuth = b64(`${user}:${pass}`);
const Authorization = `Basic ${basicAuth}`;

async function routerGetSessionKey () {
	const res = await fetch(UrlGetSessionKey, {
		headers: { Authorization },
	});
	
	const text = await res.text();
	const sessionKey = text.match(/sessionKey" value="(\d+)"/)[1];
	return sessionKey;
}

async function routerAction(action) {
	const sessionKey = await routerGetSessionKey();
	const res = await fetch(UrlAction, {
		method: 'POST',
		body: `interval=0&todo=${action}&sessionKey=${sessionKey}`,
		headers: { Authorization },
	});
	
	const text = await res.text();
}

async function restartRouter() {
	console.info('disconnect...');
	await routerAction('disconnect');
	
	console.info('connect...');
	await routerAction('connect');
}

restartRouter().then(() => console.info('done'));


