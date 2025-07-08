import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrunkPluginParamsComponent } from './drunk-plugin-params.component';

describe('DrunkPluginParamsComponent', () => {
  let component: DrunkPluginParamsComponent;
  let fixture: ComponentFixture<DrunkPluginParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrunkPluginParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrunkPluginParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
