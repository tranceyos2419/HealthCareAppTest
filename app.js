var express = require('express');
var app = express();

app.set("view engine", "ejs");


app.get('/', function (req, res) {
  res.render("test")
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
