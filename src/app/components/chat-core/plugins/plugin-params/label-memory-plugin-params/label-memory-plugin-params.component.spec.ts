import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelMemoryPluginParamsComponent } from './label-memory-plugin-params.component';

describe('LabelMemoryPluginParamsComponent', () => {
  let component: LabelMemoryPluginParamsComponent;
  let fixture: ComponentFixture<LabelMemoryPluginParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelMemoryPluginParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelMemoryPluginParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
