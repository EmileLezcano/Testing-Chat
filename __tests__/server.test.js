const request = require('supertest');
const { app, server, io } = require('../src/server');
const socketIoClient = require('socket.io-client');

describe('Server Tests', () => {
    let socket;

    beforeAll((done) => {
        server.listen(3000, done);
    });

    afterAll((done) => {
        io.close();
        server.close(done);
    });

    beforeEach((done) => {
        socket = socketIoClient('http://localhost:3000');
        socket.on('connect', done);
    });

    afterEach((done) => {
        if (socket.connected) {
            socket.disconnect();
        }
        done();
    });

    test('GET / Debería regresar index.html', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.type).toBe('text/html');
    });

    test('El socket debería emitir un mensaje de chat.', (done) => {
        socket.on('chat message', (msg) => {
            expect(msg).toBe('Hello World');
            done();
        });
        socket.emit('chat message', 'Hello World');
    });

    //Implementación del metodo TDD - Fase1: Red
    test('El socket no debería emitir un mensaje de chat vacío', (done) => {
        socket.on('chat message', (msg) => {
            done(new Error('Empty message should not be emitted'));
        });
        socket.on('error message', (msg) => {
            expect(msg).toBe('No se pueden enviar mensajes vacíos');
            done();
        });
        socket.emit('chat message', '');
    });
    //---------------------------------------------------------------

    test('Socket debería registrar desconexión', (done) => {
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
    });
});

// Callback done: Es una función que indica a Jest que la prueba es asíncrona. 
// Se debe llamar cuando la prueba haya terminado, de lo contrario Jest puede pensar que la prueba sigue ejecutándose y fallará.

// console.log = jest.fn();: Sobrescribe console.log con un mock proporcionado por Jest. 
//Un mock es una función simulada que nos permite rastrear las llamadas y argumentos sin ejecutar el código real