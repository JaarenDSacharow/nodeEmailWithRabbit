var fs = require('fs');
var ejs = require('ejs');
var compiled = ejs.compile(fs.readFileSync(__dirname + '/index.ejs', 'utf8'));

var obj =  { title : 'Notifcation', name : 'Jaaren' }

var html = compiled(obj);
console.log(html);
