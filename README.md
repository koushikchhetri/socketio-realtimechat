#Description

This realtime chat does not include ajax request which most of the time make collapse of server band-width. Here I have server.js, the heart beat of a realtime chat which does not include ajax server request. It is a simple javascript code which resides in server. It communicates with the client through a uniform specific socket port for all clients who are connected in the same server. Soket port may vary from 1001 to 1003 or so on. 


  To achieved realtime chat we need.

  - Strong javascript knowledge
  - Knowledge of node.js
  - A socket server.
  - ```
  <script src="https://cdn.socket.io/socket.io-1.2.1.js"></script> for client side.
  ```
  
## Installtion process
  - Download node-v0.10.33-x64.msi from http://socket.io/download/
  - Install it in your drive under where the web server exist like c:/xampp/htdocs/nodeserver/
  - Open command line(Terminal) to nodeserver directory
  - Write the following commands
    - <code>```c:\xampp\htdocs\nodeserver>npm install socket.io```</code>
    - <code>```c:\xampp\htdocs\nodeserver>npm install express```</code>
    - <code>```c:\xampp\htdocs\nodeserver>npm install http```</code>
    - <code>```c:\xampp\htdocs\nodeserver>npm install net```</code>
    - <code>```c:\xampp\htdocs\nodeserver>npm install url```</code>
    - <code>```c:\xampp\htdocs\nodeserver>npm install mysql```</code>//If you want to indulge mysql with realtime to save data of a session.
  - Now create a client.html page for your clientside code
  ```
      <script src="https://cdn.socket.io/socket.io-1.2.1.js"></script>
      <script type="text/javascript">
        var socket = io('http://localhost:1003');//Through this line client is connected to server.
        //First time client sending request to the server when user joins to the realtime chat
        //socket.emit takes usualy two paramter but one more paramenter can be passed which is callback function
        //socket.emit('join',{usersid:1,username:"koushik",avatar:"profile.png"},callfunctino(){});
        socket.emit('join',{usersid:1,username:"koushik",avatar:"profile.png"});
        
        //Now if you want to get the request from the server to the client page then you have to do the following things.
        //Say server sending broadcast in the "onlineusers" method then we have to do the following to get the data
        socket.on("onlineusers",function(data){
          //data which comes from server
        });
      </script>
  ```

  
