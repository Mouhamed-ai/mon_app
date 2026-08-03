import { spawnSync } from "node:child_process";

// A neutral URL lets Vercel build the public experience before PostgreSQL is connected.
// Production always overrides it with DATABASE_URL in Vercel's environment variables.
process.env.DATABASE_URL ??= "postgresql://placeholder:placeholder@localhost:5432/placeholder";

for (const command of [["npx", ["prisma", "generate"]], ["npx", ["next", "build"]]]) {
  const result = spawnSync(command[0], command[1], { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
