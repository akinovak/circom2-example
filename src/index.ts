const { groth16 } = require("snarkjs")
import * as fs from "fs";
import { builder } from "./witness_calculator";

const genWnts = async(input: any, wasmFilePath: string): Promise<any> => {
    let wntsBuff: ArrayBuffer;
    //window exists only in browser
    if(typeof window !== 'undefined') {
        const resp = await fetch(wasmFilePath);
        wntsBuff = await resp.arrayBuffer();
    } else {
        wntsBuff = fs.readFileSync(wasmFilePath);
    }

    return new Promise((resolve, reject) => {
        builder(wntsBuff)
        .then(async witnessCalculator => {
            const buff = await witnessCalculator.calculateWTNSBin(input, 0);
            resolve(buff);
        }).catch((error) => {
            reject(error);
        });
    })
}

export const genProof = async (grothInput: any, wasmFilePath: string, finalZkeyPath: string) => {
    let zkeyBuff: ArrayBuffer;
    const wtnsBuff = await genWnts(grothInput, wasmFilePath);
    //window exists only in browser
    if(typeof window !== 'undefined') {
        const resp = await fetch(finalZkeyPath);
        zkeyBuff = await resp.arrayBuffer();
    } else {
        zkeyBuff = fs.readFileSync(finalZkeyPath);
    }

    const { proof, publicSignals } = await groth16.prove(new Uint8Array(zkeyBuff), wtnsBuff, null);
    return { proof, publicSignals };
}

export const verifyProof = (vKey: string, fullProof: any) => {
    const { proof, publicSignals } = fullProof
    return groth16.verify(vKey, publicSignals, proof)
}


// const genWnts_browser = async(input: any, wasmFilePath: string, witnessFileName: string): Promise<Uint8Array> => {
//     const resp = await fetch(wasmFilePath);
//     const buffer = await resp.arrayBuffer();

//     return new Promise((resolve, reject) => {
//         builder(buffer)
//         .then(async witnessCalculator => {
//             const buff= await witnessCalculator.calculateWTNSBin(input, 0);
//             resolve(buff);
//         }).catch((error) => {
//             reject(error);
//         });
//     })
// }

// export const genProof_browser = async (grothInput: any, wasmFilePath: string, finalZkeyPath: string) => {
//     const wntsBuff = await genWnts_browser(grothInput, wasmFilePath, 'witness.wtns');
//     const resp = await fetch(finalZkeyPath);
//     const arrayBuffer = await resp.arrayBuffer();

//     const { proof, publicSignals } = await groth16.prove(new Uint8Array(arrayBuffer), wntsBuff, null);

//     return { proof, publicSignals };
// }

