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
  socket.on("newmessage_sent",function(data,callback){
    /**
     * Sender to received details in arr_peer2peermessage
    */
    if(typeof arr_peer2peermessage[data.senderid]=="undefined")
      arr_peer2peermessage[data.senderid]={}
    if(typeof arr_peer2peermessage[data.senderid][data.receiverid]=="undefined")
      arr_peer2peermessage[data.senderid][data.receiverid]={}
    if(typeof arr_peer2peermessage[data.senderid][data.receiverid].message=="undefined")
      arr_peer2peermessage[data.senderid][data.receiverid].message={}
      
    var messagelength=(arr_peer2peermessage[data.senderid][data.receiverid].message).length;
    arr_peer2peermessage[data.senderid][data.receiverid].message[messagelength]={};
    /**
     * Message details adding to the json
    */
    arr_peer2peermessage[data.senderid][data.receiverid].message[messagelength].id=data.message_id;
    arr_peer2peermessage[data.senderid][data.receiverid].message[messagelength].msg=data.message_string;
    arr_peer2peermessage[data.senderid][data.receiverid].message[messagelength].senttime=data.sent_time;
    arr_peer2peermessage[data.senderid][data.receiverid].message[messagelength].self=0;//0=self 1=friend
    
    
    /**
     * Received from received details in arr_peer2peermessage
     * As both will see the message on their chat panel
    */
    if(typeof arr_peer2peermessage[data.receiverid]=="undefined")
      arr_peer2peermessage[data.receiverid]={}
    if(typeof arr_peer2peermessage[data.receiverid][data.senderid]=="undefined")
      arr_peer2peermessage[data.receiverid][data.senderid]={}
    if(typeof arr_peer2peermessage[data.receiverid][data.senderid].message=="undefined")
      arr_peer2peermessage[data.receiverid][data.senderid].message={}
      
    var messagelength=(arr_peer2peermessage[data.receiverid][data.senderid].message).length;
    arr_peer2peermessage[data.receiverid][data.senderid].message[messagelength]={};
    /**
     * Message details adding to the json
    */
    arr_peer2peermessage[data.receiverid][data.senderid].message[messagelength].id=data.message_id;
    arr_peer2peermessage[data.receiverid][data.senderid].message[messagelength].msg=data.message_string;
    arr_peer2peermessage[data.receiverid][data.senderid].message[messagelength].senttime=data.sent_time;
    arr_peer2peermessage[data.receiverid][data.senderid].message[messagelength].self=1;//0=self 1=friend
    
    /**
     * Now broadcast the message from sender to the client to whom it may concern
    */
    if(typeof arr_sockets[data.receiverid]!="undefined"){
      io.to(arr_sockets[data.receiverid]).emit("newmessage_received",arr_peer2peermessage[data.receiverid][data.senderid].message[messagelength]);
    }
    }
    
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
     * Now if you want to store the session messages per user to the database when a client disconnected then following code will be uncommented
     * Lets say table name "peertopeermessages" has column id,senderid,receiverid,message
    */
    if(typeof arr_peer2peermessage[socket.usersid]!="undefined"){
      for(var index_1 in arr_peer2peermessage[socket.usersid]){
        /**
         * First insert or update for user who is disconnecting the client
        */
        (function(receiver_id,arr_message_container){
          var q='SELECT COUNT(*) AS cnt FROM peertopeermessages WHERE senderid="'+socket.usersid+'" AND receiverid="'+receiver_id+'"';
          var query_select=db.query(q).on("result",function(result){
            if(result.cnt==0){
              var query_insert=db.query('INSERT INTO peertopeermessages SET ?',{senderid:socket.usersid,receiverid:receiver_id,message:JSON.stringify(arr_message_container)},function(err,result){});
            }else{
              var q='UPDATE peertopeermessages SET ?',
              var query_update=db.query('UDPATE peertopeermessages SET ? WHERE senderid="'+socket.usersid+'" AND receiverid="'+receiver_id+'"',{message:JSON.stringify(arr_message_container)},function(err,result){});
              console.log(query_update.sql);
            }
          });
          console.log(query_select.sql);
        })(index_1,arr_peer2peermessage[socket.usersid][index_1]);
        
        /**
         * Receivers data who are connected with disconnecting client
        */
        (function(receiver_id,arr_message_container){
          var q='SELECT COUNT(*) AS cnt FROM peertopeermessages WHERE receiverid="'+socket.usersid+'" AND senderid="'+receiver_id+'"';
          var query_select=db.query(q).on("result",function(result){
            if(result.cnt==0){
              var query_insert=db.query('INSERT INTO peertopeermessages SET ?',{receiverid:socket.usersid,senderid:receiver_id,message:JSON.stringify(arr_message_container)},function(err,result){});
            }else{
              var q='UPDATE peertopeermessages SET ?',
              var query_update=db.query('UDPATE peertopeermessages SET ? WHERE receiverid="'+socket.usersid+'" AND senderid="'+receiver_id+'"',{message:JSON.stringify(arr_message_container)},function(err,result){});
              console.log(query_update.sql);
            }
          });
          console.log(query_select.sql);
        })(index_1,arr_peer2peermessage[socket.usersid][index_1]);
      }
    }
    
    delete arr_onlineusers[socket.usersid];
    broadcastonlineusers();
  });
});
