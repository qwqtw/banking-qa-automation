import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

type Account = {
  id: number;
  owner: string;
  balance: number;
};

type Transaction = {
  id: number;
  accountId: number;
  amount: number;
  type: string;
};

let accounts: Account[] = [
  {
    id: 1,
    owner: 'Chromium Test User',
    balance: 1000
  },
  {
    id: 2,
    owner: 'Firefox Test User',
    balance: 1000
  },
  {
    id: 3,
    owner: 'WebKit Test User',
    balance: 1000
  }
];

let transactions: Transaction[] = [];

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

app.post('/test/reset', (_req, res) => {
  accounts = [
    {
      id: 1,
      owner: 'Autumn Wang',
      balance: 1000
    }
  ];

  transactions = [];

  res.status(200).json({
    message: 'Test data reset successfully'
  });
});

app.listen(3001, () => {
  console.log('Mock banking API running on http://localhost:3001');
});

app.post('/test/reset/:id', (req, res) => {
  const accountId = Number(req.params.id);

  const account = accounts.find(
    account => account.id === accountId
  );

  if (!account) {
    return res.status(404).json({
      message: 'Account not found'
    });
  }

  account.balance = 1000;

  transactions = transactions.filter(
    transaction => transaction.accountId !== accountId
  );

  res.status(200).json({
    message: `Account ${accountId} reset successfully`
  });
});

let nextAccountId = 100;

app.post('/test/accounts', (req, res) => {
  const {
    owner = 'Automation Test User',
    balance = 1000
  } = req.body;

  const account = {
    id: nextAccountId++,
    owner,
    balance
  };

  accounts.push(account);

  res.status(201).json(account);
});