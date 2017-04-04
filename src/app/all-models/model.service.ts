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
import { Page } from '../models/core/Page';
import { GetRequest } from '../models/core/GetRequest';
import { element } from 'protractor';
import { Link } from '../models/core/Link';

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

  _getModelData(get: GetRequest,searchParams:URLSearchParams): Observable<GetRequest> {
    return this.http.get(get.model.endPoint, { search: searchParams})
      .map((res: Response) => res.json())
      .map(d => {
        get.results = d;
        return get
      });
  } // End _getModelData()

  navigateToEachModel(modelEndPoint: string, modelProperties: Array<any>, name: string) {
    this.modelPropertiesArray = modelProperties;
  }//End navigateToEachModel

  _preRequest(model: Model, params: Map<string, string>): Observable<GetRequest> {
    let get: GetRequest = new GetRequest(model);
    if (params === null) {
      params = new Map();
    }

    if (model.projections) {
      let projections = new List<Projection>(model.projections);

      if (projections.Where(x => x.name == "dataTable")) {
        let projection = projections.Where(x => x.name == "dataTable").First();
        params.set('projection', projection.name);
        projection.properties.forEach(element => {
          get.addColumn(element.name);
        });
      }
      
    } //end if (m.projections)
    else {
      // if projections are not defined
      let propertiesArray = model.properties;
      propertiesArray.forEach(element => {
        get.addColumn(element.name);
      });
    }

    let urlParams = new URLSearchParams();
    params.forEach((v, k) => {
      urlParams.set(v, k);
    });

    get.params = urlParams;
    
    return Observable.of(get);
  } // End _preRequest()

  getModelData(name: string, params: Map<string, string>, searchParams:URLSearchParams) :Observable<GetRequest>{
    //model => this._getModelData(model, params)
    return this.getModel(name)
      .switchMap(model => this._preRequest(model, params))
      .switchMap(d => this._getModelData(d,searchParams));
  } //End getModelData().

}
