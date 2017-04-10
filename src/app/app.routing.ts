
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllModelsComponent } from './all-models/all-models.component';
import { ModelDataComponent } from './model-data/model-data.component';
import { ModelEditComponent } from './model-edit/model-edit.component';
import { ModelService } from './all-models/model.service';

const routes: Routes = [
  {
    path: '', redirectTo: 'Models' , pathMatch: 'full' 
  },
  {
    path: 'Models', component: AllModelsComponent
  },
  {
    path: 'Models/:name', component: ModelDataComponent
  },
  {
    path: 'Models/:name/:id', component: ModelDataComponent
  },
  {
    path: 'Models/edit/:name/:item', component: ModelEditComponent // Edit Model data route
  },
  {
    path: 'Models/add/:name', component: ModelEditComponent // Edit Model data route
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ModelService]
})
export class Angular2RoutingModule { }