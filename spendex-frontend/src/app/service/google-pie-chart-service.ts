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
      is3D: config.is3d,
      chartArea:{left:20,top:0,width:'100%',height:'100%'},
      legend: {position: 'labeled',  alignment: 'center', textStyle: {fontSize: 16, color: '#797979'}},
      pieSliceText: 'value'
    };

    this.buildChart(data, chartFunc, options, (dataTable) => {
      const formatter = new google.visualization.NumberFormat({prefix: '$'});
      formatter.format(dataTable, 1);
    });
  }
}
