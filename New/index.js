var express = require("express");
var app = express();
var server = require("http").createServer(app);
const io = require('socket.io')(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

console.log("Server Running");
var arrayUser = [];
var check = true;

io.sockets.on('connection', function(socket){
	console.log("Device connected");

	socket.on('client_register_user', function(data){
		console.log("Server nhan: " + data);
		if(arrayUser.indexOf(data) == -1){
			// không tồn tại user -> đc phép đk
			arrayUser.push(data);
			check = false;
			console.log("Dang ky thanh cong user: " + data);
			// gán tên user cho socket
			socket.un = data;
			// gửi danh sách user về các máy
			io.sockets.emit('server_send_user', { danhsach : arrayUser})
		}else{
			console.log("Da ton tai user: " + data);
			check = true;
		}

		// gửi kết quả đăng ký user -> 1user
		socket.emit('server_send_result',{ketqua: check});
	});

	socket.on('client_send_user', function(chat){
		console.log(socket.un + ": " + chat);
		io.sockets.emit('server_send_chat', { chatContent : socket.un + ": " + chat })
	});
});