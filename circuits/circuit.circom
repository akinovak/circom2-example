pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template SimpleHasher() {
    signal input preimage;
    signal output hash;

    component hasher = Poseidon(1);
    hasher.inputs[0] <== preimage;
    
    hash <== hasher.out;
}

component main = SimpleHasher();