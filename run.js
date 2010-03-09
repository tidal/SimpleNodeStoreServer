var server = require("./SimpleKeyValueStoreServer");
var store = server.create('esfex.com', 8002, './messages/');
store.start();