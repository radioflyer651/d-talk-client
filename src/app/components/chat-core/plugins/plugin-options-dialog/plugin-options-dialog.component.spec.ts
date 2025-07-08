import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginOptionsDialogComponent } from './plugin-options-dialog.component';

describe('PluginOptionsDialogComponent', () => {
  let component: PluginOptionsDialogComponent;
  let fixture: ComponentFixture<PluginOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PluginOptionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
