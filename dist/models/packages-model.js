"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGESCHEMA = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const packageSchema = new mongoose_1.Schema({
    accommondation: {
        tpye: String,
        //   required: [true, "Accommondation must be filled!"],
    },
    base_price: {
        type: String,
        required: [true, "Price must be filled."],
    },
    end_date: {
        type: String,
        required: [true, "End Date must be filled."],
    },
    from: {
        type: String,
        required: [true, "From Desiganation must be filled."],
    },
    start_date: {
        type: String,
        required: [true, "Start Date must be filled."],
    },
    to: {
        type: String,
        required: [true, "To Desiganation must be filled."],
    },
    package_name: {
        type: String,
        required: [true, "Package name must be filled."],
    },
    posted_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Creator id missing."],
    },
    booking_ids: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
}, { timestamps: true });
exports.PACKAGESCHEMA = (0, mongoose_1.model)("package", packageSchema);
