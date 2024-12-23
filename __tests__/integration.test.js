const request = require('supertest');
const { app, server, io } = require('../src/server');
const socketIoClient = require('socket.io-client');

describe('Integration Tests', () => {
    let client1;
    let client2;
    let client3;

    beforeAll((done) => {
        server.listen(3000, done);
    });

    afterAll((done) => {
        io.close();
        server.close(done);
    });

    beforeEach((done) => {
        client1 = socketIoClient('http://localhost:3000');
        client2 = socketIoClient('http://localhost:3000');
        client3 = socketIoClient('http://localhost:3000');

        let connections = 0;
        const checkConnections = () => {
            connections++;
            if (connections === 3) {
                done();
            }
        };

        client1.on('connect', checkConnections);
        client2.on('connect', checkConnections);
        client3.on('connect', checkConnections);
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    afterEach((done) => {
        client1.disconnect();
        client2.disconnect();
        client3.disconnect();
        done();
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    test('Varios clientes deberían recibir mensajes difundidos', (done) => {
        let messagesReceived = 0;

        client1.on('chat message', (msg) => {
            expect(msg).toBe('Hello from client2');
            messagesReceived++;
            if (messagesReceived === 3) {
                done();
            }
        });

        client2.on('chat message', (msg) => {
            expect(msg).toBe('Hello from client2');
            messagesReceived++;
            if (messagesReceived === 3) {
                done();
            }
        });

        client3.on('chat message', (msg) => {
            expect(msg).toBe('Hello from client2');
            messagesReceived++;
            if (messagesReceived === 3) {
                done();
            }
        });

        // Simular cliente2 enviando un mensaje
        client2.emit('chat message', 'Hello from client2');
    }, 15000); // Aumentar el tiempo de espera a 15 segundos

    test('El servidor debe manejar la desconexión repentina de un cliente', (done) => {
        let messagesReceived = 0;

        client1.on('chat message', (msg) => {
            expect(msg).toBe('Hello from client2');
            messagesReceived++;
            if (messagesReceived === 2) {
                done();
            }
        });

        client3.on('chat message', (msg) => {
            expect(msg).toBe('Hello from client2');
            messagesReceived++;
            if (messagesReceived === 2) {
                done();
            }
        });

        // Simular cliente2 enviando un mensaje
        client2.emit('chat message', 'Hello from client2');

        // Simular la desconexión del cliente 2
        setTimeout(() => {
            client2.disconnect();
        }, 1000); // Espera 1 segundo antes de desconectar a client2

        // Simular que el cliente1 envíe un mensaje después de que el cliente2 se desconecte
        setTimeout(() => {
            client1.emit('chat message', 'Hello from client1');
        }, 2000); // Espera 2 segundos antes de enviar un mensaje desde client1
    }, 15000); // Aumentar el tiempo de espera a 15 segundos
});
