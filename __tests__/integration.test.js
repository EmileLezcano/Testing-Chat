const request = require('supertest');
const { app, server, io } = require('../src/server');
const socketIoClient = require('socket.io-client');

describe('Server Tests', () => {
    let socket;
    let port;

    beforeAll((done) => {
        port = 0; // Asignar un puerto aleatorio
        server.listen(port, () => {
            port = server.address().port;
            done();
        });
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    afterAll((done) => {
        io.close();
        server.close(done);
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    beforeEach((done) => {
        socket = socketIoClient(`http://localhost:${port}`);
        socket.on('connect', done);
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    afterEach((done) => {
        if (socket && socket.connected) {
            socket.disconnect();
        }
        done();
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    test('GET / should return index.html', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.type).toBe('text/html');
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    test('Socket should emit chat message', (done) => {
        socket.on('chat message', (msg) => {
            expect(msg).toBe('Hello World');
            done();
        });
        socket.emit('chat message', 'Hello World');
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    test('Socket should not emit empty chat message', (done) => {
        socket.on('chat message', (msg) => {
            done(new Error('Empty message should not be emitted'));
        });
        socket.on('error message', (msg) => {
            expect(msg).toBe('No se pueden enviar mensajes vacíos');
            done();
        });
        socket.emit('chat message', '');
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    test('Socket should log disconnect', (done) => {
        const originalLog = console.log;
        console.log = jest.fn();

        socket.on('disconnect', () => {
            setTimeout(() => {
                expect(console.log).toHaveBeenCalledWith('Un usuario se ha desconectado');
                console.log = originalLog;
                done();
            }, 100); // Espera un breve período para asegurarse de que el evento se maneje
        });

        socket.disconnect();
    }, 10000); // Aumentar el tiempo de espera a 10 segundos
});
