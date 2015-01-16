/*!
 * server.js v1.0
 * http://koushikchhetri.com/
 *
 * Author Koushik Chhetri
 * Email: care.koushik.chhetri@gmail.com
 * Description: This page resides in the socket server.
 *** You to write "node server.js" to start socket server for realtimechat.
 *
 * Copyright 20014
 * Released under the MIT license
 * http://koushikchhetri.com/licence
 *
 * Date: 2015-01-11T16:27Z
 */

//

var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io")(server);
var PORT=1007;//Port which you want to block for realtime chat

server.listen(PORT,function(){
  console.log("Server listening %d",PORT);
});

/**
 * Create mysql connection if you need
*/
var mysql=require("mysql");
var db=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'chat',
  port:3306//default port of mysql server
});

var arr_sockets={};
var arr_onlineusers={};

/**
   * When client connected to the server then io.sockets.on("connection",function()); fires
  */
io.sockets.on("connection",function(socket){
  function broadcastonlineusers(){
    for(var index in arr_onlineusers){
      io.to(arr_sockets[index]).emit("onlinestatus",arr_onlineusers);
    }
  }
  
  /**
   * When client sends join status to the server on realtimechat from socket.emit("join",{..:..,..:..},function(){});
   * then the following code executes
  */
  socket.on("join",function(data,callback){
    //Data is a json data comes from client
    //callback is a function if client uses third argument as a function
    socket.usersid=data.usersid;
    arr_sockets[socket.usersid]=socket.id;//Store one socket per client
    arr_onlineusers[socket.usersid]=data;
    
    broadcastonlineusers();
  });
});
