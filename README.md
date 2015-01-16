#Description

This realtime chat does not include ajax request which most of the time make collapse of server band-width. Here I have server.js, the heart beat of a realtime chat which does not include ajax server request. It is a simple javascript code which resides in server. It communicates with the client through a uniform specific socket port for all clients who are connected in the same server. Soket port may vary from 1001 to 1003 or so on. 


To achieved realtime chat we need.

  - Knowledge of node.js
  - A socket server.
  - ```
  <script src="https://cdn.socket.io/socket.io-1.2.1.js"></script> for client side.
  ```
  
## Installtion process
  
