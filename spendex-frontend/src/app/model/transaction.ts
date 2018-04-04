export class Transaction {
  id: number;
  uploadedFileName: string;
  dateString: string;
  date: Date;
  week: number;
  amount: number;
  description: string;
  category: string;
  originalCategory: string;
  editing: boolean;

  constructor() {
  }
}
