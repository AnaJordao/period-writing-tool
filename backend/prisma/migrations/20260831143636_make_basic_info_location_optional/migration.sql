-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_basicInfoId_fkey";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "basicInfoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_basicInfoId_fkey" FOREIGN KEY ("basicInfoId") REFERENCES "LocationBasicInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
