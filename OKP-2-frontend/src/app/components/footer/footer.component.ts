import { Component, HostListener } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBars, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  faMapLocationDot = faMapLocationDot;
  faGithub = faGithub;
  showFooter: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Check if the user has scrolled to the bottom of the page
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      0;
    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight || 0;

    this.showFooter = scrollPosition + windowHeight >= documentHeight;
  }
}
