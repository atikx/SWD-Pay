import mongoose from "mongoose";
import { Schema } from "mongoose";

const OutletSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    items: {
        type: Array,
        required: true,
    },
    orders: {
        type: Array,
        default: [],
    },
    password: {
        type: String,
        required: true,
    },
});

export default  mongoose.model("Outlet", OutletSchema);