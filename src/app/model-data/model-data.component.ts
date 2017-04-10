import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { ModelService } from '../all-models/model.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, Response, URLSearchParams } from '@angular/http';
import { element } from 'protractor';
import { List } from 'linqts';
import { Projection } from '../models/core/Projection';
import { Model } from '../models/core/Model';
import { DashboardPage } from '../../../e2e/app.po';
import { GetRequest } from '../models/core/GetRequest';
import { Router } from '@angular/router';

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
    currentData: any[] = [];
    columns: ITdDataTableColumn[] = [{ name: 'id', label: 'ID #', tooltip: 'ID' }];
    filteredData: any[] = [];
    fullDataCount: number = 0;
    dataEndPoint: string;
    size = 10;
    totalElements = 0;
    searchParams: URLSearchParams = new URLSearchParams();
    modelName = null;
    params: Object;
    @Input('customEndPoint') customEndPoint: string;
    @Input('customModel') customModel: string;


    @ViewChild('dataTable') dataTable: any;

    constructor(private _dataTableService: TdDataTableService,
        private modleService: ModelService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: Http) {

    } // End constructor 

    edit(item) {
        //console.log(item);

        if (this.params['item']) {
            console.log("itemitemitemitemitemitemitemitemitem", item);
            this.router.navigate(['Models/edit', this.customModel, item]); //problem here 

        } else {
            this.router.navigate(['Models/edit', this.modelName, item]);

        }


    } //edit(item)  Ends

    add() {
        
        if (this.params['item']) {
            this.router.navigate(['Models/add', this.customModel]); 

        } else {
            this.router.navigate(['Models/add', this.modelName]);
        }

    } //add() Ends

    doGet() {
        //  console.log("this.customEndPoint",this.customEndPoint);

        this.modleService.getModelData(this.modelName,
            null,
            this.searchParams,
            this.customEndPoint,
            this.customModel).subscribe(getRequest => {
                if (getRequest.results.page) {
                    // Set page options
                    this.pageSize = getRequest.results.page.size;

                    this.totalElements = getRequest.results.page.totalElements;
                }

                // Get data
                let dataArray = [];
                getRequest.results._embedded[Object.keys(getRequest.results._embedded)[0]].forEach(element => {
                    element['edit'] = element._links.self.href;
                    dataArray.push(element);
                });
                this.currentData = dataArray;


                // Set columns
                this.columns = getRequest.columns;
                // Show filtered data;
                this.filter();
            });
    }// End doGet()

    ngOnInit(): void {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.params = params; //get all params to  this.params
            // Get the model Name in URL.
            this.modelName = params['name'];


            // initial search params
            this.searchParams.set('size', this.size + '');
            this.doGet();
        });//End this.activatedRoute.params.subscribe

        this.filter();
    }//End  ngOnInit()


    sort(sortEvent: ITdDataTableSortChangeEvent): void {
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;
        this.filter();
    };//End sort(sortEvent: ITdDataTableSortChangeEvent)

    search(searchTerm: string): void {

        this.searchTerm = searchTerm;
        this.filter();
    };// End search(searchTerm: string)

    page(pagingEvent: IPageChangeEvent): void {
        // console.log(pagingEvent);
        this.searchParams.set('page', (pagingEvent.page - 1) + '');
        this.searchParams.set('size', pagingEvent.pageSize + '');
        this.doGet();
        this.filter();
    }; // End page(pagingEvent: IPageChangeEvent)

    filter(): void {
        // Copy current data
        let newData: any[] = this.currentData;

        newData = this._dataTableService.filterData(newData, this.searchTerm, true);

        newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
        this.filteredData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    } // End filter()
}
