-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "corePrompt" TEXT;

-- CreateTable
CREATE TABLE "public"."Interactions" (
    "id" TEXT NOT NULL,
    "userPrompt" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Interactions" ADD CONSTRAINT "Interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
