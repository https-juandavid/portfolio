import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { AnimationsService } from 'src/app/services/animations/animations.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  standalone: false,
})
export class EducationComponent implements AfterViewInit {
  constructor(
    public analyticsService: AnalyticsService,
    private animationsService: AnimationsService,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    const section: HTMLElement = this.elementRef.nativeElement;

    const title = section.querySelector('.section-title');
    if (title) {
      this.animationsService.observeElement(title as HTMLElement, {
        type: 'slideInUp',
        duration: 1000,
      });
    }

    // Groups are static markup (their list items render once translations load).
    const groups = section.querySelectorAll('.edu-group');
    groups.forEach((group: Element, index: number) => {
      this.animationsService.observeElement(group as HTMLElement, {
        type: 'fadeInUp',
        duration: 800,
        delay: 200 + index * 100,
      });
    });
  }
}
