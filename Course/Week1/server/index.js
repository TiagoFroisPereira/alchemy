const fs = require('fs');
const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/Keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

var wallets = LoadSampleWallets();

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = wallets[address].balance || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount } = req.body;
    console.log(req.body);

    if (sender === null || wallets[sender] === null || wallets[sender].signature === null) {
        res.status(400).send({ message: "wallet not found!" });
    } else {
        setInitialBalance(sender);
        setInitialBalance(recipient);
        var balance = wallets[sender].balance;
        if (balance < amount) {
            res.status(400).send({ message: "Not enough funds!" });
        } else {
            wallets[sender].balance -= amount;
            wallets[recipient].balance += amount;
            res.send({ balance: wallets[sender].balance });
        }
    }
});
app.post("/sign", async (req, res) => {
    const { sender, recipient, amount } = req.body;

    var wallet = wallets[sender];
    if (wallet == null) {
        res.status(400).send({ message: "sender not exist" });
    } else {
        const messageHash = keccak256(utf8ToBytes(recipient + amount));
        const signature = await secp.sign(messageHash, hexToBytes(wallet.privateKey));
        wallets[sender].signature = toHex(signature);
        res.send({ signature: wallets[sender].signature });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!wallets[address]) {
        wallets[address] = {
            balance: 0
        };
    }
}

function LoadSampleWallets() {
    if (wallets != null)
        return wallets;
    try {
        const data = fs.readFileSync('../sampleWallets.json', 'utf8');
        wallets = JSON.parse(data);
        return wallets;
    } catch (err) {
        console.error(err);
    }
}
