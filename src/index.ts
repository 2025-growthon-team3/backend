import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");

    app.get("/users", async (req, res) => {
      const users = await AppDataSource.getRepository(User).find();
      res.json(users);
    });

    app.post("/users", async (req, res) => {
      const { name, email } = req.body;
      const user = AppDataSource.getRepository(User).create({ name, email });
      const result = await AppDataSource.getRepository(User).save(user);
      res.json(result);
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((error) => console.error(error));
