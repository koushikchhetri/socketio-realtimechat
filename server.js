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
var arr_peer2peermessage={};

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
  
  /**
   * When a user sends chat message to a user then the following method will execute
  */
  socket.on("send",function(data,callback){
    if(typeof arr_peer2peermessage[data.senderid]=="undefined")
      arr_peer2peermessage[data.senderid]={}
    if(typeof arr_peer2peermessage[data.senderid][data.receiverid]=="undefined")
      arr_peer2peermessage[data.senderid][data.receiverid]={}  
    callback(true);//returns true means message has been send to the user
  });
  
  /**
   * When a user leave from the page or close the page or close the browser the the following method automatically fired
  */
  socket.on("disconnect",function(){
    /**
     * After disconnection the client delete the json index of a particular user or client and broadcast again to all.
     * So that everyone can get the latest online users who are availabe to chat
    */
    
    /**
     * Now if you want to store the session messages per user to the database then following code will be uncommented
     * Lets say table name "peertopeermessages"
    */
    
    delete arr_onlineusers[socket.usersid];
    broadcastonlineusers();
  });
});
