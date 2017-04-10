import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
public carSelected: boolean = true;

  pinMenu:boolean=true;
  title = 'app works!';
getval(car){
  console.log(car)
}
}
