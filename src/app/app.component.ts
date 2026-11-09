import { Component, OnInit, OnDestroy } from '@angular/core';
import Lenis from 'lenis';
import { TranslateService } from '@ngx-translate/core';
import {LanguageService} from "src/app/services/language/language.service"
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ParticlesService } from './services/particles/particles.service';
import { LoadingService } from './services/loading/loading.service';
import { prefersReducedMotion } from './utils/reduced-motion';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'juandavidch-portfolio';
  appContentVisible = false;
  private lenis: Lenis;

  constructor(
    private translateService: TranslateService,
    private location: Location,
    private languageService: LanguageService,
    private particlesService: ParticlesService,
    private loadingService: LoadingService
    ){
    }
  ngOnInit(): void{

    this.languageService.initLanguage()

    // Title and meta description live in src/index.html (single source for SEO/social previews).

    // Inicializar partículas globales después de un breve delay
    // Skipped entirely when the user prefers reduced motion.
    if (!prefersReducedMotion()) {
      setTimeout(() => {
        this.particlesService.init();
      }, 100);
    }
  }

  private initLenis(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false
    });

    // Función de animación
    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  ngOnDestroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
    }

    // Destruir partículas
    this.particlesService.destroy();
  }

  onSplashAnimationCompleted(): void {
    this.appContentVisible = true;
    
    // Inicializar Lenis después de que el contenido sea visible
    // Smooth scrolling is motion too: keep native scrolling for reduced-motion users.
    if (!prefersReducedMotion()) {
      setTimeout(() => {
        this.initLenis();
      }, 100);
    }
    
    // Iniciar animaciones de los componentes
    this.loadingService.startAnimations();
  }

}
