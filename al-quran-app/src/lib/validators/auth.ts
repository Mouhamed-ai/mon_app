import { z } from "zod";
export const credentialsSchema=z.object({email:z.string().email(),password:z.string().min(10).max(128),name:z.string().trim().min(2).max(80).optional()});
