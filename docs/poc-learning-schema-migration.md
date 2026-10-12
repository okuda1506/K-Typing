# PoC学習スキーマのマイグレーション

## 対象

- Issue: https://github.com/okuda1506/K-Typing/issues/45
- マイグレーション: `20261012013000_prepare_poc_learning_schema`
- 実施日: 2026-10-12
- ローカルDB: `localhost:5432 / k-typing_db / public`
- PostgreSQL 16.13 / Prisma 6.19.3

## 変更内容

`user_level_progress`を新設し、ジャンル別の級進捗と開始時設定を保存する。
既存テーブルには、級の合格基準、レッスン問題数、固定問題セットへの参照、問題順、セッション成績、採点方式の識別子を追加する。

`lesson_progress`の主キーは`user_id + interest_id + lesson_id`に変更する。
`cleared_at`と`clear_count`は、それぞれ`completed_at`と`completed_count`へ`RENAME COLUMN`で改名する。DROP/ADDによる値の消失は避ける。

## 適用手順

今回の実行環境では`migrate dev`が非対話式のため利用できなかった。
接続先と既存の適用履歴を確認し、`migrate diff`で生成した差分SQLを新規マイグレーションとして保存・調整してから`migrate deploy`で適用した。
過去のマイグレーションは変更していない。

共有された変更を別の開発環境に適用する場合は、`backend`で次を実行する。

```bash
npx prisma migrate status
npx prisma migrate deploy
npx prisma generate
npx prisma validate
```

適用前に`.env`の`DATABASE_URL`と対象テーブルのデータを確認すること。本番は別途バックアップと移行リハーサルを行う。

## 既存データの扱い

今回は、変更対象の学習テーブルがすべて空であることを確認してから適用した。
ユーザー4件、興味6件、登録済み興味4件は保持した。データの削除・dump取得・DBリセットは実施していない。

既存の学習データがある環境への移行は、今回の適用確認に含まれない。
`interest_id`、`lesson_id`、`generated_batch_id`、詳細回答、問題順などの必須値を特定・補完し、一意制約に抵触する重複を解消してから適用する必要がある。
必要に応じてNULL許容での追加、データ移行、必須化を段階的な新規マイグレーションに分ける。推測値で補完したり、既存データが空だと決めつけたりしない。

## SQLで管理する部分一意制約

Prisma 6のスキーマでは表現できないため、次のインデックスはマイグレーションSQLで管理する。

| インデックス | 対象列 | 条件 | 目的 |
| --- | --- | --- | --- |
| `generated_question_batches_succeeded_set_key` | `user_id, interest_id, lesson_id` | `status = 'succeeded'` | 成功セットを1件に限定し、失敗・再試行の履歴は複数保持する |
| `typing_sessions_unfinished_batch_key` | `user_id, generated_batch_id` | `completed_at IS NULL` | 未完了セッションを1件に限定し、完了後の再挑戦は許可する |

`migrate diff`だけではこれらの有無を確認できない。今後のSQL生成・適用時にも保持し、以下のカタログ確認と重複拒否の動作確認を行う。

```sql
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'generated_question_batches_succeeded_set_key',
    'typing_sessions_unfinished_batch_key'
  );
```

## 検証結果

- 実DBの全16テーブル・141カラムをPrisma定義と照合した。型、NULL可否、DBデフォルト、PK、UNIQUE、FK、削除・更新動作が一致した。
- 独立した空の検証用DBに全7件のマイグレーションを適用し、実DBと同じ構造になることを確認した。検証用DBは終了後に削除した。
- 級内のレッスン順、バッチ内の問題順、同じセッション・問題への回答の重複を拒否した。
- 同じユーザー・ジャンル・レッスンの成功バッチの重複を拒否し、未成功バッチは複数保持できた。
- 同じユーザー・バッチの未完了セッションの重複を拒否し、完了後は再挑戦できた。
- 同じユーザー・級・レッスンでも、ジャンル別の進捗を保存できた。
- 興味の選択解除後も進捗・生成セット・挑戦が残った。
- 小数3桁の最高成績・セッション平均を保持できた。
- 参照中のジャンル・生成セットの物理削除を拒否し、ユーザー削除時は関連履歴がCASCADEで削除された。
- Prisma Client生成、`prisma validate`、Lint、Build、既存ユニットテスト4件・E2Eテスト1件が成功した。

今回はDB構造と制約の実装であり、問題数の保証、所有者・所属の一致検証、採点、興味変更制限、次級解放、3級・15レッスンのseedは後続タスクで実装する。
