import { NavigationLink } from './NavigationLink';
import { Page } from './Page';

export class ModelResource {
    _embedded: Object;
    _links: NavigationLink;
    page: Page;
}