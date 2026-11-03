# 学習一覧取得API

## エンドポイント

`GET /learning/overview`

JWT認証必須。Authorizationヘッダーに `Bearer <accessToken>` を指定する。
リクエストBodyとユーザーIDの指定は不要。取得対象はJWTのユーザー本人に限定する。

## 取得範囲

- 本人が選択した有効な興味を、表示順とIDの昇順で返す。
- 各ジャンルに初級・中級・上級を返し、各級は順序付き5レッスン、各レッスンは10問とする。
- 進捗はユーザー・ジャンル・級またはレッスンの組み合わせで取得する。共通レッスンIDでもジャンル間で進捗を共有しない。
- 興味未登録、または有効な選択興味がない場合は `200` と `{ "interests": [] }` を返す。
- 取得専用。進捗作成、級解放の保存、問題生成、興味設定の変更は行わない。

## 成功レスポンス

HTTP `200`。型の定義元は `backend/src/learning/types/`。

| 階層 | 主なプロパティ |
| --- | --- |
| トップレベル | `interests: LearningInterest[]` |
| 興味 | `id`、`key`、`labelJa`、`detailAnswer`、`canChange`、`levels` |
| 級 | `id`、`code`、`title`、`orderNo`、`requiredAccuracy`、`isUnlocked`、`unlockedAt`、`startedAt`、`completedAt`、`passedAt`、`completedLessonCount`、`passedLessonCount`、`lessonCount`、`lessons` |
| レッスン | `id`、`title`、`themeType`、`orderNo`、`questionCount`、`status`、`startedAt`、`completedAt`、`completedCount`、`bestAccuracy`、`isPassed` |

### 初期状態の例

下記は興味・初級・レッスンの各1件を抜粋した例。実際には各興味に3級、各級に5レッスンが含まれる。

```json
{
  "interests": [
    {
      "id": "91bdbccd-cf5e-4844-b0fc-cc0fab02ef51",
      "key": "k-pop",
      "labelJa": "K-POP",
      "detailAnswer": "aespa",
      "canChange": true,
      "levels": [
        {
          "id": "9b261b7a-e366-4fe7-9126-26319ada5e96",
          "code": "beginner",
          "title": "初級",
          "orderNo": 1,
          "requiredAccuracy": 80,
          "isUnlocked": true,
          "unlockedAt": null,
          "startedAt": null,
          "completedAt": null,
          "passedAt": null,
          "completedLessonCount": 0,
          "passedLessonCount": 0,
          "lessonCount": 5,
          "lessons": [
            {
              "id": "07305c4e-702f-48b5-849c-0659fed44c75",
              "title": "基本単語",
              "themeType": "basic-vocabulary",
              "orderNo": 1,
              "questionCount": 10,
              "status": "available",
              "startedAt": null,
              "completedAt": null,
              "completedCount": 0,
              "bestAccuracy": null,
              "isPassed": false
            }
          ]
        }
      ]
    }
  ]
}
```

### 状態・数値・日時

- `status` は完了済みなら `completed`、開始済み未完了なら `in_progress`。
- 未開始レッスンは、級が解放済みかつ級内の先頭または直前レッスン完了後なら `available`、それ以外は `locked`。
- 初級は進捗行がなくても解放済み。保存されていない `unlockedAt` は `null` とし、GETで日時を補完しない。
- 中級・上級は保存済みの解放記録に従う。合格数が5でもGETでは次級を解放しない。
- 合格基準は級開始時のスナップショットを優先し、未保存なら級マスタの値を使う。
- `isPassed` は完了済み最高成績がその級の基準以上かを示す。級平均ではなく、各レッスンを判定する。
- `passedLessonCount` は合格したレッスンの件数。次級解放の保存は全5レッスン合格を条件とする後続の完了APIで扱う。
- 未完了レッスンの `bestAccuracy` は `null`。完了成績の0%は数値の `0` として区別する。
- DecimalはJSONの数値、日時はISO 8601文字列または `null` へ変換する。
- `canChange` はそのジャンルに開始済み・未完了の級があれば `false`。完了済み級の復習では再制限しない。
- `canChange` は表示用フラグ。興味保存APIでの変更拒否は後続実装であり、このGETが変更を禁止するわけではない。

## エラー

[共通エラー仕様](./api-error-response.md)の `statusCode`、`error`、`message`、`details`、`path`、`timestamp` を返す。
このAPIのエラーは特定入力項目に紐づかないため、`details` は空配列。

| HTTP | 条件 |
| --- | --- |
| 401 | JWTなし、不正な形式・署名、期限切れ |
| 404 | 有効なJWTのユーザーが既に存在しない |
| 500 | 必須の級・レッスンの欠落、順序・問題数などの構成不備、その他のサーバーエラー |

500は例外ログにも出力する。認証失敗を空一覧として返したり、マスタ不備を架空のデータで補完したりしない。

## 確認手順

1. `backend` で `npm run build` と `npm test -- --runInBand` を実行する。
2. DBを変更しないHTTPテストを `npm run test:e2e -- --runInBand learning.e2e-spec.ts` で実行する。
3. PostgreSQLを起動し、`npm run start:dev` でバックエンドを起動する。
4. Postmanでサインインし、有効なJWT付きGETが200で本人の選択興味・3級15レッスンを返すことを確認する。
5. 興味未登録の確認用ユーザーで200と空配列を確認する。
6. 認証なし・不正トークンで共通401を確認する。

HTTP自動テストは実際のJWTガード・Controller・Service・例外フィルターを使い、Prismaのみモックする。実DBの選択情報・seedとの接続はPostmanで確認する。ユーザー・ジャンルごとのクエリ条件、初期状態、興味変更可否、マスタ不備、繰り返し取得を検証する。

## 後続対応

- ホーム画面のAPI接続とジャンル別ロードマップ。
- 興味保存APIにおける開始済み未完了級の変更制限。
- 固定問題の生成・学習開始・回答一括保存・採点・進捗更新。
- PoCでは使用開始済みの興味・レッスンを無効化せず、履歴の親データを保持する。
