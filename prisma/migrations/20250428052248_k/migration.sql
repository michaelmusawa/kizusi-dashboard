-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embedding" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "vector" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
