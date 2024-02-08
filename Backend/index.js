const app = require("express")();
const server = require('http').createServer(app);
const cors = require ('cors');

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["get", "post"]
    }
})

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is Running!!");
});

io.on("connection", (socket) => { 
    socket.emit ("me", socket.id);

    socket.on ("callUser", ({userToCall, signal, from, name}) => {
        console.log("name", name)
        io.to(userToCall).emit("callUser", {signal,from, name})
    })
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal, data.name);
    })
    socket.on ("disconnect", () => {
        socket.broadcast.emit("call ended")
    })
});

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
