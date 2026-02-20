import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoftSkillsComponent } from './soft-skills.component';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

describe('SoftSkillsComponent', () => {
  let component: SoftSkillsComponent;
  let fixture: ComponentFixture<SoftSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftSkillsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AnalyticsService,
          useValue: { sendAnalyticEvent: () => {} },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
