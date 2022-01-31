const remote = require('electron').remote,
	backdrop = document.querySelector('#loading-backdrop'),
	welcomeContainer = document.querySelector('.welcome'),
	passwordContainer = document.querySelector('.master-password'),
	errorDOM = document.querySelector('.noerror'),
	masterPasswordForm = document.querySelector('.masterpassword-form'),
	themeContainer = document.querySelector('.theme');

let win = remote.getCurrentWindow();

// for password strength component
const components = {
	strengthMeterOn: true
}

// create a master password input
let input = new RichInput({ hidden: 'true' }, 'Master Password', masterPasswordForm).input;


// Make minimise/maximise/restore/close buttons work when they are clicked
document.getElementById('close-button').addEventListener('click', (event) => {
	win.close();
	win.on('closed', () => {
		win = null;
	});
});
document.getElementById('min-button').addEventListener('click', (event) => {
	win.minimize();
});

function start() {
	backdrop.setAttribute('src', '../assets/img/icon-backdrop-green.png');
	collapse(welcomeContainer);
	expand(passwordContainer);
}

function collapse(container, nextContainer) {
	container.style = 'opacity: 0; width: 0; padding: 0; transition: 0.5s; z-index: -1';
}
function expand(container) {
	container.style = 'width: 100vw; padding: 10px; transition: 0.5s; opacity: 1; z-index: 2';
}

let hidden = true;
function toggleHide() {
	if (hidden) {
		input.setAttribute('type', 'text');
		hidden = false;
	} else {
		input.setAttribute('type', 'password');
		hidden = true;
	}
}

function back(type) {
	if (type == 'welcome') {
		collapse(passwordContainer);
		expand(welcomeContainer);
	} else if (type == 'password') {
		collapse(themeContainer);
		expand(passwordContainer);
	}
}

function setTheme() {
	let password = input.value.trim();
	let strength = getStrengthOf(password).strength;
	console.log(password, strength);
	input.select();
	if (password == '') {
		errorDOM.classList.add('error');
		errorDOM.textContent = 'Enter password.';
	} else if (strength < 4) {
		errorDOM.classList.add('error');
		errorDOM.textContent = 'Your password is too weak, master password must contain upper and lower case letters, numbers and symbols.';
		input.value = '';
	} else {
		errorDOM.classList.remove('error');
		config.masterPassword = password;
		collapse(passwordContainer);
		expand(themeContainer);
	}
}
function toggleTheme(theme) {
	config.theme = theme;
	loadTheme();
}
function exit() {
	config.firstTime = false;
	let key = crypto.randomBytes(32);
	let iv = crypto.randomBytes(16);
	param.keyO = key;
	param.ivO = iv;
	let stringifiedParam = JSON.stringify(param);
	fs.writeFileSync(PARAM_PATH, stringifiedParam, function (err) {
		if (err) throw err;
		console.log('Saved param!');
	});

	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(JSON.stringify(config));
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	let configEncrypted = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };


	fs.writeFileSync(CONFIG_PATH, JSON.stringify(configEncrypted), function (err) {
		if (err) throw err;
		console.log('Saved config !');
	});
	window.location.replace('../loginWindow/loginWindow.html');
}
