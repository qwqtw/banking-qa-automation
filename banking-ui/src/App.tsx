import { useEffect, useState } from 'react';

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

function App() {
  const params = new URLSearchParams(window.location.search);

const accountId =
  Number(params.get('accountId')) || 1;
  
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState('');

  const loadAccount = async () => {
    const response = await fetch(`http://localhost:3001/accounts/${accountId}`);
    const data = await response.json();
    setAccount(data);
  };

  const loadTransactions = async () => {
  const response = await fetch(
    'http://localhost:3001/transactions'
  );

  const data = await response.json();

  const accountTransactions = data.filter(
    (transaction: Transaction) =>
      transaction.accountId === accountId
  );

  setTransactions(accountTransactions);
};

  useEffect(() => {
    loadAccount();
    loadTransactions();
  }, []);

  const handleTransfer = async () => {
    setMessage('');

    const numericAmount = Number(amount);

    const response = await fetch('http://localhost:3001/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId,
        amount: numericAmount,
      }),
    });

    const body = await response.json();

    if (!response.ok) {
      setMessage(body.message ?? 'Transfer failed');
      return;
    }

    setMessage('Transfer successful');

    await loadAccount();
    await loadTransactions();

    setAmount('');
  };

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <main style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Banking Dashboard</h1>

      <section>
        <h2>Account</h2>

        <p data-testid="account-owner">
          Owner: {account.owner}
        </p>

        <p data-testid="account-balance">
          Balance: ${account.balance}
        </p>
      </section>

      <section>
        <h2>Transfer Funds</h2>

        <label htmlFor="transfer-amount">
          Transfer Amount
        </label>

        <input
          id="transfer-amount"
          data-testid="transfer-amount"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <button
          data-testid="transfer-button"
          onClick={handleTransfer}
        >
          Transfer
        </button>

        {message && (
          <p data-testid="transfer-message">
            {message}
          </p>
        )}
      </section>

      <section>
        <h2>Transaction History</h2>

        <ul data-testid="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              Transaction #{transaction.id} — ${transaction.amount} — {transaction.type}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;