import { Page, Locator, expect } from '@playwright/test';

export class BankingPage {
  readonly page: Page;

  readonly balance: Locator;
  readonly transferAmountInput: Locator;
  readonly transferButton: Locator;
  readonly transferMessage: Locator;
  readonly transactionList: Locator;

  constructor(page: Page) {
    this.page = page;

    this.balance = page.getByTestId('account-balance');
    this.transferAmountInput = page.getByTestId('transfer-amount');
    this.transferButton = page.getByTestId('transfer-button');
    this.transferMessage = page.getByTestId('transfer-message');
    this.transactionList = page.getByTestId('transaction-list');
  }

  async goto(accountId: number) {
  await this.page.goto(
    `http://localhost:5173?accountId=${accountId}`
  );
}

  async transfer(amount: number) {
    await this.transferAmountInput.fill(String(amount));
    await this.transferButton.click();
  }

  async verifyTransferSuccessful() {
    await expect(this.transferMessage)
      .toHaveText('Transfer successful');
  }

  async verifyBalance(expectedBalance: number) {
    await expect(this.balance)
      .toHaveText(`Balance: $${expectedBalance}`);
  }

  async verifyTransactionVisible(amount: number) {
    await expect(this.transactionList)
      .toContainText(`$${amount}`);
  }
}