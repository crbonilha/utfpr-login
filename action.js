(function() {
	'use strict';
	
	var usernameKey = 'utfpr-login-username';
	var passwordKey = 'utfpr-login-password';

	function fillForm(username, password) {
		var usernameInput = document.querySelector('input[name="username"]');
		var passwordInput = document.querySelector('input[name="password"]');
		var submitButton = document.querySelector('input[name="Submit"]');

		if(usernameInput && passwordInput && submitButton) {
			usernameInput.value = username;
			passwordInput.value = password;
			submitButton.click();
		}
	}

	function addWelcomeSign() {
		var title = document.createElement('b');
		title.innerHTML = 'UTFPR Login';

		var font = document.createElement('font');
		font.setAttribute('size', '3');
		font.setAttribute('color', '#000000');
		font.setAttribute('face', 'arial');
		font.appendChild(title);
		font.appendChild(document.createElement('br'));
		font.appendChild(document.createTextNode('Olá. Você está usando a extensão UTFPR Login :)'));
		font.appendChild(document.createElement('p'));

		var td = document.createElement('td');
		td.setAttribute('colspan', '2');
		td.appendChild(font);

		var tr = document.createElement('tr');
		tr.appendChild(td);

		var tbody = document.querySelector('tbody');
		tbody.appendChild(tr);
	}

	function fixFormLayout() {
		var userDiv = document.createElement('div');
		userDiv.setAttribute('style', 'display: inline-block; width: 70px; text-align: left; margin-bottom: 8px;');
		userDiv.innerHTML = 'Usuário:';
		var userTd = document.querySelector('tbody>tr:nth-child(8)>td');
		userTd.replaceChild(
			userDiv,
			userTd.childNodes[0]
		);

		var passwordDiv = document.createElement('div');
		passwordDiv.setAttribute('style', 'display: inline-block; width: 70px; text-align: left; margin-bottom: 8px;');
		passwordDiv.innerHTML = 'Senha:';
		var passwordTd = document.querySelector('tbody>tr:nth-child(9)>td');
		passwordTd.replaceChild(
			passwordDiv,
			passwordTd.childNodes[0]
		);

		var rememberMeTr = document.createElement('tr');
		rememberMeTr.setAttribute('align', 'center');
		rememberMeTr.innerHTML = '<td colspan="2">' +
			'<label>' +
			'<input type="checkbox" name="remember" style="margin-bottom: 8px;">' +
			'Lembrar minha senha</label>' +
			'</td>';
		document.querySelector('tbody')
			.insertBefore(rememberMeTr, document.querySelector('tbody>tr:nth-child(10)'));
	}

	function addSubmitEventListener() {
		var submitButton = document.querySelector('input[name="Submit"]');
		submitButton.addEventListener('click', function(evento) {
			var rememberMeInput = document.querySelector('input[name="remember"]');
			var usernameInput = document.querySelector('input[name="username"]');
			var passwordInput = document.querySelector('input[name="password"]');

			if(!rememberMeInput.checked || !usernameInput.value || !passwordInput.value) {
				return;
			}

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
	if(document.title == 'Bem Vindo a Rede Wireless da UTFPR') {
		chrome.storage.sync.get([usernameKey, passwordKey], function(items) {
			// wrong username/password.
			if(getParameterByName('statusCode') !== null) {
				fixFormLayout();
				addWelcomeSign();
				addSubmitEventListener();
				
				return;
			}

			// username and/or password not saved.
			if(!items[usernameKey] || !items[passwordKey]) {
				fixFormLayout();
				addWelcomeSign();
				addSubmitEventListener();

				return;
			} 

			// fill the form automatically and login.
			fillForm(items[usernameKey], items[passwordKey]);
		});
	}

})();
