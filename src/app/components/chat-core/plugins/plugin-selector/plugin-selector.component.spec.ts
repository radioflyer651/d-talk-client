import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginSelectorComponent } from './plugin-selector.component';

describe('PluginSelectorComponent', () => {
  let component: PluginSelectorComponent;
  let fixture: ComponentFixture<PluginSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PluginSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
