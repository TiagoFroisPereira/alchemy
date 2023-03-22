const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const privateKey = process.argv0;
const message = process.argv[1];

console.log('private key:', privateKey);
console.log('public key:', toHex(secp.getPublicKey(privateKey)));

const messageHash = keccak256(utf8ToBytes(message));
(async () => {
    const signature = await secp.sign(messageHash, privateKey);
    console.log('signature key:', toHex(signature));

    var pk = secp.recoverPublicKey(messageHash, signature, 1);
    console.log('public key:', toHex(pk));


})();
