import db from "../databases/connections.js";

function handleSocket(socket) {

    socket.on("client-admin-order-status", (data) => {
        socket.broadcast.emit("server-sent-round-message", data);
    });

    socket.on("client-admin-message", async (data) => {
        data.date = new Date();
        await db.collection("messages").insertOne(data);
        console.log(data);
        socket.broadcast.emit("server-admin-message", data);
    });
}

export default handleSocket;