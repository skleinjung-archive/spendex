import {Component, OnInit} from '@angular/core';
import {FileHandler} from "../file-upload/file-handler";
import {TransactionService} from "../../service/transaction.service";
import {TransactionUploadResult} from "../../model/transaction-upload-result";

@Component({
  selector: 'app-transaction-upload',
  templateUrl: './transaction-upload.component.html',
  styleUrls: ['./transaction-upload.component.css']
})
export class TransactionUploadComponent implements OnInit, FileHandler {

  fileHandler: FileHandler;
  result: TransactionUploadResult;

  constructor(private transactionService: TransactionService) {
    this.fileHandler = this;
  }

  ngOnInit() {
  }

  handleFiles(files: File[]): void {
    this.transactionService.uploadFiles(files)
      .subscribe((result) => {
          this.result = result;
        },
        (error) => {
          const result = new TransactionUploadResult();
          if (error.status == 500) {
            result.message = error.error.message;
          } else {
            result.message = 'There was an unknown error processing your upload.';
          }

          result.rows = 0;
          result.status = 'Error';
          this.result = result;
        });
  }
}
