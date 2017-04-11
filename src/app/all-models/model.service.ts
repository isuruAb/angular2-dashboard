import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Params } from '@angular/router';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
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

  getModel(name: string, customModel: string): Observable<Model> {


    if (customModel) {
      return this.http.get(this.modelsUrl + customModel).map((res: Response) => res.json());

    }
    else {
      return this.http.get(this.modelsUrl + name).map((res: Response) => res.json());
    }


  } // End getModel()

  _getModelData(get: GetRequest, searchParams: URLSearchParams, customEndPoint: string): Observable<GetRequest> {

    //when retrieving data from custom endpoint
    if (customEndPoint) {

      console.log("customEndPointcustomEndPoint", customEndPoint);
      return this.http.get(customEndPoint, { search: searchParams })
        .map((res: Response) => res.json())
        .map(d => {
          get.results = d;
          console.log("get from results", get);

          return get
        });
    }
    else {

      return this.http.get(get.model.endPoint, { search: searchParams })
        .map((res: Response) => res.json())
        .map(d => {
          get.results = d;
 console.log("get from results2", get);
          return get
        });
    }



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
        get.addColumn('edit');
        //  console.log("get", get);
      }

    } //end if (m.projections)
    else {
      // if projections are not defined
      let propertiesArray = model.properties;
      propertiesArray.forEach(element => {
        get.addColumn(element.name);
      });
      get.addColumn('edit');
    }

    let urlParams = new URLSearchParams();
    params.forEach((v, k) => {
      urlParams.set(v, k);
    });

    get.params = urlParams;

    return Observable.of(get);
  } // End _preRequest()

  //Tab services here
  getModelData(name: string, params: Map<string, string>,
    searchParams: URLSearchParams,
    customEndPoint: string,
    customModel: string): Observable<GetRequest> {
    console.log("customModel fro mservice", customModel);

    return this.getModel(name, customModel)
      .switchMap(model => this._preRequest(model, params))
      .switchMap(d => this._getModelData(d, searchParams, customEndPoint));

  } //End getModelData().

  getTabData(dataLink) {
    return this.http.get(dataLink).map(m => m.json())
  }//End getTabData()

  saveTabData(patchUrl: string, requestBody: string, reqquestOptions: RequestOptions) {
    return this.http.patch(patchUrl, requestBody, reqquestOptions)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
