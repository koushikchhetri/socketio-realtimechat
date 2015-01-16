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
    ###For Windows
      - c:\xampp\htdocs\nodeserver>node install socket.io
      - c:\xampp\htdocs\nodeserver>node install express
      - c:\xampp\htdocs\nodeserver>node install http
      - c:\xampp\htdocs\nodeserver>node install net
      - c:\xampp\htdocs\nodeserver>node install url
      - c:\xampp\htdocs\nodeserver>node install mysql //If you want to indulge mysql with realtime to save data of a session.


  
