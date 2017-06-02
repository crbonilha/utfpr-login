var usernameKey = 'utfiller-username';
var passwordKey = 'utfiller-password';

function resetConfig() {
	chrome.storage.sync.clear(function(p) {
		console.log(p);
	});
}

// main
chrome.storage.sync.get([usernameKey, passwordKey], function(items) {
	if(items[usernameKey] && items[passwordKey]) {
		var resetButton = document.querySelector('button[name="reset"]');
		resetButton.setAttribute('style', '');
		resetButton.addEventListener('click', resetConfig);
	}
});
