import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Model } from '../models/core/Model';
import { List } from 'linqts';
import { Projection } from '../models/core/Projection';
import { DataTable } from '../models/core/DataTable';
import { ITdDataTableColumn } from '@covalent/core';

@Injectable()
export class ModelService {
  modelPropertiesArray: Array<any>;
  constructor(private http: Http, private router: Router) { }
  modelsUrl = 'api/model/';

  getModels(): Observable<any> {
    //  this.http.get(this.modelsUrl).subscribe(m => { console.log(m.json()) });
    return this.http.get(this.modelsUrl);
  }
  navigateToEachModel(modelEndPoint: string, modelProperties: Array<any>, name: string) {

    this.modelPropertiesArray = modelProperties;
  }
 /* getModelData(name: string, rootPath: string, dataTableData: Array<Model>) {

    //console.log(dataTableData);
    var dTableData: Array<Model> = dataTableData;
    
    let allModelData: DataTable;
    let columnsArray: Array<ITdDataTableColumn>;
    let fullDataCount: Array<Model>;
    
    this.http.get(rootPath + name).map((res: Response) => res.json()).subscribe((m: Model) => {
      //make column names and details
      let projections = new List<Projection>(m.projections);
      let dataTable: Projection = projections.Where(p => p.name === 'dataTable').First();
      console.log('Data Table', dataTable);
          console.log("columnsArray", rootPath);

      if (dataTable) {
        dataTable.properties.forEach(k => {
          columnsArray.push({ name: k.name, label: k.name });
        });
      } else {
        m.properties.forEach(k => {
          columnsArray.push({ name: k.name, label: k.name });
        });
      }

      allModelData.columnsArray = columnsArray;
      
      let dataEndPoint = m.endPoint;
      this.http.get(m.endPoint).subscribe(endData => {

        let dataArray: Array<any> = endData.json()._embedded[Object.keys(endData.json()._embedded)[0]];
        fullDataCount = endData.json().page.totalElements;
        console.log("this.fullDataCount", fullDataCount);
        let i = 1;
        dataArray.forEach(element => {
          element.id = i;
          //add data to table
          dTableData.push(element);
          i++;
        });


      })
      allModelData.dataTableData = dTableData;

      return allModelData;
    });

  }*/
}
