import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [isSigned, setIsSigned] = useState(true);

    const setValue = (setter) => (evt) => setter(evt.target.value);
    async function transfer(evt) {
        evt.preventDefault();

        try {
            const {
                data: { balance },
            } = await server.post(`send`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
            });
            setBalance(balance);
            alert("Transfer completed");
        } catch (ex) {
            alert(ex.response.data.message);
        }
    }
    async function sign(evt) {
        evt.preventDefault();

        try {
            await server.post(`sign`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
            });
            setIsSigned(false);
            alert("Transaction Signed");
        } catch (ex) {
            alert(ex.response.data.message);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            {isSigned ?
                <input className="button" value="Sign" onClick={sign} /> :
                <input type="submit" className="button" value="Transfer" />
            }
        </form>
    );
}

export default Transfer;
