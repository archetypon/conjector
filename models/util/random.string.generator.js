function randomString(length) {
	var charList = 
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	var result = '';
	for (var i = length; i > 0; --i) result += charList[Math.floor(Math.random() * charList.length)];
	return result;
}

module.exports = {
	randomString
}