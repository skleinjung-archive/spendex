import {NgModule} from '@angular/core';
import {RouterModule, Routes}   from '@angular/router';
import {TransactionsComponent} from "./component/transactions/transactions.component";
import {TransactionUploadComponent} from "./component/transaction-upload/transaction-upload.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/transactions',
    pathMatch: 'full'
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
  },
  {
    path: 'upload',
    component: TransactionUploadComponent,
  },
  // {
  //   path: 'games/:id',
  //   component: GameDetailComponent
  // },
  // {
  //   path: 'configuration',
  //   component: ConfigurationComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
