import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TransactionUploadResult} from "../model/transaction-upload-result";
import {Observable} from "rxjs/Observable";
import {Transaction} from "../model/transaction";
import "rxjs/add/operator/do";
import {SaveResult} from "../model/save-result";

@Injectable()
export class TransactionService {

  private _baseUrl = 'api/transactions';

  constructor(private http: HttpClient) { }

  public getTransactions(month: number, year: number, sortColumn: string, descending: boolean): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this._baseUrl + "?month=" + month + "&year=" + year + "&sortColumn=" + sortColumn + "&descending=" + descending)
      .do(transactions => {
        for (let i = 0; i < transactions.length; i++) {
          transactions[i].date = TransactionService.parseDate(transactions[i].dateString);
        }
      });
  }

  public saveTransaction(transaction: Transaction): Observable<SaveResult> {
    return this.http.put<SaveResult>(this._baseUrl + '/' + transaction.id, {
      id: transaction.id,
      category: transaction.category
    });
  }

  public uploadFiles(filesToUpload: File[]): Observable<TransactionUploadResult> {

    let formData: FormData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("files", filesToUpload[i], filesToUpload[i].name);
    }

    return this.http.post<TransactionUploadResult>(this._baseUrl, formData);
  }

  private static parseDate(input: string): Date {
    let parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); // Note: months are 0-based
  }
}
