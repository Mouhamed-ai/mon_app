import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { credentialsSchema } from "@/lib/validators/auth";
export async function POST(request:Request){const parsed=credentialsSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Données invalides",details:parsed.error.flatten()},{status:400});const {email,password,name}=parsed.data;const exists=await db.user.findUnique({where:{email}});if(exists)return NextResponse.json({error:"Cet e-mail est déjà utilisé"},{status:409});const user=await db.user.create({data:{email,name,passwordHash:await bcrypt.hash(password,12)}});return NextResponse.json({user:{id:user.id,email:user.email,name:user.name},token:await signToken(user.id)},{status:201});}
