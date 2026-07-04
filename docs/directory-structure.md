# NestJSディレクトリ構成

## 目的

NestJSで新しい処理を実装するときに、どのファイルをどこへ置くべきかを迷わないようにするための整理

このドキュメントはバックエンドの `backend/src` を中心に扱う

## 現在の全体像

```text
backend/                              # NestJSバックエンド全体
├── prisma/                           # DBスキーマとマイグレーション管理
│   ├── schema.prisma                 # PrismaのDBモデル定義
│   └── migrations/                   # DB変更履歴
└── src/                              # NestJSアプリ本体
    ├── main.ts                       # アプリ起動処理、CORS、ValidationPipeなどの全体設定
    ├── app.module.ts                 # ルートModule。各Feature Moduleを束ねる
    ├── app.controller.ts             # ルート確認用Controller
    ├── app.service.ts                # ルート確認用Service
    ├── auth/                         # 認証機能。サインアップ、サインイン、JWTを担当
    │   ├── auth.module.ts            # auth内のController/Service/Strategyを登録
    │   ├── auth.controller.ts        # /auth 配下のHTTP入口
    │   ├── auth.service.ts           # 認証ロジック、パスワード照合、JWT発行
    │   ├── dto/                      # auth APIのリクエストBody定義
    │   │   ├── sign-in.dto.ts        # サインイン入力値とバリデーション
    │   │   └── sign-up.dto.ts        # サインアップ入力値とバリデーション
    │   ├── guards/                   # 認証・認可の通過可否を判定
    │   │   └── jwt-auth.guard.ts     # JWT必須APIを守るGuard
    │   ├── strategies/               # Passportの認証方式定義
    │   │   └── jwt.strategy.ts       # JWTの取り出し、検証、request.user作成
    │   └── types/                    # auth機能内で使う型
    │       ├── auth-response.type.ts # サインアップ/サインインのレスポンス型
    │       ├── auth-user.type.ts     # request.userに載せる認証ユーザー型
    │       └── jwt-payload.type.ts   # JWTに入れるpayload型
    ├── users/                        # usersテーブルとユーザー情報操作を担当
    │   ├── users.module.ts           # UsersServiceを登録し、他Moduleへ公開
    │   ├── users.service.ts          # ユーザー検索、作成、更新などのDB操作
    │   └── types/                    # users機能内で使う型
    │       ├── create-user.input.ts  # ユーザー作成時にServiceへ渡す入力型
    │       ├── public-user.type.ts   # レスポンスに返してよい公開ユーザー型
    │       └── user-with-password.type.ts # password込みの内部利用ユーザー型
    ├── prisma/                       # Prisma ClientをNestJS DIで使うための層
    │   ├── prisma.module.ts          # PrismaServiceを他Moduleへ公開
    │   ├── prisma.service.ts         # PrismaClientを継承したDB接続Service
    │   └── prisma.service.spec.ts    # PrismaServiceのテスト
    ├── config/                       # 環境変数をアプリ用設定値へ変換
    │   ├── ai.config.ts              # AI関連設定
    │   ├── app.config.ts             # アプリ全体設定
    │   └── auth.config.ts            # 認証/JWT/bcrypt関連設定
    └── common/                       # 複数機能で使う共通部品
        └── types/                    # 共通型
            ├── api-error-response.type.ts # API共通エラーレスポンス型
            └── field-error.type.ts   # 項目別エラー型
```

## 判断の基本

```text
特定機能だけで使うもの       -> その機能ディレクトリ配下
複数機能で使うもの           -> common 配下
DB接続そのもの               -> prisma 配下
環境変数から設定を読むもの   -> config 配下
アプリ起動時に一度だけ設定   -> main.ts
機能モジュールの接続         -> *.module.ts
```

例:

```text
サインイン用DTO       -> auth/dto/
JWT認証Guard          -> auth/guards/
ユーザー取得処理      -> users/users.service.ts
Prisma接続処理        -> prisma/prisma.service.ts
共通エラー型          -> common/types/
CORSやValidationPipe  -> main.ts
```

## `src/main.ts`

アプリ起動時の全体設定を書くファイル

現在の役割:

- Nestアプリを起動する
- CORSを設定する
- `ValidationPipe` をグローバル設定する
- 待ち受けポートを設定する

ここに書いてよいもの:

- アプリ全体に効かせるPipe
- アプリ全体に効かせるFilter
- CORS
- 起動ポート

ここに書かないもの:

- サインアップ処理
- DB操作
- ユーザー作成処理
- 各APIのビジネスロジック

今後追加する例:

```text
HttpExceptionFilterのグローバル登録 -> main.ts
ValidationPipeのexceptionFactory     -> main.ts
```

## `src/app.module.ts`

アプリ全体のルートモジュール

現在の役割:

- `ConfigModule` を読み込む
- `AuthModule` を読み込む
- `UsersModule` を読み込む
- `PrismaModule` を読み込む

ここに書いてよいもの:

- アプリ全体で使うModuleの読み込み
- グローバル設定Moduleの読み込み

ここに書かないもの:

- 機能ごとのController
- 機能ごとのService
- ビジネスロジック

新しい機能を追加するときは、まず機能Moduleを作り、`app.module.ts` にはそのModuleだけを追加する

```text
LessonsModuleを作成 -> app.module.ts の imports に LessonsModule を追加
TypingModuleを作成  -> app.module.ts の imports に TypingModule を追加
```

## `src/auth/`

認証機能のディレクトリ

担当範囲:

- サインアップ
- サインイン
- JWT発行
- JWT検証
- 認証Guard
- 認証用DTO
- 認証レスポンス型

```text
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
├── guards/
├── strategies/
└── types/
```

### `auth.module.ts`

認証機能の部品をNestJSに登録するファイル

現在の役割:

- `UsersModule` を読み込む
- `JwtModule` を設定する
- `AuthController` を登録する
- `AuthService` と `JwtStrategy` を登録する

判断基準:

```text
AuthServiceで使う他ModuleのServiceがある -> importsに追加
Auth機能のControllerがある                -> controllersに追加
Auth機能のService/Strategyがある          -> providersに追加
他ModuleからAuthServiceを使わせたい        -> exportsに追加
```

### `auth.controller.ts`

HTTPリクエストを受け取る入口

現在の役割:

- `POST /auth/signup`
- `POST /auth/signin`

ここに書いてよいもの:

- `@Post()`, `@Get()` などのルーティング
- `@Body()` でDTOを受け取る処理
- `AuthService` の呼び出し
- `@HttpCode()` などのHTTPレスポンス制御

ここに書かないもの:

- パスワードハッシュ化
- DB検索
- JWT生成
- 複雑な条件分岐

### `auth.service.ts`

認証のビジネスロジックを書く場所

現在の役割:

- サインアップ処理
- サインイン処理
- パスワードハッシュ化
- パスワード照合
- JWT発行
- `UsersService` の呼び出し

ここに書いてよいもの:

- 認証に関する判断
- パスワード照合
- JWT payload作成
- 認証エラーの例外throw

ここに書かないもの:

- Prismaを直接使ったusersテーブル操作
- HTTPルーティング
- 画面表示用メッセージ

### `auth/dto/`

リクエストBodyの型とバリデーションを書く場所

現在のファイル:

```text
sign-up.dto.ts
sign-in.dto.ts
```

置くもの:

- API入力値の型
- `class-validator` のデコレータ

置かないもの:

- DB保存用の内部データ型
- レスポンス型
- ビジネスロジック

新規ファイル例:

```text
パスワード変更API -> auth/dto/change-password.dto.ts
メール認証API     -> auth/dto/verify-email.dto.ts
```

### `auth/guards/`

認証や認可の通過可否を判定する場所

現在のファイル:

```text
jwt-auth.guard.ts
```

置くもの:

- JWT必須APIを守るGuard
- ロールや権限チェック用Guard

新規ファイル例:

```text
管理者だけ許可 -> auth/guards/roles.guard.ts
```

### `auth/strategies/`

Passportの認証方式を書く場所

現在のファイル:

```text
jwt.strategy.ts
```

置くもの:

- JWTの取り出し方
- JWT署名検証の設定
- 検証後に `request.user` へ載せるユーザー情報の作成

### `auth/types/`

認証機能の中で使う型を置く場所

現在のファイル:

```text
auth-response.type.ts
auth-user.type.ts
jwt-payload.type.ts
```

置くもの:

- 認証レスポンス型
- JWT payload型
- `request.user` の型

置かないもの:

- 複数機能で使う共通APIエラー型
- users機能専用の型

## `src/users/`

ユーザー機能のディレクトリ

担当範囲:

- usersテーブルの作成
- usersテーブルの検索
- usersテーブルの更新
- 公開用ユーザー型の定義

```text
users/
├── users.module.ts
├── users.service.ts
└── types/
```

### `users.module.ts`

Users機能をNestJSに登録するファイル

現在の役割:

- `PrismaModule` を読み込む
- `UsersService` を登録する
- `UsersService` を他Moduleへ公開する

`AuthService` から `UsersService` を使うため、`exports: [UsersService]` が必要

### `users.service.ts`

usersテーブルに関する処理を書く場所

現在の役割:

- emailでユーザー検索
- password込みでユーザー検索
- ユーザー作成

ここに書いてよいもの:

- usersテーブルへのPrisma操作
- ユーザー作成
- ユーザー検索
- プロフィール更新

ここに書かないもの:

- パスワードハッシュ化
- JWT発行
- サインイン可否の判断

### `users/types/`

Users機能専用の型を置く場所

現在のファイル:

```text
create-user.input.ts
public-user.type.ts
user-with-password.type.ts
```

判断基準:

```text
Service内部に渡す入力型       -> *.input.ts
レスポンスで返してよい型      -> *.type.ts
password込みの内部利用型      -> user-with-password.type.ts
```

新規ファイル例:

```text
プロフィール更新入力 -> users/types/update-user-profile.input.ts
```

## `src/prisma/`

Prisma ClientをNestJSのDIで使えるようにするディレクトリ

```text
prisma/
├── prisma.module.ts
├── prisma.service.ts
└── prisma.service.spec.ts
```

### `prisma.service.ts`

Prisma ClientをNestJSのServiceとして扱うためのファイル

現在の役割:

- `PrismaClient` を継承する
- アプリ起動時にDB接続する

### `prisma.module.ts`

`PrismaService` を他Moduleから使えるようにするファイル

他のFeature ModuleでDB操作したい場合は、そのModuleで `PrismaModule` をimportする

```ts
@Module({
    imports: [PrismaModule],
    providers: [SomeService],
})
export class SomeModule {}
```

## `src/config/`

環境変数をアプリ内の設定値へ変換する場所

現在のファイル:

```text
ai.config.ts
app.config.ts
auth.config.ts
```

置くもの:

- `process.env` を読む処理
- 環境変数のデフォルト値
- 機能ごとの設定値

置かないもの:

- 実際のビジネスロジック
- APIキーの生値
- DB操作

新規ファイル例:

```text
Google TTS設定 -> config/tts.config.ts
メール送信設定 -> config/mail.config.ts
```

## `src/common/`

複数機能で使う共通部品を置く場所

現在のファイル:

```text
common/
└── types/
    ├── api-error-response.type.ts
    └── field-error.type.ts
```

置くもの:

- 複数Moduleで使う型
- 共通Filter
- 共通Interceptor
- 共通Decorator
- 共通Util

置かないもの:

- authだけで使う型
- usersだけで使う型
- 特定機能のService

今後追加する想定:

```text
common/
├── filters/
│   └── http-exception.filter.ts
├── types/
│   ├── api-error-response.type.ts
│   └── field-error.type.ts
└── utils/
    └── validation-error.util.ts
```

## `backend/prisma/`

DBスキーマとマイグレーションを管理する場所

```text
backend/prisma/
├── schema.prisma
└── migrations/
```

### `schema.prisma`

PrismaのDBモデル定義を書くファイル

置くもの:

- `model User`
- `model Lesson`
- `model TypingSession`
- DBテーブル、カラム、リレーションの定義

### `migrations/`

DB変更履歴を置く場所

直接手で作るより、基本は以下で生成する

```bash
npx prisma migrate dev --name <migration_name>
```

## 新規ファイル配置早見表

| 作りたいもの | 配置先 | 例 |
| --- | --- | --- |
| 新しい機能Module | `backend/src/<feature>/` | `lessons/lessons.module.ts` |
| APIの入口 | `backend/src/<feature>/<feature>.controller.ts` | `lessons/lessons.controller.ts` |
| ビジネスロジック | `backend/src/<feature>/<feature>.service.ts` | `lessons/lessons.service.ts` |
| リクエストDTO | `backend/src/<feature>/dto/` | `lessons/dto/create-lesson.dto.ts` |
| Service内部入力型 | `backend/src/<feature>/types/` | `users/types/create-user.input.ts` |
| レスポンス型 | `backend/src/<feature>/types/` | `auth/types/auth-response.type.ts` |
| JWT Guard | `backend/src/auth/guards/` | `auth/guards/jwt-auth.guard.ts` |
| Passport Strategy | `backend/src/auth/strategies/` | `auth/strategies/jwt.strategy.ts` |
| 共通エラー型 | `backend/src/common/types/` | `common/types/api-error-response.type.ts` |
| 共通Exception Filter | `backend/src/common/filters/` | `common/filters/http-exception.filter.ts` |
| 共通Decorator | `backend/src/common/decorators/` | `common/decorators/current-user.decorator.ts` |
| 共通Interceptor | `backend/src/common/interceptors/` | `common/interceptors/response.interceptor.ts` |
| 環境変数設定 | `backend/src/config/` | `config/auth.config.ts` |
| Prisma接続 | `backend/src/prisma/` | `prisma/prisma.service.ts` |
| DBモデル変更 | `backend/prisma/schema.prisma` | `model Lesson` |
| DB変更履歴 | `backend/prisma/migrations/` | `202606..._create_lessons/` |

## 今後の実装での配置例

### API共通エラーフォーマット

```text
backend/src/common/
├── filters/
│   └── http-exception.filter.ts
└── types/
    ├── api-error-response.type.ts
    └── field-error.type.ts
```

`main.ts` で `HttpExceptionFilter` をグローバル登録する

### 認証必須APIでログインユーザーを取得する

```text
backend/src/common/decorators/current-user.decorator.ts
```

`request.user` をControllerで簡単に受け取るための共通Decoratorとして置く

### ユーザープロフィール更新API

```text
backend/src/users/
├── users.controller.ts
├── users.service.ts
├── dto/
│   └── update-user-profile.dto.ts
└── types/
    └── update-user-profile.input.ts
```

HTTP入力は `dto/`
Service内部で使う入力型は `types/`

### レッスン取得API

```text
backend/src/lessons/
├── lessons.module.ts
├── lessons.controller.ts
├── lessons.service.ts
├── dto/
└── types/
```

`app.module.ts` の imports に `LessonsModule` を追加する

### タイピングセッションAPI

```text
backend/src/typing/
├── typing.module.ts
├── typing-session.controller.ts
├── typing-session.service.ts
├── dto/
│   ├── start-typing-session.dto.ts
│   └── submit-typing-attempt.dto.ts
└── types/
```

タイピング機能専用なので `typing/` 配下にまとめる

### Gemini API連携

```text
backend/src/ai/
├── ai.module.ts
├── ai.service.ts
└── types/
```

APIキーやモデル名などの設定は `config/ai.config.ts`
実際にGeminiを呼び出す処理は `ai/ai.service.ts`

### Google TTS連携

```text
backend/src/tts/
├── tts.module.ts
├── tts.service.ts
└── types/
```

TTS用の環境変数設定が増える場合は `config/tts.config.ts`

## 迷ったときの判断基準

### `dto/` か `types/` か

```text
Controllerで @Body() として受け取る入力 -> dto/
Service内部で使う入力                  -> types/
レスポンス型                            -> types/
```

例:

```text
SignUpDto        -> auth/dto/sign-up.dto.ts
CreateUserInput  -> users/types/create-user.input.ts
PublicUser       -> users/types/public-user.type.ts
```

### `common/` か機能ディレクトリか

```text
authだけで使う      -> auth/
usersだけで使う     -> users/
複数機能で使う      -> common/
アプリ全体に効く    -> main.ts or common/
```

例:

```text
JwtPayload             -> auth/types/
PublicUser             -> users/types/
ApiErrorResponse       -> common/types/
HttpExceptionFilter    -> common/filters/
```

### `config/` か `.env` か

```text
.env      -> 環境ごとに変わる値を書く
config/   -> .envの値をアプリで使いやすい形に変換する
```

例:

```text
.env
JWT_SECRET=...
JWT_EXPIRES_IN=1h

config/auth.config.ts
jwtSecret: process.env.JWT_SECRET
jwtExpiresIn: process.env.JWT_EXPIRES_IN
```

### `module.ts` に何を書くか

`module.ts` は、その機能で使う部品をNestJSに登録する場所

```text
imports     -> 他Moduleから借りるもの
controllers -> HTTP入口
providers   -> Service, Strategyなど
exports     -> 他Moduleへ公開するもの
```

## CLIで作るときの目安

新しい機能はNest CLIで作る

```bash
nest g module lessons
nest g controller lessons
nest g service lessons
```

DTOはCLIでclassを作ってから中身を調整する

```bash
nest g class lessons/dto/create-lesson.dto --no-spec
```

ただし、`types/` 配下の型定義や `common/filters/` のような薄い共通ファイルは、既存構成に合わせて手動作成してよい

## 最初に覚える構造

```text
Controller -> Service -> PrismaService -> DB
```

認証の場合:

```text
AuthController
  -> AuthService
      -> UsersService
          -> PrismaService
              -> PostgreSQL
```

Laravelに寄せて考えると、おおよそ以下の感覚

```text
Controller       -> LaravelのController
DTO              -> LaravelのFormRequest
Service          -> LaravelのServiceクラス
Module           -> ServiceProvider + 機能単位の依存管理
Guard            -> Middleware / Policyに近い認証認可判定
PrismaService    -> Eloquent/DB接続をNestJS DIに載せたもの
ExceptionFilter  -> app/Exceptions/Handler.phpに近い例外レスポンス整形
```
