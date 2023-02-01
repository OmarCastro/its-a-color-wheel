import { globToRegExp } from "https://deno.land/std@0.175.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.175.0/fs/walk.ts";

for await (const dir of walk("src", {match: [globToRegExp("**/*.spec.ts")], includeDirs:false})){
    console.log("importing "+dir.path)
    await import("./"+dir.path)
}
