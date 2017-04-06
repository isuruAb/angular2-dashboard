import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ModelDataType } from '../models/core/modelDataType';

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
    private http: Http
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      let name = params['name'];
      let item = params['item'];
      console.log(item);


      this.http.get(this.baseUrl + name).subscribe((res: Response) => {
        let results = res.json();
        //console.log(results.properties);
        for (let property in results.properties) {
          this.propertyVisible = true;

          if (results.properties[property].type === "set") {
            let prop = results.properties[property];
            prop['itemSelf'] = item + '/' + prop.name;
            this.tabs.push(prop);
            console.log(prop);

          }
          if (results.properties[property].iggnoreOnRead && results.properties[property].iggnoreOnRead === true) {
            this.propertyVisible = false;
          }
          // console.log(results.properties[property]);
          //console.log(results);

          this.modelDataTypes.push(new ModelDataType(results.properties[property].name, results.properties[property].type, this.propertyVisible));
        } //End for (let property in results.properties)

      });
      //   console.log(this.tabs);

      let data = this.http.get(item).subscribe(data => {
        this.modelData = data.json();;
        this.tabData = this.modelData;

      });
    });

    console.log("this.tabData ", this.tabData);

  } // End  ngOnInit(): void 
  doSomething(event: any) {
    let $event = event;
    if ($event.tab.textLabel === 'basic') {
      this.tabData = this.modelData;
    } else {
      let linkData = this.modelData._links[$event.tab.textLabel].href;
      this.tabData = {};
      this.http.get(linkData).subscribe(res => {
        this.dataLink = linkData;
        console.log(linkData);

        this.tabData = res.json()._embedded;
        console.log("res.json()._embedded", res.json()._embedded);
      });
    }


  }//End doSomething(event: any)

  saveModel(tabData: any): Observable<any> {

    let body = JSON.stringify(tabData);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.patch(tabData._links.self.href, body, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')).subscribe(res => {
        // console.log(res);

      });
    return
  } //End saveModel(tabData: any): Observable<any>

  getEndPointdata(endPoint: string) {
    return this.http.get(endPoint).map((res: Response) => res.json())
  } // End getEndPointdata(endPoint: string)

}
