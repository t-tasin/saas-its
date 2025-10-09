-- AlterTable
ALTER TABLE "identity"."User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "identity"."OTP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OTP_userId_idx" ON "identity"."OTP"("userId");

-- CreateIndex
CREATE INDEX "OTP_code_idx" ON "identity"."OTP"("code");

-- AddForeignKey
ALTER TABLE "identity"."OTP" ADD CONSTRAINT "OTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

