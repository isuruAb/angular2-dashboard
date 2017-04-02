import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { ModelService } from '../all-models/model.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { element } from 'protractor';
import { List } from 'linqts';
import { Projection } from '../models/core/Projection';
import { Model } from '../models/core/Model';
import { DashboardPage } from '../../../e2e/app.po';


@Component({
    selector: 'app-model-data',
    templateUrl: './model-data.component.html',
    styleUrls: ['./model-data.component.css']
})
export class ModelDataComponent implements OnInit {
    selectedRows: number = 0;
    searchTerm: string = '';
    fromRow: number = 1;
    currentPage: number = 1;
    pageSize: number = 5;
    sortBy: string = 'id';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
    columnsArray: Array<ITdDataTableColumn> = [{ name: 'id', label: 'ID #', tooltip: 'ID' }];
    dataTableData: Array<any> = [];
    rootPath = 'api/model/';
    data: any[] = this.dataTableData;
    columns: ITdDataTableColumn[] = this.columnsArray;
    filteredData: any[] = this.data;
    filteredTotal: number = this.data.length;
    fullDataCount: number = 0;
    dataEndPoint: string;

    constructor(private _dataTableService: TdDataTableService,
        private modleService: ModelService,
        private activatedRoute: ActivatedRoute,
        private http: Http) {

        this.data = this.dataTableData;
        this.columns = this.columnsArray;
        console.log("this.dataTableData", this.dataTableData);

        console.log(" this.columnsArray", this.columnsArray);
    } // End constructor 

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let name = params['name'];

            this.modleService.getModelData(name, this.rootPath, this.dataTableData);
            //this.dataTableData = this.modleService.getModelData(name, this.rootPath, this.dataTableData).data;
           // this.columnsArray = this.modleService.getModelData(name, this.rootPath, this.dataTableData).columnsArray;
            /*
                        this.http.get(this.rootPath + name).map((res: Response) => res.json()).subscribe((m: Model) => {
            
                            //check whether there is a projejction call dataTable
                            if (m.projections) {
                                let projections = new List<Projection>(m.projections);
                                let dataTable = projections.Where(p => p.name == 'dataTable').First();
                                if (dataTable) {
                                    dataTable.properties.forEach(k => {
                                        this.columnsArray.push({ name: k.name, label: k.name });
                                    });
                                }
            
                            } else {
                                m.properties.forEach(k => {
                                    this.columnsArray.push({ name: k.name, label: k.name });
                                });
                            }
            
                            console.log(m.endPoint);
                            this.dataEndPoint = m.endPoint;
                            this.http.get(m.endPoint).subscribe(endData => {
            
                                let dataArray: Array<any> = endData.json()._embedded[Object.keys(endData.json()._embedded)[0]];
                                this.fullDataCount = endData.json().page.totalElements;
                                console.log("this.fullDataCount", this.fullDataCount);
                                let i = 1;
                                dataArray.forEach(element => {
                                    element.id = i;
                                    //add data to table
                                    this.dataTableData.push(element);
                                    i++;
                                });
                            })
            
                        });*/


        });//End this.activatedRoute.params.subscribe


        this.filter();
    }//End  ngOnInit()


    sort(sortEvent: ITdDataTableSortChangeEvent): void {
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;
        this.filter();
    }

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.filter();
    }

    page(pagingEvent: IPageChangeEvent): void {
        console.log(pagingEvent);
        this.fromRow = pagingEvent.fromRow;
        console.log("this.fromRow", this.fromRow);
        this.currentPage = pagingEvent.page;
        console.log("this.currentPage", this.currentPage);
        this.pageSize = pagingEvent.pageSize;
        console.log("this.pageSize", this.pageSize);

        //check for data we have and fetch if request
        if (this.data.length < (pagingEvent.page * pagingEvent.pageSize) &&
            (pagingEvent.page * pagingEvent.pageSize) < this.filteredTotal) {
            console.log(this.dataEndPoint + "?page=" + (this.currentPage--) + "&size=" + this.pageSize);
            this.http.get(this.dataEndPoint + "?page=" + (this.currentPage--) + "&size=" + this.pageSize)
                .subscribe(nData => {

                    let nDataArray: Array<any> = nData.json()._embedded[Object.keys(nData.json()._embedded)[0]];

                    let i = this.fromRow;

                    nDataArray.forEach(element => {
                        element.id = i;

                        //add data to table
                        this.dataTableData.push(element);

                        i++;
                    });//End nDataArray.forEach
                    console.log("dataTableData", this.dataTableData);
                })

        } //end if 
        this.data = this.dataTableData;
        this.filter();
    }

    filter(): void {
        let newData: any[] = this.data;
        newData = this._dataTableService.filterData(newData, this.searchTerm, true);
        this.filteredTotal = this.fullDataCount;

        newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
        newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
        this.filteredData = newData;
    }
}
