import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TransactionsComponent } from './component/transactions/transactions.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import {TransactionService} from "./service/transaction.service";
import {HttpClientModule} from "@angular/common/http";
import { TransactionUploadComponent } from './component/transaction-upload/transaction-upload.component';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {MessageService} from "./service/message-service";
import {MessageComponent} from "./component/message/message.component";


@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    TransactionsComponent,
    FileUploadComponent,
    TransactionUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    TransactionService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
