import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTextFilePluginParamsComponent } from './create-text-file-plugin-params.component';

describe('CreateTextFilePluginParamsComponent', () => {
  let component: CreateTextFilePluginParamsComponent;
  let fixture: ComponentFixture<CreateTextFilePluginParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTextFilePluginParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTextFilePluginParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
