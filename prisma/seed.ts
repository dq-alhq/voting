import {faker} from "@faker-js/faker";
import {prisma} from "@/lib/prisma";
import {seedAccount} from "@/prisma/seed-account";

async function main() {
    console.log("🌱 Seeding database...");

    // --- 1. Buat admin
    await seedAccount();

    // --- 3. Buat event election
    const election = await prisma.election.create({
        data: {
            title: "Pemilihan Ketua HMTI 2025",
            description:
                "Pemilihan Ketua Himpunan Mahasiswa Teknik Industri Periode 2025-2026",
            startAt: new Date(Date.now() - 1000 * 60 * 60), // sudah dimulai
            endAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // berakhir besok
        },
    });

    // --- 4. Buat kandidat
    await prisma.$transaction(
        ["Santoso", "Wito", "Sri"].map((name) =>
            prisma.candidate.create({
                data: {
                    name,
                    visi: `Visi ${name} untuk masa depan organisasi.`,
                    misi: `Misi ${name}: meningkatkan kualitas dan kebersamaan.`,
                    photo: faker.image.avatar(),
                    electionId: election.id,
                },
            }),
        ),
    );

    console.log(`✅ Done!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
