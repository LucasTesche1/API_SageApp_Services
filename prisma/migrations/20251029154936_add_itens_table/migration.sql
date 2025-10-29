-- CreateTable
CREATE TABLE "public"."Itens" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,

    CONSTRAINT "Itens_pkey" PRIMARY KEY ("id")
);
