module.exports = {
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:8000'
}

function getDbUrl() {
	let url = '';
	if (process.env.NODE_ENV === 'production') {
		url = process.env.DATABASE_URL;
	} else if (process.env.NODE_ENV === 'test') {
		url = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-learning-log';
	} 
	return url || 'mongodb://localhost/learning-log';
}

exports.PORT = process.env.PORT || 8080;

exports.DB_URL = getDbUrl();