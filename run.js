var server = require("./SimpleKeyValueStoreServer");
var store = server.create('localhost', 9999, './messages/');
store.start();