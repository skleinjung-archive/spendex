export class Transaction {
  id: number;
  uploadedFileName: string;
  dateString: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  editing: boolean;

  constructor() {
  }
}
