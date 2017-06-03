(function() {
	'use strict';

	var usernameKey = 'utfpr-login-username';
	var passwordKey = 'utfpr-login-password';

	// update config.
	function updateConfig() {
		inputUser.value = spanUser.innerHTML;
		inputPassword.value = '';

		showItem(divShow, false);
		showItem(divConfig, true);
		showItem(buttonCancel, true);
	}

	// save config.
	function saveConfig() {
		var username = document.querySelector('input[name="user"]').value;
		var password = document.querySelector('input[name="password"]').value;

		if(!username || !password) {
			return;
		}

		var obj = {};
		obj[usernameKey] = username;
		obj[passwordKey] = password;

		// save and update screen.
		chrome.storage.sync.set(obj, function() {
			load();
		});
	}

	// cancel updating config.
	function cancelUpdate() {
		showItem(divShow, true);
		showItem(divConfig, false);
		showItem(buttonCancel, false);
	}

	// clean user data.
	function clearData() {
		chrome.storage.sync.clear(function() {
			inputUser.value = '';
			load();
		});
	}

	// show/hides an element.
	function showItem(element, show) {
		element.setAttribute('style', show ? '' : 'display: none;');
	}

	// load data and determines app current state.
	function load() {
		showItem(divLoading, true);
		showItem(divShow, false);
		showItem(divConfig, false);
		showItem(buttonCancel, false);

		chrome.storage.sync.get([usernameKey, passwordKey], function(items) {
			showItem(divLoading, false);

			if(items[usernameKey] && items[passwordKey]) {
				showItem(divShow, true);

				spanUser.innerHTML = items[usernameKey];
			} else {
				showItem(divConfig, true);
			}
		});
	}

	// get references to some html elements.
	var divLoading    = document.querySelector('div[id="loading"]');
	var divConfig     = document.querySelector('div[id="config"]');
	var divShow       = document.querySelector('div[id="show"]');
	var buttonCancel  = document.querySelector('button[name="cancel"]');
	var inputUser     = document.querySelector('input[name="user"]');
	var inputPassword = document.querySelector('input[name="password"]');
	var spanUser      = document.querySelector('span[id="view-user"]');

	// set event listeners on buttons.
	document.querySelector('button[name="update"]').addEventListener('click', updateConfig);
	document.querySelector('button[name="save"]').addEventListener('click', saveConfig);
	document.querySelector('button[name="forget"]').addEventListener('click', clearData);
	document.querySelector('button[name="cancel"]').addEventListener('click', cancelUpdate);

	// main.
	load();

})();
