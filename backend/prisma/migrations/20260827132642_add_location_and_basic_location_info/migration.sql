-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "basicInfoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationBasicInfo" (
    "id" TEXT NOT NULL,
    "dimensions" TEXT,
    "area" DOUBLE PRECISION,
    "condition" TEXT,
    "inhabitants" TEXT[],
    "population" INTEGER,
    "items" TEXT[],
    "militaryStrength" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LocationBasicInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_basicInfoId_key" ON "Location"("basicInfoId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_basicInfoId_fkey" FOREIGN KEY ("basicInfoId") REFERENCES "LocationBasicInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
