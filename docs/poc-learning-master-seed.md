# PoC学習マスタのseed

## 登録内容

合意済みのPoC学習設計書（2026-10-10）の「学習構成」に対応する3級・15レッスンを登録する。
級・レッスンは全ジャンル共通で、ジャンルごとには複製しない。
問題文・ユーザー進捗・級の解放状態はseedでは作成しない。

| code / difficulty | 級 | 級の順序 | 合格基準 |
| --- | --- | --- | --- |
| `beginner` | 初級 | 1 | 80 |
| `intermediate` | 中級 | 2 | 80 |
| `advanced` | 上級 | 3 | 80 |

各級に以下の5レッスンを登録する。全レッスンの`questionCount`は10、`isActive`はtrue。
`themeType`はジャンルではなく学習目標の識別子であり、問題生成への適用は後続APIで行う。

| 級 | 順序 | title（学習目標） | themeType | 生成する問題の方針 |
| --- | --- | --- | --- | --- |
| 初級 | 1 | 基本単語 | `basic-vocabulary` | 人・場所・物などの短い語 |
| 初級 | 2 | 短いフレーズ | `short-phrases` | 挨拶・好みなどの定型表現 |
| 初級 | 3 | 簡単な文 | `simple-sentences` | 主語と述語を持つ短文 |
| 初級 | 4 | 基本表現の組み合わせ | `basic-expression-combinations` | 既習語と表現を組み合わせる |
| 初級 | 5 | 初級まとめ | `beginner-review` | レッスン1〜4の内容を混ぜる |
| 中級 | 1 | 日常的な文 | `everyday-sentences` | 場面に合う少し長い文 |
| 中級 | 2 | 質問・回答 | `questions-and-answers` | 質問文と返答の表現 |
| 中級 | 3 | 過去・予定 | `past-and-plans` | 過去の出来事・今後の予定 |
| 中級 | 4 | 理由・希望 | `reasons-and-wishes` | 理由や希望を述べる文 |
| 中級 | 5 | 中級まとめ | `intermediate-review` | レッスン1〜4の内容を混ぜる |
| 上級 | 1 | 長めの文 | `longer-sentences` | 初級・中級より長い文 |
| 上級 | 2 | 複数の節 | `multiple-clauses` | 接続や修飾を含む文 |
| 上級 | 3 | 意見・説明 | `opinions-and-explanations` | 意見と説明を表す文 |
| 上級 | 4 | 表現の使い分け | `expression-choice` | 場面に応じた言い回し |
| 上級 | 5 | 上級まとめ | `advanced-review` | レッスン1〜4の内容を混ぜる |

## 実行

`backend/`で、接続先の`DATABASE_URL`を確認して実行する。

```bash
nvm use 22
npx prisma migrate status
npx prisma db seed
```

未適用のマイグレーションがある場合は、[移行手順](poc-learning-schema-migration.md)に沿って先に適用する。
seedのために`migrate reset`や既存データの削除は行わない。

`prisma/seed.ts`は興味 → 級 → レッスンの順に実行する。
各級・レッスンの登録は、それぞれトランザクションでまとめる。級のseedはユーザーへの解放を意味しない。

## 再実行と既存データ

- 級は`code`、レッスンは`levelId + orderNo`をキーにupsertする。既存のID・作成日時を維持し、seed管理項目を定義どおりに更新する。
- `code`とレッスンの`orderNo`は識別子として扱う。既存キーを別の教材に転用したり、級を改名して別codeで再登録したりしない。
- レッスンの旧`requiredAccuracy`は新規作成時にDB既定値80が入り、再実行時は変更しない。PoCの合否判定には級の`requiredAccuracy`を使用する。
- seed対象外の級・レッスンは自動削除しない。既存環境に同じキーの別教材がある場合は、上書き前に移行方針を確認する。
- user・登録済み興味・進捗・問題・挑戦履歴は変更しない。既存の興味seedはマスタの表示情報を更新するが、興味のIDは維持する。
- 親の3級が揃わない場合は、レッスンへの書き込みを行わずエラーにする。

## DB上の確認

DBeaverなどで次を実行する。各級5件・全15件、問題数10、合格基準80を確認する。

```sql
SELECT lv.code, lv.title, lv.order_no, lv.required_accuracy,
       COUNT(ls.id) AS lesson_count
FROM levels lv
LEFT JOIN lessons ls ON ls.level_id = lv.id
WHERE lv.code IN ('beginner', 'intermediate', 'advanced')
GROUP BY lv.id
ORDER BY lv.order_no;

SELECT lv.code, ls.id, ls.order_no, ls.title, ls.theme_type,
       ls.question_count, ls.is_active
FROM lessons ls
JOIN levels lv ON lv.id = ls.level_id
WHERE lv.code IN ('beginner', 'intermediate', 'advanced')
ORDER BY lv.order_no, ls.order_no;
```

以下はseed対象外の級・レッスンを検出する。結果がある場合は、用途を確認し、自動削除しない。

```sql
SELECT lv.code, ls.order_no, ls.title
FROM levels lv
LEFT JOIN lessons ls ON ls.level_id = lv.id
WHERE lv.code NOT IN ('beginner', 'intermediate', 'advanced')
   OR ls.order_no NOT BETWEEN 1 AND 5;
```

同じDBでseedを再実行し、件数・ID・作成日時が変わらないことも確認する。

## テスト

```bash
# prisma/配下も含めて検査する。--fixによる変更を避けたい場合
npx eslint "{src,apps,libs,test,prisma}/**/*.ts"
npx prettier --check "prisma/**/*.ts" prisma/jest-seed.json
npm run test:seed -- --runInBand
npm run test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

`test:seed`はDBへ接続しないユニットテストであり、登録キー・件数・設定・親不足・例外伝播を検証する。
CIでも実行する。実DBの制約や履歴保持は、別途空DBと学習履歴がある検証用DBで確認する。

## 今回の検証結果（2026-10-12）

- 空DBと学習履歴入りDBの2つの独立した検証用DBで、全7マイグレーションとseedを実行した。検証用DBは終了後に削除した。
- 3級・15レッスンのタイトル・順序・合格基準80・問題数10が設計どおりであることを確認した。
- seedの再実行で級・レッスン・興味のIDと作成日時が変わらないことを確認した。
- ユーザー・登録済み興味・級進捗・レッスン進捗・固定バッチ・問題・セッション・回答・語彙・音声など、マスタ以外のデータが変更されないことを確認した。
- 旧レッスン合格基準とseed対象外の級・レッスンが保持されることを確認した。
- 親の級が不足している場合にレッスンが登録されず、各トランザクションの途中でエラーを発生させた場合に全更新がロールバックすることを確認した。
- ローカルDBでもseedを2回実行し、3級・15レッスンと既存ユーザー5件・興味6件の保持を確認した。
- seedユニットテスト8件、既存ユニットテスト4件・E2Eテスト1件、Lint・Build・整形チェックが成功した。

Prisma定義・マイグレーションは変更していない。問題生成・級解放・フロント画面への反映は別タスクで実装する。
