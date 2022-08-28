const Server = require('socket.io');
const io =Server();

var Socket = {
    emit: function (event, data) {
        console.log(event, data);
        io.sockets.emit(event, data);
    }
};

io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("join",(data)=>{
        console.log(data.email);
        socket.join(data.email);
    });

    socket.on("msgSent",(data)=>{
        // console.log(data," :receiver email");
        io.sockets.in(data.receiverEmail).emit('msgReceived', {senderEmail: data.receiverEmail});
    })

});

exports.Socket = Socket;
exports.io = io;