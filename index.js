require('dotenv').config({ path: __dirname + '/.env' });
const fs = require('fs');
const axiosRaw = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const axios = axiosRaw.create({ timeout: 4000 });

const HOST = process.env.HOST

let count = 0;

async function runInner() {
	const subdomain = fs.readFileSync(__dirname + '/subdomain', {encoding: 'utf-8'}).trim();
	try {
		await axios.get('http://' + subdomain + '.' + HOST + process.env.HEALTHCHECK);
	} catch (err) {
		console.error(err);
		try {
			await axios.get('http://' + subdomain + '.' + HOST + process.env.HEALTHCHECK);
		} catch (err) {
			console.error(err);
			try {
				await axios.get('http://' + HOST + '/api/forceclose/' + subdomain);
			} catch (err2) {
				console.error(err2);
			}
			await wait(1000);
			count++;
			const { stdout, stderr } = count >= 2 ? await exec(__dirname + '/config.sh ' + subdomain) : await exec('pm2 restart all');
			console.log('stdout:', stdout);
			console.error('stderr:', stderr);
		}

	}
}

async function run() {
	let startDate = Date.now();
	
	for (let i = 0; i < 5; i++) {
		try {
			await runInner();
		} catch (err) {
			console.error(err);	
		}
		
		await wait(10000);
		
		if (Date.now() > startDate + 50000) break;
	}
}

run().then(() => process.exit(0)).catch(err => {
	console.error(err);
	process.exit(1);
});
