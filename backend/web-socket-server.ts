// const webSocketServer = require('websocket').server;
import { WebSocketServer } from "ws";
import fetch from 'node-fetch';
import { WebSocketReceivedAnnouncement } from "./web-socket-received-announcement";
import { WebSocketSendAnnouncement } from "./web-socket-send-announcement";

const port = 1234;
const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const receivedMessage: WebSocketReceivedAnnouncement = JSON.parse(data.toString());

    console.log("Backend received Message from Client");

    fetch('http://localhost:8080/api/announcement/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + receivedMessage.token.toString(),
      },
      body: JSON.stringify(receivedMessage)
    })
      .then(resp => {
        console.log(resp.status);
        if (resp.status === 200) {
          console.log(`Wrote Announcement to Database`);
        }
        else {
          throw Error("Can not create Announcement with given input.")
        }
      })
      .then(() => {
        fetch('http://localhost:8080/api/announcement/all'
        )
          .then(response => response.text())
          .then(text => {
            const receivedMessage: WebSocketSendAnnouncement = JSON.parse(text);
            wss.clients.forEach((client) => {
              client.send(JSON.stringify(receivedMessage));
            }
            );
          });
      }).catch(e => console.log(e));
  });

  ws.send("Hello, web-socket-server connection started.");
});

console.log("Web Socket started.");

export default wss;
