-- CreateTable
CREATE TABLE "interests" (
    "id" UUID NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "label_ja" VARCHAR(100) NOT NULL,
    "label_ko" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interests_key_key" ON "interests"("key");
