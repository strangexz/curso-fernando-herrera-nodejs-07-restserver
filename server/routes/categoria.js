const express = require('express');
const mongoose = require('mongoose');
const Categoria = require('../models/categoria');

let {
    verificaToken,
    verficaAdminRole
} = require('../middlewares/autenticacion');

const app = express();

/**
 * Mostrar todas las categorias
 */
app.get('/categorias', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantas: conteo
                });
            })


        });
});

/**
 * Mostrar una categoria por ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {


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
        Categoria.findById({
            _id: mongoose.Types.ObjectId(id)
        }, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                if (!categoriaDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Categoria no encontrada'
                        }
                    });
                } else {
                    res.json({
                        ok: true,
                        categoriaDB,
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
 * Crear una nueva categoria
 */
app.post('/categoria', [verificaToken,
    verficaAdminRole
], (req, res) => {

    let body = req.body;
    let loginUsr = req.usuario;

    console.log(body);
    console.log(loginUsr);

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: loginUsr._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

/**
 * Actualizar una categoria por ID
 */
app.put('/categoria/:id', [verificaToken,
    verficaAdminRole
], (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID es requerído'
            }
        });
    }

    if (!req.body.descripcion) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La descripcion es requerída'
            }
        });
    }

    let id = req.params.id;
    let loginUsr = req.usuario;
    let updBody = {
        descripcion: req.body.descripcion,
        usuario: loginUsr._id,
    }

    console.log(updBody);

    Categoria.findByIdAndUpdate(id, updBody, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * Borrar una categoria por ID
 * Notas: 
 * -Solo un ADMIN puede borrar una categoria
 * -Hay que eliminar físicamente el registro
 */
app.delete('/categoria/:id', [verificaToken,
    verficaAdminRole
], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});



module.exports = app;