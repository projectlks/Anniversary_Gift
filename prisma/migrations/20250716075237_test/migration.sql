-- CreateTable
CREATE TABLE "Menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER DEFAULT 0,

    CONSTRAINT "Menus_pkey" PRIMARY KEY ("id")
);
