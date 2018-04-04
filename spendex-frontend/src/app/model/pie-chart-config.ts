export class PieChartConfig {
  title: string;
  is3d: boolean;
  pieHole: number

  constructor(title: string, pieHole: number) {
    this.title = title;
    this.pieHole = pieHole;
  }
}
