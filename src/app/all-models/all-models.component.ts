import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router} from '@angular/router';
import { ModelService } from './model.service';
@Component({
  selector: 'app-all-models',
  templateUrl: './all-models.component.html',
  styleUrls: ['./all-models.component.css']
})
export class AllModelsComponent implements OnInit, OnDestroy {

  results$: Observable<any>;
  models: Array<any> = [];

  constructor(private router: Router, private modleService: ModelService) {

    this.results$ = modleService.getModels().map(res => res.json());



  }
  ngOnInit() {

  }
  clickModel(modelEndPoint: string, modelProperties: Array<any>, name: string) {
    // this.modleService.navigateToEachModel(modelEndPoint, modelProperties, name);
    this.modleService.navigateToEachModel(modelEndPoint, modelProperties, name)
    this.router.navigate(['Models', name]);

  }
  ngOnDestroy(){
    
  }
}
