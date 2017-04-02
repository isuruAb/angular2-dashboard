import { ITdDataTableColumn } from '@covalent/core';
import { Model } from './Model';

export class DataTable {
    columnsArray: Array<ITdDataTableColumn>;
    data: Array<Model>;
}