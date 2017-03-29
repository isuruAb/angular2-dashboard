import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { ModelService } from '../all-models/model.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { element } from 'protractor';
@Component({
    selector: 'app-model-data',
    templateUrl: './model-data.component.html',
    styleUrls: ['./model-data.component.css']
})
export class ModelDataComponent implements OnInit {
    selectedRows: number = 0;
    /*= [
        { sku: '1452-2', item: 'Pork Chops', price: 32.11 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
        { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
    ]*/
    /*[
       { name: 'sku', label: 'SKU #', tooltip: 'Stock Keeping Unit' },
       { name: 'item', label: 'Item name' },
       { name: 'price', label: 'Price (US$)', numeric: true, format: v => v.toFixed(2) },
   ]*/



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
        private modleService: ModelService, private activatedRoute: ActivatedRoute, private http: Http) {

        this.data = this.dataTableData;
        this.columns = this.columnsArray;
        console.log("this.dataTableData", this.dataTableData);

        console.log(" this.columnsArray", this.columnsArray);

        //columns of data from backend


        //console.log(this.columnsArray);
        /*modleService.modelData$.subscribe(m => {
          this.modelDataArray = JSON.parse(m);
          console.log("modelDataArray", this.modelDataArray);
        });
        console.log("this.modelDataArray", this.modelDataArray);*/

    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let name = params['name'];

            this.http.get(this.rootPath + name).subscribe(m => {
                this.http.get(m.json().endPoint).subscribe(endData => {
                    let dataArray: Array<any> = endData.json()._embedded[Object.keys(endData.json()._embedded)[0]];
                    //this.dataTableData.forEach()
                    let i=1;
                    dataArray.forEach(element => {
                      element.id=i;
                        this.dataTableData.push(element);
                        i++;
                    });
                })
                //console.log("m.json", m.json().endPoint)
            });
            //console.log("this.dataTableData", this.dataTableData);

        });
        this.modleService.modelPropertiesArray.forEach(element => {
            this.columnsArray.push({ name: element.name, label: element.name });
        });

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
