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
//             } else {
//                 console.log('Enviando mensaje de error: No se pueden enviar mensajes vacíos');
//                 socket.emit('error message', 'No se pueden enviar mensajes vacíos');
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
            } else {
                // Enviar un mensaje de error al cliente
                console.log('Enviando mensaje de error: No se pueden enviar mensajes vacíos');
                socket.emit('error message', 'No se pueden enviar mensajes vacíos');
            }
        });

        // Manejar desconexión del usuario
        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado');
        });
    });
};