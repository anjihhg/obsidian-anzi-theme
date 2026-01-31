import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const targetDir = "/Users/anzi-ms/Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian-anzi/.obsidian/themes/Anzi";
const outFile = "theme.css";
const targetFile = path.join(targetDir, outFile);

const context = await esbuild.context({
  entryPoints: ["src/theme.css"],
  bundle: true,
  outfile: outFile,
  plugins: [
    {
      name: "copy-to-obsidian",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length === 0) {
            try {
              // Ensure destination directory exists (optional, but good practice)
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              
              fs.copyFileSync(outFile, targetFile);
              console.log(`[${new Date().toLocaleTimeString()}] Build successful. Copied to Obsidian vault.`);
            } catch (err) {
              console.error("Error copying file to vault:", err);
            }
          }
        });
      },
    },
  ],
});

await context.watch();
console.log("Watching for changes...");
