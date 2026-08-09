/*
  Warnings:

  - You are about to drop the column `label_ko` on the `interests` table. All the data in the column will be lost.
  - Added the required column `detail_placeholder_ja` to the `interests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail_question_ja` to the `interests` table without a default value. This is not possible if the table is not empty.

*/

-- 新しい列を一旦NULL許容で追加する
ALTER TABLE "interests"
ADD COLUMN "detail_placeholder_ja" VARCHAR(255),
ADD COLUMN "detail_question_ja" VARCHAR(255);

-- 既存レコード値を設定する
UPDATE "interests"
SET
    "detail_question_ja" = CASE "key"
        WHEN 'k-pop' THEN '好きなアーティスト'
        WHEN 'drama' THEN '好きなドラマ・俳優'
        WHEN 'travel' THEN '行ってみたい韓国の場所'
        WHEN 'food' THEN '好きな韓国料理・食べてみたい料理'
        WHEN 'beauty-fashion' THEN '興味のある韓国ブランド・アイテム'
        WHEN 'daily' THEN '学習したい日常の場面'
        ELSE '興味のある内容'
    END,
    "detail_placeholder_ja" = CASE "key"
        WHEN 'k-pop' THEN '例: NewJeans、BTS'
        WHEN 'drama' THEN '例: 涙の女王、キム・スヒョン'
        WHEN 'travel' THEN '例: ソウル、釜山'
        WHEN 'food' THEN '例: サムギョプサル、トッポッキ'
        WHEN 'beauty-fashion' THEN '例: 韓国コスメ、ストリートファッション'
        WHEN 'daily' THEN '例: カフェ、買い物'
        ELSE '例: 興味のある内容'
    END;

-- 値を設定した後で必須列にする
ALTER TABLE "interests"
ALTER COLUMN "detail_placeholder_ja" SET NOT NULL,
ALTER COLUMN "detail_question_ja" SET NOT NULL,
DROP COLUMN "label_ko";
