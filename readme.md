# ton-contract-verifier

A UI app to display verified contract proofs and to submit Ton smart contract sources for on-chain verification.

## Related repositories

This repo is a part of the following:

1. [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) - Sources registry contracts which stores an on-chain proof per code cell hash.
2. contract-verifier-backend (this repo) - Backend for compiling FunC and returning a signature over a message containing the resulting code cell hash.
3. [contract-verifier-sdk](https://github.com/ton-community/contract-verifier-sdk) - A UI component to fetch and display sources from Ton blockchain and IPFS, including FunC code highlighting.
4. [ton-contract-verifier](https://github.com/orbs-network/ton-contract-verifier) - A UI app to interact with the backend, contracts and publish an on-chain proof.

## Deployment

This app is deployed via github actions on github pages for this repository.

### Environment variables

- `VITE_VERIFIER_REGISTRY` - the address of the verifier registry contract to interact with when sending the signed message received from backend
  `VITE_VERIFIER_ID` - id of the verifier registered with the verifier registry
  `VITE_SOURCES_REGISTRY` - sources registry to fetch data from
  `VITE_BACKEND_URL` - url for backend

## Running

- `npm install`
- `npm run dev`

## License

MIT
