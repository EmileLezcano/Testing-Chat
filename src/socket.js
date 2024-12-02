// Manejar eventos de Socket.io
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });
        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado');
        });
    });
};