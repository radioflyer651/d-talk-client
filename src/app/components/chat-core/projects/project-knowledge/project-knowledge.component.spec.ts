import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectKnowledgeComponent } from './project-knowledge.component';

describe('ProjectKnowledgeComponent', () => {
  let component: ProjectKnowledgeComponent;
  let fixture: ComponentFixture<ProjectKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectKnowledgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
