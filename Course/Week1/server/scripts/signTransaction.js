const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes,hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const privateKey = process.argv[2];

console.log('private key:', privateKey);
const message = process.argv[3];
console.log('public key:', toHex(secp.getPublicKey(privateKey,1)));

const messageHash = keccak256(utf8ToBytes(message));
(async () => {
    const signature = await secp.sign(messageHash, privateKey);
    console.log('signature key:', toHex(signature));
    console.log('signature bytes:', hexToBytes(toHex(signature)));

    var pk = secp.recoverPublicKey(messageHash, signature, 1,true);
    console.log('public key:', toHex(pk));
})();
