import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelMemory2PluginParamsComponent } from './label-memory2-plugin-params.component';

describe('LabelMemory2PluginParamsComponent', () => {
  let component: LabelMemory2PluginParamsComponent;
  let fixture: ComponentFixture<LabelMemory2PluginParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelMemory2PluginParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelMemory2PluginParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
