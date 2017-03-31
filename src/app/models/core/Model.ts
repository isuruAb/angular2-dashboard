import { Projection } from './Projection';
import { Property } from './Property';

export class Model {
    name: string;
    endPoint: string;
    package: string;
    projections: Array<Projection>;
    properties: Array<Property>;
}