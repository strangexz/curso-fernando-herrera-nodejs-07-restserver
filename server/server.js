require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('colors');
const route = require('./routes/usuario');

const app = express();
const port = process.env.PORT;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use(route);

mongoose.connect(
    // 'mongodb+srv://username:password@cluster0-erizp.mongodb.net/database?retryWrites=true&w=majority', {
        process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, (err, res) => {
        if (err) {
            throw err;
        }

        console.log('Base de datos ONLINE'.green);


    }
);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))