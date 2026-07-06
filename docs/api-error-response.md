# APIエラーレスポンス仕様

## 目的

APIエラーレスポンスの形式を統一し、フロントエンドで項目別エラー表示やtoast表示を安定して扱えるようにする

バックエンドはHTTPステータス、エラー種別、バリデーション詳細を返す
フロントエンドはレスポンス内容をもとに、画面ごとの日本語メッセージへ変換する

## 基本形式

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "messages": ["メールアドレスを入力してください"]
    }
  ],
  "path": "/auth/signup",
  "timestamp": "2026-07-04T00:00:00.000Z"
}
```

## 型定義

```ts
export type FieldError = {
    field: string;
    messages: string[];
};

export type ApiErrorResponse = {
    statusCode: number;
    error: string;
    message: string;
    details: FieldError[];
    path: string;
    timestamp: string;
};
```

## プロパティ

| プロパティ | 型 | 用途 |
| --- | --- | --- |
| `statusCode` | `number` | HTTPステータスコード。フロントエンドの分岐条件として使う |
| `error` | `string` | エラー種別。ログ確認や開発時の判別に使う |
| `message` | `string` | エラー全体の概要。画面にそのまま表示する前提にはしない |
| `details` | `FieldError[]` | 項目別エラー。フォームの該当項目付近に表示するために使う |
| `path` | `string` | エラーが発生したAPIパス。ログ調査やデバッグに使う |
| `timestamp` | `string` | エラー発生時刻。サーバーログとの突き合わせに使う |

## `details` の扱い

`details` はフォーム項目など、特定フィールドに紐づくエラーを表す

```json
{
  "field": "email",
  "messages": [
    "メールアドレスを入力してください",
    "メールアドレスの形式を確認してください"
  ]
}
```

フロントエンドは `field` をもとに、該当する入力項目付近へメッセージを表示する

`details` が空配列の場合は、特定項目に紐づかないエラーとして扱う

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "details": [],
  "path": "/auth/signin",
  "timestamp": "2026-07-04T00:00:00.000Z"
}
```

## ステータスコード方針

| ステータス | 用途 | 例 |
| --- | --- | --- |
| `400` | リクエスト不正、DTOバリデーションエラー | 必須項目未入力、形式不正 |
| `401` | 認証失敗 | サインイン失敗、JWT不正 |
| `403` | 認可失敗 | 権限不足 |
| `404` | リソース未存在 | 対象データなし |
| `409` | データ競合 | メールアドレス重複 |
| `500` | 想定外のサーバーエラー | 未処理例外 |

## バリデーションエラー例

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "messages": ["email must be an email"]
    },
    {
      "field": "password",
      "messages": ["password must be longer than or equal to 8 characters"]
    }
  ],
  "path": "/auth/signup",
  "timestamp": "2026-07-04T00:00:00.000Z"
}
```

## メール重複エラー例

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Email is already in use",
  "details": [
    {
      "field": "email",
      "messages": ["Email is already in use"]
    }
  ],
  "path": "/auth/signup",
  "timestamp": "2026-07-04T00:00:00.000Z"
}
```

## サインイン失敗エラー例

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "details": [],
  "path": "/auth/signin",
  "timestamp": "2026-07-04T00:00:00.000Z"
}
```

サインイン失敗では、メールアドレスの存在有無を推測されないように、メール未登録とパスワード不一致を区別しない

## バックエンド実装ルール

- 例外レスポンスは共通形式へ変換する
- `statusCode`, `error`, `message`, `details`, `path`, `timestamp` を必ず返す
- DTOバリデーションエラーは `details` にフィールド単位で格納する
- 特定フィールドに紐づかないエラーでは `details` を空配列にする
- `message` はAPI側の概要として扱い、画面表示用の最終文言にはしない
- password, token, stack traceなどの機密情報は含めない

## フロントエンド実装ルール

- APIの `message` をそのまま画面に表示しない
- `statusCode` と `details.field` をもとに画面ごとの日本語文言へ変換する
- `details` がある場合は該当項目付近に表示する
- `details` がない場合はフォーム全体エラーまたはtoastで表示する
- 想定外のエラー形式は汎用toastへフォールバックする
