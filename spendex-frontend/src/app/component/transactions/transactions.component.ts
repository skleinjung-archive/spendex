import {Component, Input, OnInit} from '@angular/core';
import {TransactionService} from "../../service/transaction.service";
import {Transaction} from "../../model/transaction";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/delay";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  private static KEY_ENTER = 13;
  private static KEY_ESCAPE = 27;
  private static KEY_DOWN_ARROW = 40;
  private static KEY_UP_ARROW = 38;

  @Input() sortColumn: string;
  @Input() descending: boolean;
  @Input() selectedMonth: number;
  @Input() selectedYear: number;

  constructor(
    private transactionService: TransactionService,
  ) {
    this.sortColumn = 'date';
    this.descending = false;
    this.selectedMonth = this.getCurrentMonth();
    this.selectedYear = this.getCurrentYear();
  }

  loading: boolean;
  transactions: Transaction[];

  ngOnInit(): void {
    this.getTransactions();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.descending = !this.descending;
    } else {
      this.sortColumn = column;
      this.descending = false;
    }

    this.getTransactions();
  }

  beginEditing(transaction: Transaction, input: HTMLInputElement) {
    transaction.editing = true;
    transaction.originalCategory = transaction.category;

    setTimeout(() =>{
      input.select();
      input.focus();
    }, 50);
  }

  save(transaction: Transaction) {
    transaction.editing = false;
  }

  cancelEditing(transaction: Transaction) {
    transaction.editing = false;
    transaction.category = transaction.originalCategory;
    transaction.originalCategory = null;
  }

  onKeyUp(event: KeyboardEvent, transaction: Transaction) {
    if (TransactionsComponent.KEY_ENTER === event.which) {
      this.save(transaction);
      this.moveToNextTransaction(transaction);
    } else if (TransactionsComponent.KEY_ESCAPE === event.which) {
      this.cancelEditing(transaction);
    } else if (TransactionsComponent.KEY_UP_ARROW === event.which) {
      this.cancelEditing(transaction);
      this.moveToPreviousTransaction(transaction);
    } else if (TransactionsComponent.KEY_DOWN_ARROW === event.which) {
      this.cancelEditing(transaction);
      this.moveToNextTransaction(transaction);
    }
  }

  getYears(): number[] {
    const result = [];
    for (let i = 2017; i <= this.getCurrentYear(); i++) {
      result.push(i);
    }

    return result;
  }

  getCurrentMonth(): number {
    return new Date().getMonth();
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  private getTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions(this.selectedMonth, this.selectedYear, this.sortColumn, this.descending)
      .finally(() => this.loading = false)
      .subscribe(transactions => this.transactions = transactions)
  }

  private moveToPreviousTransaction(transaction: Transaction) {
    const previousTransaction = this.findPreviousTransaction(transaction);
    this.beginEditing(previousTransaction, this.findCategoryInputForTransaction(previousTransaction));
  }

  private moveToNextTransaction(transaction: Transaction) {
    const nextTransaction = this.findNextTransaction(transaction);
    this.beginEditing(nextTransaction, this.findCategoryInputForTransaction(nextTransaction));
  }

  private findPreviousTransaction(transaction: Transaction): Transaction {
    let foundIndex = this.getTransactionIndex(transaction);

    let previousIndex = foundIndex - 1;
    if (previousIndex == -1) {
      previousIndex = this.transactions.length - 1;
    }
    return previousIndex < 0 ? null : this.transactions[previousIndex % this.transactions.length];
  }

  private findNextTransaction(transaction: Transaction): Transaction {
    let foundIndex = this.getTransactionIndex(transaction);
    return foundIndex === -1 ? null : this.transactions[(foundIndex + 1) % this.transactions.length];
  }

  private getTransactionIndex(transaction: Transaction): number {
    let foundIndex = -1;
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i] === transaction) {
        foundIndex = i;
        break;
      }
    }
    return foundIndex;
  }

  private findCategoryInputForTransaction(transaction: Transaction): HTMLInputElement {
    return <HTMLInputElement>document.getElementById('category-' + transaction.id);
  }


}
