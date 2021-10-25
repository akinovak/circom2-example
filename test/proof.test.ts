export const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const ZqField = require("ffjavascript").ZqField
export const Fq = new ZqField(SNARK_FIELD_SIZE)
import { genProof } from "../src";
import { poseidon } from "circomlibjs";
import * as fs from "fs";
import * as path from "path";

const preimage: bigint = Fq.random();

const hash = poseidon([preimage]);
console.log(hash);

const wasmFilePath: string = path.join("./zkFiles", "circuit.wasm")
const finalZkeyPath: string = path.join("./zkFiles", "circuit_final.zkey")

// // grothInput: any, wasmFilePath: string, finalZkeyPath: string
const grothInput = {
    preimage
};

describe('Proof test', () => {
    it("Should create proof", async () => {
        const { proof, publicSignals } = await genProof(grothInput, wasmFilePath, finalZkeyPath);
        console.log(proof);
        console.log(publicSignals);
    })
});


