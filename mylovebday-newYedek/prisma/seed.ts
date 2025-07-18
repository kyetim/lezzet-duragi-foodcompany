import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Etkinlik seed işlemi kaldırıldı, tablo boş olacak
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 