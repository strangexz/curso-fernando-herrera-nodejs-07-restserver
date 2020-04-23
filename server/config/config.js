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

// if (process.env.NODE_ENV === 'dev') {
if (false) {
    urlDB = 'mongodb://localhost:27017/cafeDB';
} else {
    urlDB = 'mongodb+srv://strangexz:UrFaPuxxVpOQ6kbi@cluster0-mpdyn.mongodb.net/cafeDB';
}

process.env.URLDB = urlDB;