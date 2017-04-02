import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Params } from '@angular/router';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Model } from '../models/core/Model';
import { List } from 'linqts';
import { Projection } from '../models/core/Projection';
import { DataTable } from '../models/core/DataTable';
import { ITdDataTableColumn } from '@covalent/core';
import { ModelResource } from '../models/core/ModelResource';

@Injectable()
export class ModelService {

  modelPropertiesArray: Array<any>;
  modelsUrl: string = 'api/model/';
  allModelData$: Observable<DataTable>;

  constructor(private http: Http, private router: Router) { }

  getModels(): Observable<any> {
    return this.http.get(this.modelsUrl);
  } // End getModels(): Observable<any>

  getModel(name: string): Observable<Model> {
    return this.http.get(this.modelsUrl + name).map((res: Response) => res.json());
  } // End getModel()

  _getModelData(model: Model): Observable<ModelResource> {
    let params = new URLSearchParams();
    params.set('size', '10');
    return this.http.get(model.endPoint, { search: params }).map((res: Response) => res.json());
  } // End _getModelData()

  navigateToEachModel(modelEndPoint: string, modelProperties: Array<any>, name: string) {

    this.modelPropertiesArray = modelProperties;
  }//End navigateToEachModel

  getModelData(name: string, rootPath: string, dataTableData: Array<Model>) {
    this.getModel(name).switchMap(model => this._getModelData(model)).subscribe(m => {
      console.log('Model Rescource', m);
    });

     

    // this.getModel(name).subscribe((model: Model) => {
    //   this._getModelData(model).subscribe((modelResource: ModelResource) => {

    //   });
    // });

    // //console.log(dataTableData);
    // var dTableData: Array<Model> = dataTableData;

    // let allModelData: DataTable;
    // let columnsArray: Array<ITdDataTableColumn>;
    // let fullDataCount: Array<Model>;

    // this.http.get(rootPath + name).map((res: Response) => res.json()).subscribe((m: Model) => {

    //   //make column names and details
    //   let projections = new List<Projection>(m.projections);
    //   let dataTable: Projection = projections.Where(p => p.name === 'dataTable').First();
    //   console.log('Data Table', dataTable);
    //   console.log("columnsArray", rootPath);

    //   if (dataTable) {
    //     dataTable.properties.forEach(k => {
    //       columnsArray.push({ name: k.name, label: k.name });
    //     });
    //   } else {
    //     m.properties.forEach(k => {
    //       columnsArray.push({ name: k.name, label: k.name });
    //     });
    //   }

    //   allModelData.columnsArray = columnsArray;

    //   let dataEndPoint = m.endPoint;
    //   this.http.get(m.endPoint).subscribe(endData => {

    //     let dataArray: Array<any> = endData.json()._embedded[Object.keys(endData.json()._embedded)[0]];
    //     fullDataCount = endData.json().page.totalElements;
    //     console.log("this.fullDataCount", fullDataCount);
    //     let i = 1;
    //     dataArray.forEach(element => {
    //       element.id = i;
    //       //add data to table
    //       dTableData.push(element);
    //       i++;
    //     });


    //   })
    //   allModelData.data = dTableData;


    // });
    // return allModelData;

  } //End getModelData()

}
