import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workerDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(workerDirectory, "../..");
const outputDirectory = resolve(projectDirectory, ".pages-dist");
const expectedOutputDirectory = resolve(projectDirectory, ".pages-dist");

if (outputDirectory !== expectedOutputDirectory || !outputDirectory.startsWith(projectDirectory)) {
    throw new Error("Refusing to build outside the project output directory.");
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of ["index.html", "profesores.html", "puntajes.html", "simulacros.html", "manifest.webmanifest", "service-worker.js"]) {
    await cp(resolve(projectDirectory, file), resolve(outputDirectory, file));
}

await cp(resolve(projectDirectory, "assets"), resolve(outputDirectory, "assets"), { recursive: true });
console.log(`Static site prepared at ${outputDirectory}`);
