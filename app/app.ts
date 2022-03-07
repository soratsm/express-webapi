require("dotenv").config();
// coreモジュール
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
const app = express();

// バックエンドのフレームワーク等の隠蔽
app.disable("x-powered-by");

// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, "public")));

const prisma = new PrismaClient();

// Get all users
app.get("/api/v1/users", async (req, res) => {
  // const allUsers = await prisma.users.findMany();
  const allUsers = await prisma.$queryRawUnsafe(`select * from users;`);
  res.json(allUsers);
});

// Get a user
app.get("/api/v1/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.users.findFirst({
    where: {
      id: id,
    },
  });
  // const id = req.params.id;
  // const user = await prisma.$queryRawUnsafe(
  //   `select * from users where id = ${id};`
  // );
  if (!user) {
    res.status(404).send({ error: "Not Found!" });
  } else {
    res.status(200).json(user);
  }
});

// Search users matching keyword
app.get("/api/v1/search", async (req, res) => {
  const keyword = req.query.q as string | undefined;
  const user = await prisma.users.findMany({
    where: {
      name: { contains: keyword },
    },
  });
  // const keyword = req.query.q;
  // const user = await prisma.$queryRawUnsafe(
  //   `select * from users where name like '%${keyword}%';`
  // );
  res.json(user);
});

// Create a new user
app.post("/api/v1/users", async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ error: "ユーザー名が指定されていません。" });
  } else {
    const name = req.body.name;
    const profile = req.body.profile ? req.body.profile : "";
    const dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth : null;

    try {
      const user = await prisma.users.create({
        data: {
          name: name,
          profile: profile,
          dateOfBirth: dateOfBirth,
        },
      });
      res.status(201).send({ message: "新規ユーザーを作成しました。" });
    } catch (e) {
      res.status(500).send({ error: e });
    }
  }
});

// Update user data
app.put("/api/v1/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const currentUser = await prisma.users.findFirst({
    where: {
      id: id,
    },
  });
  if (!currentUser) {
    res.status(404).send({ error: "指定されたユーザーが見つかりません。" });
  } else {
    const name = req.body.name ? req.body.name : currentUser.name;
    const profile = req.body.profile ? req.body.profile : currentUser.profile;
    const dateOfBirth = req.body.dateOfBirth
      ? req.body.dateOfBirth
      : currentUser.dateOfBirth;
    try {
      const user = await prisma.users.update({
        where: { id: id },
        data: {
          name: name,
          profile: profile,
          dateOfBirth: dateOfBirth,
        },
      });
      res.status(200).send({ message: "ユーザー情報を更新しました。" });
    } catch (e) {
      res.status(500).send({ error: e });
    }
  }
});

// Delete user data
app.delete("/api/v1/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const currentUser = await prisma.users.findFirst({
    where: {
      id: id,
    },
  });
  if (!currentUser) {
    res.status(404).send({ error: "指定されたユーザーが見つかりません。" });
  } else {
    try {
      const user = await prisma.users.delete({
        where: { id: id },
      });
      res.status(200).send({ message: "ユーザー情報を削除しました。" });
    } catch (e) {
      res.status(500).send({ error: e });
    }
  }
});
const port = process.env.PORT || 3000;

app.listen(port);

console.log("Liste on port: " + port);
