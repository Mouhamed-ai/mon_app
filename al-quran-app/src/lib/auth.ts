import { SignJWT, jwtVerify } from "jose";
const key = new TextEncoder().encode(process.env.JWT_SECRET);
export async function signToken(userId:string){ if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET manquant"); return new SignJWT({sub:userId}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key); }
export async function verifyToken(token:string){ return jwtVerify(token,key); }
