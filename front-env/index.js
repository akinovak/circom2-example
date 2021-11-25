require('isomorphic-fetch');

const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const ZqField = require("ffjavascript").ZqField
export const Fq = new ZqField(SNARK_FIELD_SIZE)
const { poseidon } = require("circomlibjs")
const { genProof, verifyProof } = require('../src');

const wasmFilePath = 'http://localhost:8000/circuit.wasm';
const finalZkeyPath = 'http://localhost:8000/circuit_final.zkey';
const vkeyPath = 'http://localhost:8000/verification_key.json';

// console.log(window !== 'undefined')

const preimage = Fq.random();
const hash = poseidon([preimage]);

console.log(hash)

const grothInput = {
    preimage
};

(async () => {

    const fullProof = await genProof(grothInput, wasmFilePath, finalZkeyPath);

    const resp = await fetch(vkeyPath);
    const text = await resp.text();
    const vKey = JSON.parse(text)

    const res = await verifyProof(vKey, fullProof);
})()