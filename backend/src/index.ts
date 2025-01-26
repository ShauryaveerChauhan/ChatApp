import { WebSocketServer, WebSocket } from "ws";

// Create a WebSocket server instance listening on port 8080
const wss = new WebSocketServer({port : 8080});


interface User{
    socket: WebSocket;
    room: string
}


let allSockets : User[] = [];

// Listen for new WebSocket connections
wss.on("connection", (socket) => {
    // Handle incoming messages from clients
    socket.on("message", (message) => {
     
        // @ts-ignore 
        const parsedMessage = JSON.parse(message);

       
        if(parsedMessage.type === "join"){
           
            allSockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })
        }

        
        if (parsedMessage.type  === "chat"){
           
            let currentUserRoom = null;
            for(let i =0; i<allSockets.length; i++){
                if(allSockets[i].socket === socket){
                    currentUserRoom = allSockets[i].room
                }
            }

           
            for(let i =0; i<allSockets.length; i++){
                if(allSockets[i].room === currentUserRoom){
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
    })
})