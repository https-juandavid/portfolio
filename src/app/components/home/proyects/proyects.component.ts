import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { prefersReducedMotion } from 'src/app/utils/reduced-motion';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
  standalone: false,
})
export class ProyectsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 700,
    items: 1,
    autoplay: !prefersReducedMotion(),
    autoplayTimeout: 3000,
  };

  // Owl clones slides to loop; with a single image that produces duplicated track keys (NG0955).
  singleImageOptions: OwlOptions = {
    ...this.customOptions,
    loop: false,
    autoplay: false,
  };

  @ViewChild('imgContainer') imgContainer: ElementRef;

  constructor(public analyticsService: AnalyticsService) {}

  ngOnInit(): void {}

  /** "Monitoreo de eficiencia · Klixmant" -> "monitoreo-de-eficiencia-klixmant" (valid, space-free slide ids). */
  slug(text: string): string {
    return (text || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  debug() {
    this.imgContainer?.nativeElement.scroll({
      top: this.imgContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
}
