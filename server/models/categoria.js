const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var categoriaSchema = new mongoose.Schema({
    descripcion:{
        type:String,
        required:[true, "La descripción es obligatoria"],
        unique:true,
        // index:true,
    },
    usuario:{
        type:mongoose.Schema.Types.ObjectId,
        // required:[true, "El usuario es requerido"],        
        ref: 'Usuario',
    },
    
});

//Export the model
module.exports = mongoose.model('Categoria', categoriaSchema);