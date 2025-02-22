"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// ✅ استيراد جميع الموديلات والصنفات الديناميكية
const categories_1 = require("./models/categories");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads"))); // ✅ السماح بعرض الصور
// ✅ التأكد من الاتصال بقاعدة البيانات
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));
mongoose_1.default.set("strictQuery", false);
// ✅ إعداد `multer` لحفظ الصور
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, path_1.default.join(__dirname, "../uploads/")),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
// ✅ حفظ البيانات في الموديل الصحيح
app.post("/upload/:list", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }
        const listName = req.params.list;
        if (!categories_1.models[listName]) {
            return res.status(400).json({ message: "Invalid category" });
        }
        const newItem = new categories_1.models[listName]({
            name,
            price,
            imageUrl: `/uploads/${req.file.filename}`,
        });
        yield newItem.save();
        res.status(201).json({ message: "Item added successfully", item: newItem });
    }
    catch (error) {
        console.error("Error saving item:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
// ✅ جلب جميع البيانات من قائمة معينة
app.get("/meals/:list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listName = req.params.list;
        if (!categories_1.models[listName]) {
            return res.status(400).json({ message: "Invalid category" });
        }
        const items = yield categories_1.models[listName].find();
        res.status(200).json(items);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching items" });
    }
}));
app.get("/categories", (_req, res) => {
    res.json(categories_1.categories);
});
// ✅ حذف وجبة معينة حسب القائمة و ID
app.delete("/meals/:list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { list, id } = req.params;
        if (!categories_1.models[list]) {
            return res.status(400).json({ message: "Invalid category" });
        }
        const deletedItem = yield categories_1.models[list].findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Meal not found" });
        }
        res.status(200).json({ message: "Meal deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting meal" });
    }
}));
// ✅ تعديل وجبة معينة حسب القائمة و ID
app.put("/meals/:list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { list, id } = req.params;
        const { name, price } = req.body;
        if (!categories_1.models[list]) {
            return res.status(400).json({ message: "Invalid category" });
        }
        const updatedItem = yield categories_1.models[list].findByIdAndUpdate(id, { name, price }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Meal not found" });
        }
        res.status(200).json(updatedItem);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating meal" });
    }
}));
// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
