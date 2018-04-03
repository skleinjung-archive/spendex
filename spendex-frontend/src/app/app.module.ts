import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TransactionsComponent } from './component/transactions/transactions.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import {TransactionService} from "./service/transaction.service";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
