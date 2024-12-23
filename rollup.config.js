import { terser } from "rollup-plugin-terser"; // 코드 압축
import { visualizer } from "rollup-plugin-visualizer";

export default {
    input: "dist/index.js",
    output: [
        {
            file: "dist/duice.js",
            format: "iife",
            name: "duice",
            sourcemap: true,
        },
        {
            file: "dist/duice.min.js",
            format: "iife",
            name: "duice",
            plugins: [terser()],
            sourcemap: true,
        }
    ],
    plugins: [
        visualizer({
            filename: "./dist/bundle-analysis.html"
        })
    ],
};