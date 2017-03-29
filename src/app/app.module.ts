import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AllModelsComponent } from './all-models/all-models.component';
import { CovalentCoreModule } from '@covalent/core';

import { FlexLayoutModule } from "@angular/flex-layout";
import { Angular2RoutingModule } from './app.routing';
import { ModelDataComponent } from './model-data/model-data.component';
import { ModelService } from './all-models/model.service';
@NgModule({
  declarations: [
    AppComponent,
    AllModelsComponent,
    ModelDataComponent
  ],
  imports: [
    CovalentCoreModule,
    Angular2RoutingModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
