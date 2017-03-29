import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDataComponent } from './model-data.component';

describe('ModelDataComponent', () => {
  let component: ModelDataComponent;
  let fixture: ComponentFixture<ModelDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
