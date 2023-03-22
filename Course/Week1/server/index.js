const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/Keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
    "027ce17f7ab058c703f478dc2897a461e6035b9a09380b35af2868c154e912651e": 100,
    "02c5cfccfdd7c8867aa4ace823d263a45e5d083c18e0bf2cf06d69c1e1ab378a53": 50,
    "043b380e894b4448ee21c258267b3f885ceae6ffcf9041e0b3bbb7e8f3f024f4702682e1dd36cc4bb70193187839bd776093ae8f1068345c78847d913294061fbe": 75,
};

app.get("/balance/:signature", (req, res) => {
    const { signature } = req.params;
    const hashMessage = keccak256(utils.utf8ToBytes(""));
    const address = utils.toHex(secp.recoverPublicKey(hashMessage, signature,1));
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { signature, recipient, amount } = req.body;
    const hashMessage = sha256(utils.utf8ToBytes(recipient + amount));
    const sender = secp.recoverPublicKey(hashMessage, signature);
    if (sender === null)
        return;
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
