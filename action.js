(function() {
	'use strict';
	
	var usernameKey = 'utfpr-login-username';
	var passwordKey = 'utfpr-login-password';

	var utfillerClick = false;
	function fillForm(username, password) {
		var usernameInput = document.querySelector('input[name="username"]');
		var passwordInput = document.querySelector('input[name="password"]');
		var submitButton = document.querySelector('input[name="Submit"]');

		if(usernameInput && passwordInput && submitButton) {
			usernameInput.value = username;
			passwordInput.value = password;
			utfillerClick = true;
			submitButton.click();
		}
	}

	function addWarningSign() {
		var title = document.createElement('b');
		title.innerHTML = 'UTFiller';

		var text = document.createTextNode('Olá. Abra a extensão do UTFiller para configurar seu login e senha, <br>'
			+ 'assim o login será feito automaticamente.');

		var font = document.createElement('font');
		font.setAttribute('size', '3');
		font.setAttribute('color', '#000000');
		font.setAttribute('face', 'arial');
		font.appendChild(title);
		font.appendChild(document.createElement('br'));
		font.appendChild(document.createTextNode('Olá. Abra a extensão do UTFiller para configurar seu login e senha,'));
		font.appendChild(document.createElement('br'));
		font.appendChild(document.createTextNode('assim o login será feito automaticamente.'));
		font.appendChild(document.createElement('p'));

		var td = document.createElement('td');
		td.setAttribute('colspan', '2');
		td.appendChild(font);

		var tr = document.createElement('tr');
		tr.appendChild(td);

		var tbody = document.querySelector('tbody');
		tbody.appendChild(tr);
	}

	function addSubmitEventListener() {
		var submitButton = document.querySelector('input[name="Submit"]');
		submitButton.addEventListener('click', function(evento) {
			if(utfillerClick) {
				return;
			}

			var usernameInput = document.querySelector('input[name="username"]');
			var passwordInput = document.querySelector('input[name="password"]');

			var obj = {};
			obj[usernameKey] = usernameInput.value;
			obj[passwordKey] = passwordInput.value;

			chrome.storage.sync.set(obj);
		});
	}

	function getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	// main
	chrome.storage.sync.get([usernameKey, passwordKey], function(items) {
		// wrong username/password.
		if(getParameterByName('statusCode') !== null) {
			addWarningSign();
			addSubmitEventListener();
			
			return;
		}

		// username and/or password not saved.
		if(!items[usernameKey] || !items[passwordKey]) {
			addWarningSign();
			addSubmitEventListener();

			return;
		} 

		// fill the form automatically and login.
		fillForm(items[usernameKey], items[passwordKey]);
	});

})();
