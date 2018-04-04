import { Injectable } from '@angular/core';
import {GoogleChartsBaseService} from "./google-charts-base-service";
import {PieChartConfig} from "../model/pie-chart-config";

declare var google: any;

@Injectable()
export class GooglePieChartService extends GoogleChartsBaseService {

  constructor() { super(); }

  public buildPieChart(elementId: string, data: any[], config: PieChartConfig) : void {
    const chartFunc = () => { return new google.visualization.PieChart(document.getElementById(elementId)); };
    const options = {
      title: config.title,
      pieHole: config.pieHole,
    };

    this.buildChart(data, chartFunc, options);
  }
}
