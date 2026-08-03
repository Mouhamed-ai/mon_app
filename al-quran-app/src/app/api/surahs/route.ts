import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET(){const data=await db.surah.findMany({orderBy:{id:"asc"},include:{_count:{select:{ayahs:true}}}});return NextResponse.json(data);}
