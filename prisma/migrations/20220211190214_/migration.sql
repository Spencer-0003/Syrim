-- CreateTable
CREATE TABLE "Command" (
    "commandId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "response" TEXT NOT NULL,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("commandId")
)