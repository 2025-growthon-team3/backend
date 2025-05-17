"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const User_1 = require("./entity/User");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("DB connected");
    app.get("/users", async (req, res) => {
        const users = await data_source_1.AppDataSource.getRepository(User_1.User).find();
        res.json(users);
    });
    app.post("/users", async (req, res) => {
        const { name, email } = req.body;
        const user = data_source_1.AppDataSource.getRepository(User_1.User).create({ name, email });
        const result = await data_source_1.AppDataSource.getRepository(User_1.User).save(user);
        res.json(result);
    });
    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
})
    .catch((error) => console.error(error));
