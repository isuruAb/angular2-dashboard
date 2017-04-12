import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Rx';
import { FieldDataType } from '../models/core/FieldDataType';
import { ModelService } from '../all-models/model.service';

@Component({
  selector: 'app-model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})
export class ModelEditComponent implements OnInit, OnDestroy {
  private modelData: any = {};
  baseUrl: string = 'api/model/'
  private arrayOfKeys;
  private modelProperties: Array<any>;
  private fieldDataTypes: FieldDataType[] = [];
  private tabs: any[] = [];
  private tabData: any = {};
  private propertyVisible: boolean = true;
  dataLink: string;
  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private modleService: ModelService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {

    //console.log("activatedRoute", this.activatedRoute);

    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      let name = params['name'];
      let item = params['item'];
      this.modelData = {};
      this.tabData = {};
      this.tabs = [];
      this.fieldDataTypes = [];


     // console.log("paramsparams", params['name']);
      this.http.get(this.baseUrl + name).subscribe((res: Response) => {
        let results = res.json();

        //console.log("results.properties",results.properties);
        for (let property in results.properties) {
          this.propertyVisible = true;

          if (results.properties[property].type === "set") {
            let prop = results.properties[property];
            prop['itemSelf'] = item + '/' + prop.name;
            this.tabs.push(prop);

           // console.log("prop", prop);
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


        this.modleService.getTabData(item).subscribe(data => {
          this.modelData = data;
          this.tabData = this.modelData;

        });



      });

    });
    //   console.log(this.tabs);

  } // End  ngOnInit(): void 

  ngOnDestroy() {
    this.subscription.unsubscribe;
  }

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
