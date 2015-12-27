'use strict'
//Require modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//Array de tipos MIME
var mimeTypes ={
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js" : "text/javascript",
  "css": "text/css"
};

//Creación del servidor
http.createServer(function(req, res){
  var uri = url.parse(req.url).pathname;                    //creamos una variable uri
  var fileName = path.join(process.cwd(), unescape(uri));   //Creamos el filename, con procces.cwd()
  console.log('Loading ' + uri);                            //se devuelve el directorio actual del proyecto(current working directory)
  var stats;
  try {
      stats = fs.lstatSync(fileName);
  } catch (e) {
      res.writeHead(404, {'Content-type': 'text/plain'});
      res.write('404 Not found\n');
      res.end();
      return;
  }

  //Comprobar si hay file/directory
  if (stats.isFile()) {                                                       //Si stats es un archivo
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]; //obtenemos el tipo mime
    res.writeHead(200, {'Content-type': mimeType});                           // enviamos el response

    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  }else if(stats.isDirectory()){
    res.writeHead(302,{
      'Location': 'index.html'
    });
    res.end();
  }else{
    res.writeHead(500,{'Content-type': 'text/plain'});
    res.write('500 Internal Error\n');
    res.end();
  }
}).listen(3000);
