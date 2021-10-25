const { genProof, verifyProof } = require("./dist/bundle");

const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const ZqField = require("ffjavascript").ZqField
const Fq = new ZqField(SNARK_FIELD_SIZE)
const fs = require("fs");
const path = require("path");
const { poseidon } = require("circomlibjs");

const preimage = Fq.random();
const hash = poseidon([preimage]);

const wasmFilePath = path.join("./zkFiles", "circuit.wasm")
const finalZkeyPath = path.join("./zkFiles", "circuit_final.zkey")
const vkeyPath = path.join("./zkFiles", "verification_key.json")
const grothInput = {
    preimage
};

(async () => {
    const fullProof = await genProof(grothInput, wasmFilePath, finalZkeyPath);
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

    const res = await verifyProof(vKey, { proof: fullProof.proof, publicSignals: [hash] });
    console.log('verified: ', res);
    process.exit(0);
})();

