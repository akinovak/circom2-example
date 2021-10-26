# circom2-example

# Overview

Minimal ts example for working with proofs with circom 2.0.0

- The `./scripts` directory includes a build script for the `./circuits/circuit.circom` circuit.
- The `./src/index.ts` file contains all the helper functions needed for generating and verifying proofs.
- The `./bundle-test.js` and the `./test/proof.test.ts` files contain a minimal example on how to generate and verify proofs

# Startup instructions

1. `npm install`
2. `cd scripts`
3. `./scripts/build-circuits.sh`
4. `npm test` or `npm run test:js-bundle`