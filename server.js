/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3001, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3001/');
*/

var express = require('express'),
    beers = require('./routes/beers');
 
var app = express();
 
/*
app.get('/beers', function(req, res) {
    res.send([{name:'beer1'}, {name:'beer2'}]);
});
app.get('/beers/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});
*/

/*
app.get('/beers', beers.findAll);
app.get('/beers/:id', beers.findById);
*/


app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/beers', beers.findAll);
app.get('/beers/:id', beers.findById);
app.post('/beers', beers.addBeer);
app.put('/beers/:id', beers.updateBeer);
app.delete('/beers/:id', beers.deleteBeer);

app.listen(3001);
console.log('Listening on port 3001...');