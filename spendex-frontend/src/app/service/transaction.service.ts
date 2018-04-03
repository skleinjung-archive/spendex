import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TransactionUploadResult} from "../model/transaction-upload-result";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TransactionService {

  private _uploadUrl = 'api/transactions';

  constructor(private http: HttpClient) { }

  public uploadFiles(filesToUpload: File[]): Observable<TransactionUploadResult> {

    let formData: FormData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("files", filesToUpload[i], filesToUpload[i].name);
    }

    return this.http.post<TransactionUploadResult>(this._uploadUrl, formData);
  }
}
