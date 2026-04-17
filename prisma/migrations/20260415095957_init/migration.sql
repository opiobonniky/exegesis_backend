/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Watchlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_userId_fkey";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Watchlist";

-- DropEnum
DROP TYPE "WatchlistStatus";

-- CreateTable
CREATE TABLE "system_users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "marital_status" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "alternative_phone" TEXT,
    "address_id" INTEGER,
    "ministry_group" TEXT,
    "service_position" TEXT,
    "spiritual_gifts" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "emergency_contact_relationship" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_photo_url" TEXT,
    "login_count" BIGINT NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_logged_in" BOOLEAN NOT NULL DEFAULT false,
    "session_id" TEXT,
    "user_role" BIGINT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "system_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" BIGSERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_description" TEXT NOT NULL,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "logged_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logged_out_at" TIMESTAMP(3),
    "success" BOOLEAN NOT NULL DEFAULT true,
    "failure_reason" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "browser_name" TEXT,
    "os" TEXT,
    "device_type" TEXT,
    "device_name" TEXT,
    "engine" TEXT,
    "locale" TEXT,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "verification_type" TEXT NOT NULL,
    "email_address" TEXT,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_verse" (
    "id" BIGSERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "chapter" BIGINT NOT NULL,
    "verse_number" BIGINT NOT NULL,
    "display_date" TIMESTAMP(3) NOT NULL,
    "display_time" TIMESTAMP(3),
    "reflection" TEXT,
    "created_by" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "daily_verse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "read_history" (
    "id" BIGSERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "chapter" BIGINT NOT NULL,
    "verse_number" BIGINT NOT NULL,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "read_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" BIGSERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "chapter" BIGINT NOT NULL,
    "verse_number" BIGINT NOT NULL,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "high_lights" (
    "id" BIGSERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "chapter" BIGINT NOT NULL,
    "verse_number" BIGINT NOT NULL,
    "color_id" BIGINT NOT NULL,
    "note" TEXT,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "high_lights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" BIGSERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "chapter" BIGINT NOT NULL,
    "verse_number" BIGINT NOT NULL,
    "note" TEXT,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verse_explanations" (
    "id" BIGSERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "chapter" BIGINT NOT NULL,
    "verse_number" BIGINT NOT NULL,
    "explanation" TEXT,
    "learn_more" TEXT,
    "bible_version" TEXT,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "verse_explanations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "attachment" TEXT,
    "attachment_two" TEXT,
    "send_count" BIGINT NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sent_on" TIMESTAMP(3),
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_plans" (
    "id" BIGSERIAL NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_days" INTEGER NOT NULL,
    "questions_enabled" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "difficulty" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "reading_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_assignments" (
    "id" BIGSERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" TEXT,
    "chapters_json" TEXT NOT NULL,
    "reflection_questions" TEXT,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "daily_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" BIGSERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options_json" TEXT NOT NULL,
    "correct_answer" INTEGER NOT NULL,
    "explanation" TEXT,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_plan_progress" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "completed_days_json" TEXT,
    "last_completed_date" TIMESTAMP(3),
    "streak" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_date" TIMESTAMP(3),
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),

    CONSTRAINT "user_plan_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quiz_answers" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "question_id" BIGINT NOT NULL,
    "user_answer" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_by" TEXT,
    "created_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "updated_on" TIMESTAMP(3),
    "number_attempt" INTEGER,

    CONSTRAINT "user_quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_users_email_key" ON "system_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_username_key" ON "system_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "role_role_name_key" ON "role"("role_name");

-- CreateIndex
CREATE INDEX "activity_user_id_idx" ON "activity"("user_id");

-- CreateIndex
CREATE INDEX "activity_logged_in_at_idx" ON "activity"("logged_in_at");

-- CreateIndex
CREATE INDEX "activity_ip_idx" ON "activity"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "read_history_created_by_book_name_chapter_verse_number_key" ON "read_history"("created_by", "book_name", "chapter", "verse_number");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_created_by_book_name_chapter_verse_number_key" ON "favorite"("created_by", "book_name", "chapter", "verse_number");

-- CreateIndex
CREATE UNIQUE INDEX "note_created_by_book_name_chapter_verse_number_key" ON "note"("created_by", "book_name", "chapter", "verse_number");

-- CreateIndex
CREATE UNIQUE INDEX "verse_explanations_book_name_chapter_verse_number_key" ON "verse_explanations"("book_name", "chapter", "verse_number");

-- CreateIndex
CREATE UNIQUE INDEX "reading_plans_planId_key" ON "reading_plans"("planId");

-- CreateIndex
CREATE INDEX "daily_assignments_plan_id_idx" ON "daily_assignments"("plan_id");

-- CreateIndex
CREATE INDEX "quiz_questions_plan_id_idx" ON "quiz_questions"("plan_id");

-- CreateIndex
CREATE INDEX "user_plan_progress_user_id_idx" ON "user_plan_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_plan_progress_plan_id_idx" ON "user_plan_progress"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_plan_progress_user_id_plan_id_key" ON "user_plan_progress"("user_id", "plan_id");

-- CreateIndex
CREATE INDEX "user_quiz_answers_user_id_idx" ON "user_quiz_answers"("user_id");

-- CreateIndex
CREATE INDEX "user_quiz_answers_plan_id_idx" ON "user_quiz_answers"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_answers_user_id_question_id_key" ON "user_quiz_answers"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_history" ADD CONSTRAINT "read_history_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "high_lights" ADD CONSTRAINT "high_lights_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_assignments" ADD CONSTRAINT "daily_assignments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "reading_plans"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "reading_plans"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_plan_progress" ADD CONSTRAINT "user_plan_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_plan_progress" ADD CONSTRAINT "user_plan_progress_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "reading_plans"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "user_quiz_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
