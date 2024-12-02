// Iniciar el servidor y escuchar en un puerto especifico
const { server } = require('./server');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});