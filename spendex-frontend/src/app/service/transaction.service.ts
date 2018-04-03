import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class TransactionService {

  constructor(private http: HttpClient) { }

  public uploadFiles(filesToUpload: File[]) {

    let formData: FormData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("files", filesToUpload[i], filesToUpload[i].name);
    }

    return this.http.post<any>("http://localhost:4200/api/transactions", formData);
  }
}
