import { prisma } from "./config/database.js";

async function testDB(): Promise<void> {
    try {
        const result = await prisma.$queryRaw<{now: Date}[]>`SELECT NOW() as now`;
        console.log('Koneksi aman');
        console.log('Waktu server DB saat ini:', result[0]?.now);
    } catch (err: any) {
        console.error('gagal terkoneksi', err.message);
    } finally {
        await prisma.$disconnect;
    }
}

testDB();