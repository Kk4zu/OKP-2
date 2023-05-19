import { Component } from '@angular/core';
import { faLandmark, faMasksTheater, faPersonBiking } from '@fortawesome/free-solid-svg-icons';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  faLandmark = faLandmark; 
  faPersonBiking = faPersonBiking;
  faMasksTheater = faMasksTheater;

  placesStatus = "block";
  activitiesStatus = "none";
  eventsStatus = "none";

  constructor(private sharedService: SharedService) {}

  public clickHandler(label: string) {
    switch (label) {
      case "places":
        this.sharedService.setCurrentCase('places');
        break;

      case "activities":
        this.sharedService.setCurrentCase('activities');
        break;

      case "events":
        this.sharedService.setCurrentCase('events');
        break;
    
      default:
        break;
    }
  }
}
