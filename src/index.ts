const { groth16 } = require("snarkjs")
import * as fs from "fs";
import { builder } from "./witness_calculator";

const genWnts = async(input: any, wasmFilePath: string, witnessFileName: string) => {
    const buffer = fs.readFileSync(wasmFilePath);

    return new Promise((resolve, reject) => {
        builder(buffer)
        .then(async witnessCalculator => {
            const buff= await witnessCalculator.calculateWTNSBin(input, 0);
            fs.writeFileSync(witnessFileName, buff);
            resolve(witnessFileName);
        }).catch((error) => {
            reject(error);
        });
    })
}

export const genProof = async (grothInput: any, wasmFilePath: string, finalZkeyPath: string) => {
    await genWnts(grothInput, wasmFilePath, 'witness.wtns');
    const { proof, publicSignals } = await groth16.prove(finalZkeyPath, 'witness.wtns', null);
    const exists = fs.existsSync('witness.wtns');
    if(exists) fs.unlinkSync('witness.wtns');
    return { proof, publicSignals };
}

export const verifyProof = (vKey: string, fullProof: any) => {
    const { proof, publicSignals } = fullProof
    return groth16.verify(vKey, publicSignals, proof)
}


