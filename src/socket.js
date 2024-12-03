// Manejar eventos de Socket.io
// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log('Un usuario se ha conectado');
//         socket.on('chat message', (msg) => {
//             io.emit('chat message', msg);
//         });
//         socket.on('disconnect', () => {
//             console.log('Un usuario se ha desconectado');
//         });
//     });
// };

// Fase2: Green / Añadir validación de mensaje
// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log('Un usuario se ha conectado');
//         socket.on('chat message', (msg) => {
//             if (msg.trim()) {
//                 io.emit('chat message', msg);
//             }
//         });
//         socket.on('disconnect', () => {
//             console.log('Un usuario se ha desconectado');
//         });
//     });
// };

//Fase3: Refactor / Añadimos algunos comentarios para mejorar la legibilidad
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');

        // Manejar mensajes de chat
        socket.on('chat message', (msg) => {
            // Validar que el mensaje no esté vacío
            if (msg.trim()) {
                io.emit('chat message', msg);
            } 
        }); 
        // Manejar desconexión del usuario
        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado');
        });
    });
};
