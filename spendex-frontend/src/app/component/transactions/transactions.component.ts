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

  getTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions(this.selectedMonth, this.selectedYear, this.sortColumn, this.descending)
      .finally(() => this.loading = false)
      .subscribe(transactions => this.transactions = transactions)
  }
}
