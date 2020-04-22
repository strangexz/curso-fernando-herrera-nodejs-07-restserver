require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.send('getUsuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    res.json({
        persona: body
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.send({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.send('deleteUsuario');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))