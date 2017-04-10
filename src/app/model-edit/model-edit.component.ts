import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ModelDataType } from '../models/core/modelDataType';
import { ModelService } from '../all-models/model.service';

@Component({
  selector: 'app-model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})
export class ModelEditComponent implements OnInit {
  private modelData: any = {};
  baseUrl: string = 'api/model/'
  private arrayOfKeys;
  private modelProperties: Array<any>;
  private modelDataTypes: ModelDataType[] = [];
  private tabs: any[] = [];
  private tabData: any = {};
  private propertyVisible: boolean = true;
  dataLink: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private modleService: ModelService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      let name = params['name'];
      let item = params['item'];
      //console.log(item);
//console.log("this.baseUrl + namethis.baseUrl + namethis.baseUrl + name",this.baseUrl + name);


      this.http.get(this.baseUrl + name).subscribe((res: Response) => {
        let results = res.json();
        //console.log("results.properties",results.properties);
        for (let property in results.properties) {
          this.propertyVisible = true;

          if (results.properties[property].type === "set") {
            let prop = results.properties[property];
            prop['itemSelf'] = item + '/' + prop.name;
            this.tabs.push(prop);
            console.log("prop", prop);

          }
          if (results.properties[property].iggnoreOnRead && results.properties[property].iggnoreOnRead === true) {
            this.propertyVisible = false;
          }
          // console.log(results.properties[property]);
          //console.log(results);

          this.modelDataTypes.push(new ModelDataType(results.properties[property].name,
           results.properties[property].type,
            this.propertyVisible));
        } //End for (let property in results.properties)

      });
      //   console.log(this.tabs);

      this.modleService.getTabData(item).subscribe(data => {
        this.modelData = data;
        this.tabData = this.modelData;
      });

    });

    console.log("this.tabData ", this.tabData);

  } // End  ngOnInit(): void 

  switchTab(event: any) {
    this.tabData = {};

    if (event.tab.textLabel === 'basic') {
      this.tabData = this.modelData;
    } else {
      this.dataLink = this.modelData._links[event.tab.textLabel].href;

      this.modleService.getTabData(this.dataLink).subscribe(res => {
        this.tabData = res._embedded;
        //console.log("resresres",res);

      });

    }//End Else
  }//End switchTab(event: any)

  saveModel(tabData: any): void {

    let body = JSON.stringify(tabData);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.modleService.saveTabData(tabData._links.self.href, body, options)
      .subscribe();
  } //End saveModel(tabData: any): void

  /*  getEndPointdata(endPoint: string) {
      console.log(endPoint);
      return this.http.get(endPoint).map((res: Response) => res.json())
    } // End getEndPointdata(endPoint: string)*/

}
