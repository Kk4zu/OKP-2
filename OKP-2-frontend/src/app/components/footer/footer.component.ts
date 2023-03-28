import { Component } from '@angular/core';
import { faLandmark, faMasksTheater, faPersonBiking } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faLandmark = faLandmark; 
    faPersonBiking = faPersonBiking;
    faMasksTheater = faMasksTheater;
}
