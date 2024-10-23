import { Server } from "socket.io";


let io = null;

export const socketConnection = (server) => {
    io = new Server(server, {
        cors: "*"
    });
    return io;
}

export const getIo = () => {

    if (io == null) {
        console.log("socket not connection");
        return;
    }
    console.log("io");
    return io;
}