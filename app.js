//App Application

//Dependency Declaration
var http = require('http');
var fs = require('fs');
var template = require('art-template');
var url = require('url');
var sd = require('silly-datetime');
const dateFormat = 'DD/MM/YYYY HH:mm:ss';

const comments = [
  {
    name: 'James',
    dateTime: sd.format(new Date(2019, 04, 16, 17, 22, 22), dateFormat),
    message: "It's so good."
  },
  {
    name: 'Jason',
    dateTime: sd.format(new Date(2019, 02, 23, 15, 01, 30), dateFormat),
    message: "It's good！"
  },
  {
    name: 'Lex',
    dateTime: sd.format(new Date(2019, 01, 05, 09, 10, 30), dateFormat),
    message: "It's very good."
  },
  {
    name: 'Coral',
    dateTime: sd.format(new Date(2018, 05, 26, 22, 00, 15), dateFormat),
    message: "It's perfect."
  }
];

http
  .createServer(function(req, res) {
    var parseUrlObj = url.parse(req.url, true);

    //* Not including the query parameters
    var pathName = parseUrlObj.pathname;

    //console.log(parseUrlObj);
    if (pathName === '/') {
      //* Index page
      fs.readFile('./views/index.html', function(err, data) {
        if (err) {
          return res.end('404 Not Found.');
        }
        var htmlStr = template.render(data.toString(), {
          comments: comments
        });
        res.end(htmlStr);
      });
    } else if (pathName === '/post') {
      //* Page for possting comments
      fs.readFile('./views/post.html', function(err, data) {
        if (err) {
          return res.end('404 Not Found.');
        }
        res.end(data);
      });
    } else if (pathName.indexOf('/public/') === 0) {
      //* get the public resources(css, js, img, lib)
      fs.readFile('.' + pathName, function(err, data) {
        if (err) {
          return res.end('404 Not Found.');
        }
        res.end(data);
      });
    } else if (pathName === '/comment') {
      //* Submit a comment
      //* Grab the details of a comment
      var comment = parseUrlObj.query;
      comment.dateTime = sd.format(new Date(), dateFormat);
      comments.unshift(comment);

      //* Redirect to homepage
      //* 1. set status code: 302 temporary redirection
      //*    statusCode
      //* 2. set Location in header
      //*    setHeader
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    } else {
      //* 404 processing
      fs.readFile('./views/404.html', function(err, data) {
        if (err) {
          return res.end('404 Not Found.');
        }
        res.end(data);
      });
    }
  })
  .listen(3000, function() {
    console.log('Runnig');
  });
