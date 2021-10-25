import typescript from "rollup-plugin-typescript2"
import resolve from '@rollup/plugin-node-resolve';
import * as fs from "fs"
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"))

export default {
  input: "src/index.ts",
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  external: Object.keys(pkg.dependencies),
  plugins: [typescript({ useTsconfigDeclarationDir: true }), resolve()]
}
