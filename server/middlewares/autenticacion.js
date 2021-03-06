const jwt = require('jsonwebtoken');

/**
Verificar token
*/
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;

        next();
    });

    // res.json({
    //     token
    // });
};

/**
Verifica rola admin
*/
let verficaAdminRole = (req, res, next)=>{
    let usuario = req.usuario;
    console.log(usuario);

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Role incorrecto'
            }
        })
    }

    next();
}

/**
Verificar token por url para imagenes
*/
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    // console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;

        next();
    });

    // res.json({
    //     token
    // });
};

module.exports = {
    verificaToken,
    verficaAdminRole,
    verificaTokenImg
}