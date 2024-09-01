// （１）必要なパッケージをインポートする
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

// （２）新しくインスタンスを作る
const prisma = new PrismaClient();
const app = express();        // アプリのインスタンス

// （３）Expressアプリケーションにミドルウェアを追加
// HTTPリクエストのボディを解析してJSONとして利用できるようにする
// このように書くことで、JSON形式で送信されたPOSTリクエストのデータを扱うことができる
app.use(express.json());
app.use(cors());

// ルートパスへのGETリクエストハンドラを追加
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// GET /user
// 全てのユーザー情報を取得
app.get('/user', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET /user/:id
// idで指定したユーザーを取得
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  res.json(user);
});

// POST /user
app.post('/user', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });
  res.json(user);
});

// PUT /user/:id
app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email }
  });
  res.json(user);
});

// DELETE /user/:id
app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({ where: { id: Number(id) } });
  res.json(user);
});

// （４）Expressアプリケーションをポート3000で起動する。サーバーが起動したら、コンソールにメッセージを表示する。
app.listen(3000, () => {
  console.log('REST API server ready at: http://localhost:3000');
});
