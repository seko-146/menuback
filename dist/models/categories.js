"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = exports.models = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("./schema");
// ✅ قائمة الأصناف التي يمكن تعديلها بسهولة
const categories = ["list-1", "list-2", "list-3", "list-4", "list-5"]; // يمكنك إضافة المزيد هنا
exports.categories = categories;
// ✅ إنشاء موديل لكل صنف بشكل ديناميكي
const models = {};
exports.models = models;
categories.forEach((category) => {
    models[category] = mongoose_1.default.model(category, schema_1.ItemSchema);
});
