import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { AnimationsService } from 'src/app/services/animations/animations.service';

@Component({
  selector: 'app-soft-skills',
  templateUrl: './soft-skills.component.html',
  styleUrls: ['./soft-skills.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('zoomIn', [
      transition(':enter', [
        style({ transform: 'scale(0.3)', opacity: 0 }),
        animate(
          '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'scale(1)', opacity: 1 }),
        ),
      ]),
    ]),
  ],
  standalone: false,
})
export class SoftSkillsComponent implements OnInit, AfterViewInit {
  isImageModalOpen = false;

  constructor(
    public analyticsService: AnalyticsService,
    private animationsService: AnimationsService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    const section = this.elementRef.nativeElement;

    // Animate title
    const title = section.querySelector('.section-title');
    if (title) {
      this.animationsService.observeElement(title, {
        type: 'slideInUp',
        duration: 1000,
      });
    }

    // Animate image
    const imageContainer = section.querySelector('.soft-skills-img-container');
    if (imageContainer) {
      this.animationsService.observeElement(imageContainer as HTMLElement, {
        type: 'morphIn',
        duration: 1200,
        delay: 200,
      });
    }

    // Animate skills with stagger
    const skills = section.querySelectorAll('.skill-card');
    skills.forEach((skill: HTMLElement, index: number) => {
      this.animationsService.observeElement(skill, {
        type: 'fadeInUp', // Or fadeInLeft since it's on the right now? About used FadeInLeft for text on Left. Maybe FadeInRight?
        duration: 800,
        delay: 400 + index * 100,
      });

      this.animationsService.addHoverEffects(skill, ['lift', 'glow']);
    });
  }
}
