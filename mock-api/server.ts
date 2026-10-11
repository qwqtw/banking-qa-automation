import express from 'express';

const app = express();

app.use(express.json());

let accounts = [
  {
    id: 1,
    owner: 'Autumn Wang',
    balance: 1000
  }
];

let transactions: any[] = [];

app.get('/accounts/:id', (req, res) => {
  const account = accounts.find(
    a => a.id === Number(req.params.id)
  );

  if (!account) {
    return res.status(404).json({
      message: 'Account not found'
    });
  }

  res.json(account);
});

app.post('/transfers', (req, res) => {
  const { accountId, amount } = req.body;

  const account = accounts.find(
    a => a.id === Number(accountId)
  );

  if (!account) {
    return res.status(404).json({
      message: 'Account not found'
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: 'Invalid transfer amount'
    });
  }

  if (account.balance < amount) {
    return res.status(400).json({
      message: 'Insufficient funds'
    });
  }

  account.balance -= amount;

  const transaction = {
    id: transactions.length + 1,
    accountId,
    amount,
    type: 'debit'
  };

  transactions.push(transaction);

  res.status(201).json(transaction);
});

app.get('/transactions', (_req, res) => {
  res.json(transactions);
});

app.listen(3001, () => {
  console.log('Mock banking API running on http://localhost:3001');
});