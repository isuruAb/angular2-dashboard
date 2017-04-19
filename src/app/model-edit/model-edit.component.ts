import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Rx';
import { FieldDataType } from '../models/core/FieldDataType';
import { ModelService } from '../all-models/model.service';
import { ModelResource } from '../models/core/ModelResource';
import { BasicObject } from '../models/BasicObject';

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
  private basicObjects: any[] = [];
  private basicObjectNames: string[] = [];
  private allItemsObject: any[] = [];
  private tabData: any = {};
  private propertyVisible: boolean = true;
  dataLink: string;
  private basicObjectModel: BasicObject;
  private ObjectTitle;

  item: any;
  name: string;
  postReqUrl: string;

  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private modleService: ModelService,
    private router: Router

  ) {

  }

  ngOnInit(): void {

    console.log("activatedRoute", this.activatedRoute);

    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      let name = params['name'];
      let item = params['item'];
      this.item = item;
      this.name = name;

      this.modelData = {};
      this.tabData = {};
      this.tabs = [];
      this.fieldDataTypes = [];


      this.http.get(this.baseUrl + name).subscribe((res: Response) => {
        let results = res.json();

        for (let property in results.properties) {
          this.propertyVisible = true;
          //console.log("Result properties", results.properties[property]);

          if (results.properties[property].type === "set") {
            let prop = results.properties[property];
            prop['itemSelf'] = item + '/' + prop.name;
            this.tabs.push(prop);
          }
          if (results.properties[property].type === "object") {
            let object = results.properties[property];
            let objectName = object.name;
            this.basicObjectNames.push(objectName);

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
          if (this.basicObjectNames.length > 0) {

            for (let basicObjectName of this.basicObjectNames) {

              this.modleService.getTabData(data._links[basicObjectName].href).subscribe(basicObject => {
                let tittle = this.upperCaseFirst(basicObjectName);

                this.http.get(this.baseUrl + tittle).subscribe((res: Response) => {
                  this.ObjectTitle = res.json().title;

                  this.basicObjectModel = {
                    name: basicObjectName,
                    objectss: basicObject,
                    objectTittles: this.ObjectTitle
                  }
                  this.ObjectTitle = {};
                  this.basicObjects.push(this.basicObjectModel)
                  //console.log("Basic Objects", this.basicObjects);
                });

              });
            }

          }
          this.modelData = data;
          this.tabData = this.modelData;


        });

      });


      if (item !== "") {
        this.modleService.getTabData(item).subscribe(data => {
          this.modelData = data;
          this.tabData = this.modelData;
        });
      } //End  if (item !== "")

      else {
        this.modleService.getModel(name, "").subscribe(data => {
          this.http.get(data.endPoint).subscribe((m: any) => {
            this.postReqUrl = m.json()._links.self.href;
          });
        });
      }

    });

  } // End  ngOnInit(): void 

  upperCaseFirst(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }

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
      });
    }//End Else

  }//End switchTab(event: any)


  saveModel(tabData: any): void {
    let body = JSON.stringify(tabData);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let reqType: string = "patch";
    if (this.item === "") {
      // console.log("here we are");
      reqType = "post";
      this.modleService.saveTabData(this.postReqUrl, body, options, reqType)
        .subscribe();
      this.router.navigate(['Models/', this.name]);
    }
    else {
      this.modleService.saveTabData(tabData._links.self.href, body, options, reqType)
        .subscribe();
    }

  } //End saveModel(tabData: any): void

}
