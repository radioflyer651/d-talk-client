import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattingJobListComponent } from './chatting-job-list.component';

describe('ChattingJobListComponent', () => {
  let component: ChattingJobListComponent;
  let fixture: ComponentFixture<ChattingJobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChattingJobListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChattingJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
