import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
    student :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})