
var SimpleNodeStoreServer = function(host, port, storeDir){

	var sys = require("sys"),
	   http = require("http"),
	   fs = require("fs"),
	   url = require("url"),
	   storeDir = storeDir || './';	
		
	var getFileName = function(id){
		return storeDir+id;
	}
	
	var sendResponse = function(response, content){
		content = content || '';
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(content);
		response.close();		
	}
	
	var serverCallback = function (request, response) {
		var q =  url.parse(request.url, true);
		sys.puts("query: " + sys.inspect(q));
		if(q.query && q.query.method && q.query.id){
			var file = getFileName(q.query.id);
			
			if(q.query.method == 'set' && q.query.value){
				fs.writeFileSync(file, q.query.value);
				fs.writeFile(file, q.query.value, "utf8", function(err){
					  if (err) sendResponse(response, 'ERROR');
					  sendResponse(response, 'OK');				
				});			
			}else if(q.query.method == 'get'){
				fs.readFile(file, function (err, data) {
					  if (err) sendResponse(response);
					  sendResponse(response, data);
				});
			}
		}else{
			sendResponse(response);
		}	
	};	
	
	
	var server = http.createServer(serverCallback);
	
	this.start = function(){
		// make sure we kill a process allready listening on given port
		sys.exec("sudo fuser -vk "+port+"/tcp", function(err, stdout, stderr){
			if (err) sys.puts(err);
			server.listen(port, host);
			sys.puts("Server running at http://"+host+":"+port);
		});
				
	}
	
	this.stop = function(){
		server.close();
	}
}

exports.create = function (host, port, storeDir) {
  return new SimpleNodeStoreServer(host, port, storeDir);
};

