import { Model } from './Model';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ModelResource } from './ModelResource';
import { ITdDataTableColumn } from '@covalent/core';

export class GetRequest {
    model: Model;
    params: URLSearchParams;
    results: ModelResource = null;
    columns: Array<ITdDataTableColumn> = null;

    constructor(model) {
        this.model = model;
    }

    addColumn(name) {
        if (this.columns === null) {
            this.columns = [];
        }
        this.columns.push({ "name": name, "label": name })
    }// End addColumn()
}