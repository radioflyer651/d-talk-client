import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyScreenComponent } from './dummy-screen.component';

describe('DummyScreenComponent', () => {
  let component: DummyScreenComponent;
  let fixture: ComponentFixture<DummyScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
