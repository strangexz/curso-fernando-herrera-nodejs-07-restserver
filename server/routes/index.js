const express = require('express');

const routeUsuario = require('./usuario');
const routeLogin = require('./login');
const routeCategoria = require('./categoria');
const routeProducto = require('./producto');
const routeUploads = require('./upload');
const routeImagenes = require('./imagenes');

const app = express();

app.use(routeUploads);
app.use(routeImagenes);
app.use(routeProducto);
app.use(routeCategoria);
app.use(routeUsuario);
app.use(routeLogin);

module.exports = app;