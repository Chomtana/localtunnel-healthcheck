require('dotenv').config();
const fs = require('fs');
const axiosRaw = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const axios = axiosRaw.create({ timeout: 2000 });

const HOST = process.env.HOST

async function runInner() {
	const subdomain = fs.readFileSync(__dirname + '/subdomain', {encoding: 'utf-8'}).trim();
	try {
		await axios.get('http://' + subdomain + '.' + HOST + process.env.HEALTHCHECK);
	} catch (err) {
		console.error(err);
		try {
			await axios.get('http://' + HOST + '/api/forceclose/' + subdomain);
		} catch (err2) {
			console.error(err2);
		}
		const { stdout, stderr } = await exec('pm2 restart nodered-localtunnel');
		console.log('stdout:', stdout);
		console.error('stderr:', stderr);
	}
}

async function run() {
	for (let i = 0; i < 5; i++) {
		runInner();
		await wait(10000);
	}
}

run().then(() => process.exit(0)).catch(err => {
	console.error(err);
	process.exit(1);
});