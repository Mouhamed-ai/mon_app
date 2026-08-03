import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){ await prisma.surah.upsert({where:{id:1},update:{},create:{id:1,arabicName:"الفاتحة",nameFr:"L’Ouverture",nameEn:"The Opening",transliteration:"Al-Fatihah",versesCount:7,revelationType:"Mecquoise",juzStart:1,ayahs:{create:[{id:1001,numberInSurah:1,arabicText:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",translationFr:"Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.",translationEn:"In the name of Allah, the Entirely Merciful, the Especially Merciful.",transliteration:"Bismi Allahi ar-rahmani ar-rahim."}]}}}); }
main().finally(()=>prisma.$disconnect());
