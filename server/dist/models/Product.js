"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    images: [{
            type: String,
            required: true,
        }],
    measurements: {
        chest: {
            type: Number,
            required: true,
            min: 0,
        },
        waist: {
            type: Number,
            required: true,
            min: 0,
        },
        length: {
            type: Number,
            required: true,
            min: 0,
        }
    },
    fit: {
        type: String,
        required: true,
        enum: ['Relaxed', 'Normal', 'Fitted'],
        default: 'Normal'
    },
    style: {
        type: String,
        required: true,
        enum: ['Indian', 'Western', 'Indo Western'],
        default: 'Western'
    },
    tags: [{
            type: String,
            trim: true,
        }],
}, {
    timestamps: true,
});
// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
exports.Product = mongoose_1.default.model('Product', productSchema);
