/**
    Puerto
*/
process.env.PORT = process.env.PORT || 3000;

/**
    Entorno
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
    Base de datos
*/
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    // if (false) {
    urlDB = 'mongodb://localhost:27017/cafeDB';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/**
Vencimiento del token
    60 sec
    60 min
    24 hrs
    30 dias
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
Seed de autenticación
*/
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';