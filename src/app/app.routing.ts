
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllModelsComponent } from './all-models/all-models.component';
import { ModelDataComponent } from './model-data/model-data.component';

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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class Angular2RoutingModule { }