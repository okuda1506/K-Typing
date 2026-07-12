# 開発コマンド一覧

よく使うコマンドを、実行するディレクトリごとにまとめる。

CIはNode.js 22を使用している。Node.jsのバージョンに起因するエラーが出た場合は、まず `nvm use 22` と `node -v` で確認する。

## ルートディレクトリ

実行場所: `K-Typing/`

| 目的 | コマンド | 補足 |
| --- | --- | --- |
| PostgreSQLを起動 | `docker compose up -d` | バックグラウンドで起動する |
| PostgreSQLを停止 | `docker compose down` | データは削除しない |
| コンテナの状態を確認 | `docker compose ps` | PostgreSQLが起動しているか確認する |
| PostgreSQLのログを確認 | `docker compose logs -f` | 終了するには `Ctrl + C` |

## Frontend

実行場所: `K-Typing/frontend/`

| 目的 | コマンド | コード変更 |
| --- | --- | --- |
| 依存パッケージをlock fileどおりに導入 | `npm ci` | なし |
| 開発サーバーを起動 | `npm run dev` | なし |
| ESLintで問題を検査 | `npm run lint` | なし |
| Prettierで整形 | `npm run format` | あり |
| Prettier設定に沿っているか検査 | `npm run format:check` | なし |
| 本番用に型チェック・ビルド | `npm run build` | なし |
| 本番ビルドをローカル確認 | `npm run preview` | なし |

`npm run format` はファイルを書き換える。コミット前に書式だけの差分が含まれていないか確認する。

## Backend

実行場所: `K-Typing/backend/`

| 目的 | コマンド | コード変更 |
| --- | --- | --- |
| 依存パッケージをlock fileどおりに導入 | `npm ci` | なし |
| 開発サーバーを起動 | `npm run start:dev` | なし |
| デバッグポート付きで開発サーバーを起動 | `npm run start:debug` | なし |
| 本番用にコンパイル | `npm run build` | なし |
| Jestテストを実行 | `npm run test` | なし |
| Jestをwatchモードで実行 | `npm run test:watch` | なし |
| テストカバレッジを出力 | `npm run test:cov` | `coverage/` を生成 |
| E2Eテストを実行 | `npm run test:e2e` | なし |
| ESLintで検査・自動修正 | `npm run lint` | あり |
| Prettierで整形 | `npm run format` | あり |

バックエンドの `npm run lint` は `--fix` を含むため、実行するとコードが自動修正される場合がある。

## Prisma

実行場所: `K-Typing/backend/`

| 目的 | コマンド | 補足 |
| --- | --- | --- |
| schema.prismaの定義を検証 | `npx prisma validate` | DB変更は行わない |
| Prisma Clientを生成 | `npx prisma generate` | schema変更後や依存導入後に実行する |
| 開発DBへマイグレーションを作成・適用 | `npx prisma migrate dev --name <migration-name>` | `schema.prisma`変更後に使う |
| マイグレーション適用状況を確認 | `npx prisma migrate status` | DB変更は行わない |
| DBのGUIを起動 | `npx prisma studio` | 通常はDBeaverを使う場合は不要 |

## PR前の基本確認

変更した側だけでなく、影響する側も確認する。

```bash
# frontend/
npm run format:check
npm run lint
npm run build

# backend/
npm run lint
npm run test
npm run build
```

DBスキーマを変更した場合は、バックエンド側で以下も実行する。

```bash
npx prisma validate
npx prisma migrate status
```
