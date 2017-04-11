import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FieldDataType } from '../models/core/FieldDataType';
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
  private fieldDataTypes: FieldDataType[] = [];
  private tabs: any[] = [];
  private tabData: any = {};
  private propertyVisible: boolean = true;
  dataLink: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private modleService: ModelService
  ) {
   // console.log("add new item 1s");

  }

  ngOnInit(): void {
    console.log("activatedRoute", this.activatedRoute);
    this.activatedRoute.params.subscribe((params: Params) => {
      let name = params['name'];
      let item = params['item'];

      this.http.get(this.baseUrl + name).subscribe((res: Response) => {
        let results = res.json();
        //console.log("results.properties",results.properties);
        for (let property in results.properties) {
          this.propertyVisible = true;

          if (results.properties[property].type === "set") {
            let prop = results.properties[property];
            prop['itemSelf'] = item + '/' + prop.name;
            this.tabs.push(prop);
            //console.log("prop", prop);

          }
          if (results.properties[property].iggnoreOnRead && results.properties[property].iggnoreOnRead === true) {
            this.propertyVisible = false;
          }


          let modelData: FieldDataType = new FieldDataType();
          modelData.name = results.properties[property].name;
          modelData.dataType = results.properties[property].type;
          modelData.ignore = this.propertyVisible;

          this.fieldDataTypes.push(modelData);
        } //End for (let property in results.properties)

      });
      //   console.log(this.tabs);

      this.modleService.getTabData(item).subscribe(data => {
        this.modelData = data;
        this.tabData = this.modelData;

      });

    });

  } // End  ngOnInit(): void 

  switchTab(event: any) {
    let index = event.index;
    this.tabData = {};

    if (event.tab.textLabel === 'BASIC') {
      this.tabData = this.modelData;
    } else {
      this.dataLink = this.modelData._links[this.tabs[index - 1].name].href;
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



}
