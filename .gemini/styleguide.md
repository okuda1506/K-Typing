# Gemini Code Assist Review Style Guide

## レビュー言語

- レビューコメント、PR要約、指摘内容は必ず日本語で書く
- ただし、コード、ファイル名、メソッド名、クラス名、エラー名、HTTPメソッド、APIパスは英語表記のまま扱う
- 指摘は簡潔にし、理由と修正方針を明確に書く

## レビューの優先順位

以下の順で優先してレビューする

1. バグ、仕様漏れ、実行時エラー
2. セキュリティリスク
3. 型安全性、TypeScriptの不適切な型
4. NestJSの責務分離違反
5. API設計との不整合
6. テスト不足
7. 可読性、命名、保守性
8. 軽微なスタイル指摘

## プロジェクト前提

このリポジトリは韓国語タイピング学習PWA「K-Typing」のmonorepo

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, REST API, Prisma
- Database: PostgreSQL
- CI: GitHub Actions
- 認証はJWTを使用する想定

## Backend / NestJS ルール

- Controllerにはビジネスロジックを書かない
- Controllerはリクエスト受け取り、DTO受け取り、Service呼び出し、レスポンス返却に限定する
- Serviceは業務処理、Prisma操作、外部API連携を担当する
- AppModuleにControllerやServiceを直接増やさない
- 機能ごとにFeature Moduleを作る
- 他ModuleのServiceを使う場合は、定義元Moduleでexportsし、利用側Moduleでimportsする
- @Global() の利用は原則禁止
- new によるService生成を避け、constructor injectionを使う
- DTOなしの @Body() は避ける
- any の利用は原則避ける
- class-validator による入力バリデーションを行う
- passwordやtokenなどの機密情報をレスポンスに含めない

## Auth / Users ルール

- auth は認証、サインアップ、サインイン、JWT、パスワード照合を担当する
- users はusersテーブル、ユーザー取得、ユーザー作成、プロフィール更新を担当する
- AuthServiceからUsersServiceを呼び出してよい
- UsersServiceはAuthServiceに依存しない
- パスワードは必ずハッシュ化して保存する
- email重複時は適切なHTTPステータスを返す
- passwordとconfirmPasswordの一致確認を行う
- レスポンスにpassword、passwordHash、confirmPasswordを含めない

## Prisma / DB ルール

- Prisma model名は単数形PascalCaseにする
- DBテーブル名はsnake_caseの複数形にする
- DBカラム名はsnake_caseにする
- Prisma側のプロパティ名はcamelCaseにする
- DB物理名との対応には @map と @@map を使う
- migrationやschema変更時は、既存データや将来の拡張性を考慮する
- 不要なnullableを増やさない
- IDや外部キーの型に一貫性を持たせる

## Frontend / React ルール

- UIは白、黒、グレー基調のシンプルで洗練された見た目を維持する
- コンポーネントは責務ごとに分ける
- API呼び出し処理と表示コンポーネントを過度に混ぜない
- formでは入力値、送信中、エラー表示、成功時の状態を扱う
- TypeScriptの型を曖昧にしない
- anyを避ける

## API設計ルール

- REST APIを前提にレビューする
- APIパス、HTTPメソッド、ステータスコードがRESTとして自然か確認する
- リクエストDTOとレスポンス形式の整合性を確認する
- 400、401、403、404、409、500などの使い分けを確認する
- passwordなどの機密項目をレスポンスに含めない
- エラーレスポンスがフロントエンドで扱いやすいか確認する

## CI / GitHub Actions ルール

- backendとfrontendのCIが分かれていることを前提に確認する
- npm ci、lint、test、build、Prisma validate/generateが壊れていないか重視する
- CI設定ではSecretsや環境変数の扱いに注意する
- .envやAPIキーなどの機密情報をコミットしていないか確認する
- DATABASE_URLなどのCI用ダミー値と本番値を混同しない

## 命名規則

- ファイル名はkebab-case
- クラス名はPascalCase
- 変数名、関数名、メソッド名はcamelCase
- DTOファイルは sign-up.dto.ts のように命名する
- Serviceは users.service.ts のように命名する
- Controllerは auth.controller.ts のように命名する
- テストファイルは *.spec.ts を基本にする

## コメント方針

- 問題がある箇所は、なぜ問題かを説明する
- 可能であれば修正例を短く提示する
- ただし、PR全体を勝手に大きく書き換える提案は避ける
- 設計上の懸念がある場合は、代替案を1つ以上出す
- 初学者に分かるように、NestJSやTypeScriptの理由を補足する

## 学習補助・説明方針

このプロジェクトの開発者は、PHP（Laravel / CakePHP）実務経験を持ち、TypeScript / NestJSへ移行中のエンジニアである  
レビューでは、単に問題点を指摘するだけでなく、NestJSの設計思想やTypeScriptの型安全性を理解できる説明を添える  
NestJS特有の概念については、必要に応じてLaravelの概念と比較して説明する

例:

- Module: LaravelのServiceProviderや機能単位の構成管理に近いが、NestJSではDIの境界としてより明確に扱う
- Controller: LaravelのControllerと近いが、NestJSではDTOとServiceへの委譲をより強く意識する
- Service / Provider: LaravelのServiceクラスに近いが、NestJSではDIコンテナに登録されるProviderとして扱う
- DTO: LaravelのFormRequestに近い入力定義・バリデーション境界として扱う
- Guard: LaravelのMiddlewareやPolicyに近いが、主に認証・認可の判定に使う
- Pipe: LaravelのFormRequestや入力変換処理に近いが、NestJSではController到達前の変換・検証として扱う

Laravelと直接比較しづらい概念は、無理に比較せずNestJS側の考え方を簡潔に説明する

## 指摘不要なもの

- 動作や保守性に影響しない細かすぎる好み
- 既存の設計方針と一致している軽微な実装差
- まだ実装途中であることが明らかな未使用コード
- CIやビルドで検出できる単純なフォーマット差分だけの重複指摘
