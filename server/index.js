import express, { json } from "express";
const app = express();
import cors from "cors";
const port = 3042;

app.use(cors());
app.use(json());

const balances = {
  "430782db06eedab92d877e16170effab9f97ae1d98a8ec50ea9d051d33583051": 100,
  "03202cdde3896c31c8a9c1780458dacb8821a25f2a67200111e57a27a26cec7942": 50,
  "021bf350d46a824904cfbb91819305f01a5c86670a3a7f17f53398249f60b2dec4": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client - side application
  // recover the public key from the signature
  const { sender, recipient, amount } = req.body;

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
