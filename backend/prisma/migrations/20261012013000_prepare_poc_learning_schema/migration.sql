BEGIN;

-- 完了日時・回数はカラム名だけを変更して既存値を保持する。
ALTER TABLE "lesson_progress" RENAME COLUMN "cleared_at" TO "completed_at";
ALTER TABLE "lesson_progress" RENAME COLUMN "clear_count" TO "completed_count";

-- DropForeignKey
ALTER TABLE "generated_question_batches" DROP CONSTRAINT "generated_question_batches_interest_id_fkey";

-- AlterTable
ALTER TABLE "generated_question_batches" ADD COLUMN     "detail_answer_snapshot" VARCHAR(255) NOT NULL,
ADD COLUMN     "lesson_id" UUID NOT NULL,
ALTER COLUMN "interest_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "lesson_progress" DROP CONSTRAINT "lesson_progress_pkey",
ADD COLUMN     "generated_batch_id" UUID,
ADD COLUMN     "interest_id" UUID NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3),
ALTER COLUMN "best_accuracy" SET DATA TYPE DECIMAL(6,3),
ADD CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("user_id", "interest_id", "lesson_id");

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "question_count" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "levels" ADD COLUMN     "required_accuracy" DECIMAL(5,2) NOT NULL DEFAULT 80.00;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "order_no" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "typing_sessions" ADD COLUMN     "generated_batch_id" UUID NOT NULL,
ADD COLUMN     "scoring_version" VARCHAR(50) NOT NULL DEFAULT 'levenshtein-nfc-v1',
ADD COLUMN     "session_accuracy" DECIMAL(6,3);

-- CreateTable
CREATE TABLE "user_level_progress" (
    "user_id" UUID NOT NULL,
    "interest_id" UUID NOT NULL,
    "level_id" UUID NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "passed_at" TIMESTAMP(3),
    "detail_answer_snapshot" VARCHAR(255),
    "required_accuracy_snapshot" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_level_progress_pkey" PRIMARY KEY ("user_id","interest_id","level_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lessons_level_id_order_no_key" ON "lessons"("level_id", "order_no");

-- CreateIndex
CREATE UNIQUE INDEX "questions_generated_batch_id_order_no_key" ON "questions"("generated_batch_id", "order_no");

-- CreateIndex
CREATE UNIQUE INDEX "typing_attempts_session_id_question_id_key" ON "typing_attempts"("session_id", "question_id");

-- 成功した問題セットは1件に限定し、失敗・再試行の履歴は複数保存できる。
CREATE UNIQUE INDEX "generated_question_batches_succeeded_set_key"
ON "generated_question_batches"("user_id", "interest_id", "lesson_id")
WHERE "status" = 'succeeded';

-- 未完了の挑戦は1件に限定し、完了後の再挑戦は別セッションで保存できる。
CREATE UNIQUE INDEX "typing_sessions_unfinished_batch_key"
ON "typing_sessions"("user_id", "generated_batch_id")
WHERE "completed_at" IS NULL;

-- AddForeignKey
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typing_sessions" ADD CONSTRAINT "typing_sessions_generated_batch_id_fkey" FOREIGN KEY ("generated_batch_id") REFERENCES "generated_question_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_generated_batch_id_fkey" FOREIGN KEY ("generated_batch_id") REFERENCES "generated_question_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_question_batches" ADD CONSTRAINT "generated_question_batches_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_question_batches" ADD CONSTRAINT "generated_question_batches_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
