import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {TransactionService} from "../../service/transaction.service";
import {Transaction} from "../../model/transaction";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/delay";
import {MessageService} from "../../service/message-service";
import {WeekSummary} from "../../model/week-summary";
import {forEach} from "@angular/router/src/utils/collection";
import {Totals} from "../../model/totals";
import {CategorySummary} from "../../model/category-summary";
import {PieChartConfig} from "../../model/pie-chart-config";
import {PieChartComponent} from "../pie-chart/pie-chart.component";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit, AfterViewInit {

  private static KEY_ENTER = 13;
  private static KEY_ESCAPE = 27;
  private static KEY_DOWN_ARROW = 40;
  private static KEY_UP_ARROW = 38;

  @ViewChild(PieChartComponent)
  private categoryPieChart: PieChartComponent;

  @Input() sortColumn: string;
  @Input() descending: boolean;
  @Input() selectedMonth: number;
  @Input() selectedYear: number;

  config: PieChartConfig;
  elementId: String;

  constructor(
    private transactionService: TransactionService,
    private messageService: MessageService
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

    //Piechart1 Data & Config
    this.config = new PieChartConfig(null, 0);
    this.elementId = 'expensesByCategoryChart';
  }

  ngAfterViewInit(): void {
    this.redrawChart();
  }

  redrawChart() {
    this.categoryPieChart.redrawChart(this.getChartData());
  }

  getChartData() {
    const data = [];
    data.push(['Category', 'Amount']);

    const categorySummaries = this.getCategorySummaries();
    for (let i = 0; i < categorySummaries.length; i++) {
      data.push([categorySummaries[i].category, categorySummaries[i].total])
    }

    return data;
  }

  getTotals(): Totals {
    const result = new Totals();
    if (this.transactions) {
      for (let i = 0; i < this.transactions.length; i++) {
        const transaction = this.transactions[i];
        result.transactions++;
        result.total += transaction.amount;
      }
    }

    return result;
  }

  getWeekSummaries(): WeekSummary[] {
    const summaries = [];
    if (this.transactions) {
      for (let i = 0; i < this.transactions.length; i++) {
        const transaction = this.transactions[i];
        let summary = summaries[transaction.week];
        if (summary == null) {
          summary = new WeekSummary();
          summary.week = transaction.week;
          summaries[transaction.week] = summary;
        }

        summary.transactions++;
        summary.total += transaction.amount;
      }
    }

    const result = [];
    summaries.forEach((summary) => {
      result.push(summary);
    });

    return result;
  }

  getCategorySummaries(): CategorySummary[] {
    const summaries = [];
    const categories = [];
    if (this.transactions) {
      for (let i = 0; i < this.transactions.length; i++) {
        const transaction = this.transactions[i];
        let summary = summaries[transaction.category];
        if (summary == null) {
          summary = new CategorySummary();
          summary.category = transaction.category;
          summaries[transaction.category] = summary;
          categories.push(transaction.category);
        }

        summary.transactions++;
        summary.total += transaction.amount;
      }

      categories.sort();
    }

    return categories.map((category) => {
      return summaries[category];
    });
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

  save(transaction: Transaction, categoryCell: HTMLElement) {
    transaction.editing = false;
    this.redrawChart()
    this.transactionService.saveTransaction(transaction)
      .subscribe(saveResult => {
        categoryCell.classList.add('success');
        setTimeout(() => {
          categoryCell.classList.remove('success');
        }, 250);
      });
  }

  cancelEditing(transaction: Transaction) {
    transaction.editing = false;
    transaction.category = transaction.originalCategory;
    transaction.originalCategory = null;
  }

  onKeyUp(event: KeyboardEvent, transaction: Transaction, categoryCell: HTMLElement) {
    if (TransactionsComponent.KEY_ENTER === event.which) {
      this.save(transaction, categoryCell);
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
      .subscribe(transactions => {
        this.transactions = transactions;
        this.redrawChart();
      })
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
    return <HTMLInputElement>document.getElementById('category-input-' + transaction.id);
  }

  private findTableCellForTransaction(transaction: Transaction): HTMLElement {
    return document.getElementById('category-cell-' + transaction.id);
  }
}
