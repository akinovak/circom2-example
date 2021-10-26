cd "$(dirname "$0")"

mkdir -p ../build
mkdir -p ../zkFiles

cd ../build

if [ -f ./powersOfTau28_hez_final_14.ptau ]; then
    echo "powersOfTau28_hez_final_14.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_14.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_14.ptau
fi

circom ../circuits/circuit.circom --r1cs --wasm --sym

npx snarkjs groth16 setup circuit.r1cs powersOfTau28_hez_final_14.ptau circuit_0000.zkey

npx snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="Frist contribution" -v -e="Random entropy"
npx snarkjs zkey contribute circuit_0001.zkey circuit_0002.zkey --name="Second contribution" -v -e="Another random entropy"
npx snarkjs zkey beacon circuit_0002.zkey circuit_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"

npx snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

cp verification_key.json ../zkFiles/verification_key.json
cp circuit_js/circuit.wasm ../zkFiles/circuit.wasm
cp circuit_final.zkey ../zkFiles/circuit_final.zkey