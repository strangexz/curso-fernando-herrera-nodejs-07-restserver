const express = require('express');
const mongoose = require('mongoose');
const {
    verificaToken
} = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');

/**
 * Buscar productos
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        Producto.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                productos,
                cuantos: conteo
            });
        })


    })
});

/**
 * Obtener productos
 */
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            })


        });
});

/**
 * Obtener producto por ID
 */
app.get('/producto/:id', verificaToken, (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID es requerído'
            }
        });
    }

    let id = req.params.id;

    if (mongoose.Types.ObjectId.isValid(id)) {
        Producto.findById({ _id: mongoose.Types.ObjectId(id) })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    if (!productoDB) {
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'Producto no encontrado'
                            }
                        });
                    } else {
                        res.json({
                            ok: true,
                            productoDB,
                        });
                    }
                }
            });
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'ID inválido'
            }
        });
    }
});

/**
 * Crear un nuevo producto
 */
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let loginUsr = req.usuario;

    console.log(body);
    console.log(loginUsr);

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        // disponible: body.disponible,
        categoria: body.categoria,
        usuario: loginUsr._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: productoDB
        });
    });
});

/**
 * Actualizar un producto por ID
 */
app.put('/producto/:id', verificaToken, (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID es requerído'
            }
        });
    }
    let id = req.params.id;
    let loginUsr = req.usuario;
    let body = req.body;
    let updBody = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        // img: body.img,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: loginUsr._id,
    }

    console.log(updBody);

    Producto.findByIdAndUpdate(id, updBody, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    });
});

/**
 * Borrar un producto
 */
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let updBody = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, updBody, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: productoDB
        });
    })
});

module.exports = app;