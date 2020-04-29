// require('./config/config');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const {
    verificaToken,
    verficaAdminRole
} = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({
            estado: true
        }, 'nombre email estado role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({
                estado: true
            }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })


        });

});

app.post('/usuario',
    [verificaToken,
    verficaAdminRole], (req, res) => {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role,
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });


    });

app.put('/usuario/:id',
    verificaToken,
    verficaAdminRole, (req, res) => {
        let id = req.params.id;
        let updBody = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

        Usuario.findByIdAndUpdate(id, updBody, {
            new: true,
            runValidators: true
        }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });

    });

app.delete('/usuario/:id',
    verificaToken,
    verficaAdminRole, (req, res) => {

        let id = req.params.id;

        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //     if (err) {
        //         return res.status(400).json({
        //             ok: false,
        //             err
        //         });
        //     }

        //     if (!usuarioBorrado) {
        //         return res.status(400).json({
        //             ok: false,
        //             err: {
        //                 message: 'Usuario no encontrado'
        //             }
        //         });
        //     }

        //     res.json({
        //         ok: true,
        //         usuario: usuarioBorrado
        //     });
        // });

        let updBody = {
            estado: false
        }

        Usuario.findByIdAndUpdate(id, updBody, {
            new: true,
            runValidators: true
        }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
    });

module.exports = app;