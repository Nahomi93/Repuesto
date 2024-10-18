// crea estructura fija esto no da consultas definimos objetos de lo que queremos validar 

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique:true,
    },
    telefono:{
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    rol: {
        type: String,
        require: true,
    },
},{
    timestamps: true
})

export default mongoose.model('User', userSchema)