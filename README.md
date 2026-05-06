# K-Typing

韓国語学習者が興味関心に合わせた例文をタイピングしながら、単語・文法・分かち書き（띄어쓰기）を習得するためのPWAアプリ

## 概要

既存の語学学習アプリは、基本的に用意された選択肢をタップして回答する形式が多く、手軽に学習できる一方で「読めるけど書けない」「正確な綴りが身につきにくい」という課題がある。

K-Typingでは、韓国語の例文を一文字ずつタイピングすることで、ハングル入力、綴り、パッチム、スペースの位置まで含めたアウトプット力の向上を目指す。

また、ユーザーの興味関心に合わせた例文をAIで生成し、学習内容そのものへの没入感を高める。

## 開発背景

このプロジェクトは、TypeScript / NestJS を軸としたモダンな技術スタックのスキル習得も兼ねている。(コードの書き方等は多少汚くなるかもしれない) リファクタリングは随時行う。

バックエンドでは NestJS、GraphQL、Prisma を採用し、フロントエンドでは React / TypeScript を用いてPWAとしてのユーザー体験を構築する。

## 既存の語学アプリとの差別化

| 比較項目 | 一般的な学習アプリ | K-Typing |
| --- | --- | --- |
| 学習方法 | 用意された選択肢をタップする | 自分の手で一文字ずつタイピングする |
| 定着度 | なんとなくで正解できる場合がある | 正確な綴り・パッチムが必要 |
| 分かち書き | 意識する機会が少ない | スペースの有無まで練習できる |
| コンテンツ | 汎用的な例文が中心 | ユーザーの興味に沿った文章をAIが生成 |
| 目指すスキル | 読解・受動的な理解 | 筆記・能動的なアウトプット |

## 本アプリの特徴

- **「書けない」を解決**
  - キーボード入力を通じて、ハングルの構造・綴り・分かち書きを指で覚える
- **パーソナライズ**
  - ユーザーの興味関心に合わせた例文を生成し、学習テーマを最適化する
- **レベル別の段階的学習**
  - 初級: 単語単体で文字の並びに慣れる
  - 中級: 複数単語、簡単な助詞、活用を練習する
  - 上級: 例文、長文、複雑な分かち書きを練習する
- **タイピング判定**
  - 正誤判定、正確率、ミス数を表示する
  - パッチムや文字単位の打ち間違いを視覚的に扱う
- **スピード計測モード(予定)**
  - 寿司打のように制限時間内でどれだけ正確かつ速く入力できるかを測定する
  - 正確率だけでなく、WPM、入力文字数、連続正解数などを記録する

## 機能

- 興味関心の登録
- レベル別レッスン表示
- 韓国語例文のタイピング練習
- 入力中の文字単位フィードバック
- 回答後の正解 / 不正解表示
- リザルト画面
- タイピング正確率・ミス数の記録
- タイピング速度計測モード(予定)
- AIによる問題生成
- 音声読み上げ
- PWA対応

## 技術スタック

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- GraphQL Client（Apollo Client導入予定）

### Backend

- NestJS
- TypeScript
- GraphQL（Code First）
- Prisma

### Database

- PostgreSQL
- Docker / Docker Compose

### AI / External API

- Gemini API（Google AI SDK）
- Google Cloud Text-to-Speech

### Infrastructure

- Vercel（Frontend予定）
- Fly.io（Backend予定）

## ディレクトリ構成

```text
K-Typing/
├── backend/           # NestJS / GraphQL / Prisma
├── frontend/          # React / Vite
├── docker-compose.yml # PostgreSQL
└── README.md
```

## ローカル環境構築

### 前提

- Node.js
- npm
- Docker Desktop

### 動作環境

現在の開発環境は以下の通り

| 項目 | バージョン |
| --- | --- |
| OS | macOS 26.4.1 |
| Node.js | v23.10.0 |
| npm | 10.9.2 |
| Docker | 27.4.0 |

本READMEはmacOSでの動作確認を前提としている。<br>
Windows環境でも基本的な手順は同じだが、シェル、パス表記、Docker Desktop、環境変数の扱いは利用環境に応じて読み替えること。

### PostgreSQL 起動

```bash
docker compose up -d
```

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

BackendのデフォルトURL:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

FrontendのデフォルトURL:

```text
http://localhost:5173
```

## 環境変数

`backend/.env` に以下を設定する。

```env
DATABASE_URL="postgresql://k-typing_user:k-typing_password@localhost:5432/k-typing_db?schema=public"
```

今後、AI問題生成や音声生成を実装するタイミングで、Gemini APIやGoogle Cloud Text-to-Speech用の環境変数を追加する。

## Prisma

DBスキーマは `backend/prisma/schema.prisma` で管理する。

主なモデル:

- `User`
- `Interest`
- `UserProfile`
- `Level`
- `Lesson`
- `Question`
- `VocabItem`
- `TypingSession`
- `TypingAttempt`
- `TypingMistake`
- `LessonProgress`
- `GeneratedQuestionBatch`
- `AudioAsset`

マイグレーション実行:

```bash
cd backend
npx prisma migrate dev
```

Prisma Client生成:

```bash
cd backend
npx prisma generate
```

## 開発方針

- バックエンドはNestJS / GraphQL / Prismaのスキル習得を重視し、構造を理解しながら段階的に実装する
- フロントエンドはまず動くUIを優先し、API完成後に実データ接続へ移行する
- UIは白・黒・グレーを基調に、シンプルで洗練された韓国特有の雰囲気を目指す
- タイピング体験では、テンポ、フィードバック、達成感を重視する

## 今後の実装予定

- Prisma ClientをNestJSから利用するための `PrismaService` 作成
- GraphQL Resolver / Serviceの実装
- レッスン・問題取得API
- タイピング結果保存API
- タイピング速度計測モード
- WPM、入力文字数、連続正解数などの統計保存
- 認証・ユーザー登録
- 興味関心オンボーディングの永続化
- Gemini APIによる問題生成
- Text-to-Speechによる音声生成
- PWA対応
- スマホ実機での入力・キーボード挙動確認
