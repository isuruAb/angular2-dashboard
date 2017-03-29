import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

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
}
