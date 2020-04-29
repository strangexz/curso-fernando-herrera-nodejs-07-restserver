const mongoose = require('mongoose'); // Erase if already required
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

// let Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
let usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El telefono es necesario'],
        unique:true,
    },
    // mobile:{
    //     type:String,
    //     required:true,
    //     unique:true,
    // },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria'],
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    }, 
    google: {
        type: Boolean,
        default: false
    },
});

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

//Export the model
module.exports = mongoose.model('Usuario', usuarioSchema);