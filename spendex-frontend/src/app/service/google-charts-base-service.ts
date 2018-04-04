declare var google: any;

export class GoogleChartsBaseService {
  constructor() {
    google.charts.load('current', {'packages': ['corechart']});
  }

  protected buildChart(data: any[], chartFunc: any, options: any, formatFunc: any): void {
    var func = (chartFunc, options) => {
      var dataTable = google.visualization.arrayToDataTable(data);
      if (formatFunc) {
        formatFunc(dataTable);
      }

      chartFunc().draw(dataTable, options);
    };
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }

}
