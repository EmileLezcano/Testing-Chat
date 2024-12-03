// Configuracion del servidor Express y Socket.io
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const socketEvents = require('./socket');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar rutas
routes(app);

// Configurar eventos de Socket.io
socketEvents(io);

module.exports = { app, server, io };
