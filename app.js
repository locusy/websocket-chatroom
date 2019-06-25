var express = require('express');
var app = express();

// socket.io公式
var http = require('http').Server(app);
var io = require('socket.io')(http);

// session公式：
var session = require("express-session");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));

// 允许跨域设置
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next();
// });

app.get('/', function(req, res, next) {
  res.render('index')
})

var userArr = []
app.get('/singin', function(req, res, next) {
  var username = req.query.username
  if (!username) {
    res.send('必须填写用户名') 
    return false
  }
  console.log(userArr)
  if (userArr.indexOf(username) != -1) {
    res.send('用户名已经存在')
    return false
  }
  userArr.push(username)
  req.session.username = username
  res.redirect('chat')
})

app.get('/chat', function(req, res, next) {
  if(!req.session.username){
		res.redirect("/");
		return;
	}
  res.render('chat', {
    "username": req.session.username
  })
})

io.on("connection",function(socket){
  // 步骤一：服务端绑定一个io
	socket.on("liaotian",function(msg){
    
		//步骤三：服务器端把接收到的msg原样广播 
		io.emit("liaotian",msg);
	});
});

http.listen(4000, function(err) {
  console.log('server is listening at port 4000...')
})






