import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

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
    autoplay: true,
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

  debug() {
    this.imgContainer?.nativeElement.scroll({
      top: this.imgContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
}
