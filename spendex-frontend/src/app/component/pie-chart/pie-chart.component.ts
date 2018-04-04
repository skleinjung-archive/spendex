import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PieChartConfig} from "../../model/pie-chart-config";
import {GooglePieChartService} from "../../service/google-pie-chart-service";

declare var google: any;


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent {

  private data: any[];
  @Input() config: PieChartConfig;
  @Input() elementId: string;

  constructor(private _pieChartService: GooglePieChartService) {}

  redrawChart(data: any[]) {
    this.data = data
    this._pieChartService.buildPieChart(this.elementId, this.data, this.config);
  }
}
