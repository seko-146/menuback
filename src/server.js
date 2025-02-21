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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var multer_1 = __importDefault(require("multer"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
// ✅ استيراد جميع الموديلات والصنفات الديناميكية
var categories_1 = require("./models/categories");
dotenv_1.default.config();
var app = (0, express_1.default)();
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
    .then(function () { return console.log("✅ MongoDB Connected"); })
    .catch(function (err) { return console.log("❌ MongoDB Connection Error:", err); });
mongoose_1.default.set("strictQuery", false);
// ✅ إعداد `multer` لحفظ الصور
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) { return cb(null, path_1.default.join(__dirname, "../uploads/")); },
    filename: function (_req, file, cb) { return cb(null, "".concat(Date.now(), "-").concat(file.originalname)); },
});
var upload = (0, multer_1.default)({ storage: storage });
// ✅ حفظ البيانات في الموديل الصحيح
app.post("/upload/:list", upload.single("image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, price, listName, newItem, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ message: "No file uploaded" })];
                }
                _a = req.body, name_1 = _a.name, price = _a.price;
                if (!name_1 || !price) {
                    return [2 /*return*/, res.status(400).json({ message: "Name and price are required" })];
                }
                listName = req.params.list;
                if (!categories_1.models[listName]) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid category" })];
                }
                newItem = new categories_1.models[listName]({
                    name: name_1,
                    price: price,
                    imageUrl: "/uploads/".concat(req.file.filename),
                });
                return [4 /*yield*/, newItem.save()];
            case 1:
                _b.sent();
                res.status(201).json({ message: "Item added successfully", item: newItem });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error saving item:", error_1);
                res.status(500).json({ message: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ جلب جميع البيانات من قائمة معينة
app.get("/meals/:list", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listName, items, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                listName = req.params.list;
                if (!categories_1.models[listName]) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid category" })];
                }
                return [4 /*yield*/, categories_1.models[listName].find()];
            case 1:
                items = _a.sent();
                res.status(200).json(items);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ message: "Error fetching items" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/categories", function (_req, res) {
    res.json(categories_1.categories);
});
// ✅ حذف وجبة معينة حسب القائمة و ID
app.delete("/meals/:list/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, list, id, deletedItem, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, list = _a.list, id = _a.id;
                if (!categories_1.models[list]) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid category" })];
                }
                return [4 /*yield*/, categories_1.models[list].findByIdAndDelete(id)];
            case 1:
                deletedItem = _b.sent();
                if (!deletedItem) {
                    return [2 /*return*/, res.status(404).json({ message: "Meal not found" })];
                }
                res.status(200).json({ message: "Meal deleted successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(500).json({ message: "Error deleting meal" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ تعديل وجبة معينة حسب القائمة و ID
app.put("/meals/:list/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, list, id, _b, name_2, price, updatedItem, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.params, list = _a.list, id = _a.id;
                _b = req.body, name_2 = _b.name, price = _b.price;
                if (!categories_1.models[list]) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid category" })];
                }
                return [4 /*yield*/, categories_1.models[list].findByIdAndUpdate(id, { name: name_2, price: price }, { new: true })];
            case 1:
                updatedItem = _c.sent();
                if (!updatedItem) {
                    return [2 /*return*/, res.status(404).json({ message: "Meal not found" })];
                }
                res.status(200).json(updatedItem);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                res.status(500).json({ message: "Error updating meal" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ تشغيل السيرفر
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () { return console.log("\uD83D\uDE80 Server running on port ".concat(PORT)); });
