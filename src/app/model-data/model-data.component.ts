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

            this.http.get(this.rootPath + name).map((res: Response) => res.json()).subscribe((m: Model) => {
                //make column names and details
                let projections = new List<Projection>(m.projections);
                let dataTable: Projection = projections.Where(p => p.name === 'dataTable').First();
                console.log('Data Table', dataTable);
                if (dataTable) {
                    dataTable.properties.forEach(k => {
                        this.columnsArray.push({ name: k.name, label: k.name });
                    });
                } else {
                    m.properties.forEach(k => {
                        this.columnsArray.push({ name: k.name, label: k.name });
                    });
                }

                //check for projections
                // const [urlOne, urlTwo, urlThree] = m.json().endPoint.split('/');

                /*         this.http.get("api/profile/"+urlThree)
                         if(){
         
                         }*/



                this.http.get(m.endPoint).subscribe(endData => {

                    let dataArray: Array<any> = endData.json()._embedded[Object.keys(endData.json()._embedded)[0]];

                    let i = 1;
                    dataArray.forEach(element => {
                        element.id = i;
                        //add data to table
                        this.dataTableData.push(element);
                        i++;
                    });
                })

            });


        });

        /*        //make column names and details
                this.modleService.modelPropertiesArray.forEach(element => {
                    this.columnsArray.push({ name: element.name, label: element.name });
                });*/

        this.filter();
    }

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
        this.fromRow = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }

    filter(): void {
        let newData: any[] = this.data;
        newData = this._dataTableService.filterData(newData, this.searchTerm, true);
        this.filteredTotal = newData.length;
        newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
        newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
        this.filteredData = newData;
    }
}
