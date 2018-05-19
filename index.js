// Sky ER110 Router - Internet Reconnect Script
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

async function request(url, opts = {}) {
	const res = await fetch(url, {
		headers: { Authorization },
		...opts,
	});
	return res.text();
}

async function preloadSession() {
	await request(UrlGetSessionKey);
}

async function routerGetSessionKey () {
	const html = await request(UrlGetSessionKey);
	const match = html.match(/sessionKey" value="(\d+)"/);
	return match ? match[1] : '';
}

async function routerAction(action) {
	const sessionKey = await routerGetSessionKey();

	await request(UrlAction, {
		method: 'POST',
		body: `interval=0&todo=${action}&sessionKey=${sessionKey}`,
	});
}

async function restartRouter() {
	console.info('disconnect...');
	await routerAction('disconnect');
	
	console.info('connect...');
	await routerAction('connect');
}

async function main () {
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

main().catch(error => console.error(error));
