const express = require('express');

const routeUsuario = require('./usuario');
const routeLogin = require('./login');

const app = express();

app.use(routeUsuario);
app.use(routeLogin);

module.exports = app;