import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {
  faLandmark,
  faMasksTheater,
  faPersonBiking,
} from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild('search') searchField: ElementRef;
  @ViewChild(GoogleMap) map: GoogleMap;

  faLandmark = faLandmark;
  faPersonBiking = faPersonBiking;
  faMasksTheater = faMasksTheater;
  userTitle = 'Sijaintisi';
  selectedMarker: any;

  // switch case rules
  public showPlacesMarkers = true;
  public showActivitiesMarkers = false;
  public showEventsMarkers = false;

  // user marker settings
  userCurrentLocation = false;
  userMarkerOptions: google.maps.MarkerOptions = {
    draggable: true
  };

  // activity marker settings
  activityMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      path: faPersonBiking.icon[4] as string,
      fillColor: '#0000ff', // color of the marker
      fillOpacity: 1,
      anchor: new google.maps.Point(
        faPersonBiking.icon[0] / 2, // width
        faPersonBiking.icon[1] // height
      ),
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 0.05, // size of the marker
    },
  };

  // event marker settings
  eventMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      path: faMasksTheater.icon[4] as string,
      fillColor: '#8a2be2',
      fillOpacity: 1,
      anchor: new google.maps.Point(
        faMasksTheater.icon[0] / 2, // width
        faMasksTheater.icon[1] // height
      ),
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 0.05,
    },
  };

  // place marker settings
  placeMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      path: faLandmark.icon[4] as string,
      fillColor: '#d70909',
      fillOpacity: 1,
      anchor: new google.maps.Point(
        faLandmark.icon[0] / 2, // width
        faLandmark.icon[1] // height
      ),
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 0.05,
    },
  };

  // marker info window settings
  infoWindowOptions: google.maps.InfoWindowOptions = {
    maxWidth: 300
  };

  constructor(
    public dataService: DataService,
    private sharedService: SharedService,
    private ngZone: NgZone) {}

  ngOnInit(): void {
    // get user's current location and keep track of it via geolocation api
    this.getUserLocation();

    // update #userMarker visibility
    this.userCurrentLocation = true;

    this.switchCase();
  }

  getUserLocation() {
    if (!navigator.geolocation)
      return console.log('Geolocation is not supported by this browser.');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.dataService.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.dataService.pan = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.updateLocation();
        console.log(this.dataService.center);

        this.dataService.getFavoritesData();
        this.dataService.getActivitiesData();
        this.dataService.getEventsData();
        this.dataService.getPlacesData();
      },
      (error) => {
        console.log('Error getting user location:', error.message);
        // set helsinki city center as location if user denies geolocation
        this.dataService.center = { lat: 60.172727, lng: 24.939491 };
        this.updateLocation();
        console.log(this.dataService.center);

        this.dataService.getFavoritesData();
        this.dataService.getActivitiesData();
        this.dataService.getEventsData();
        this.dataService.getPlacesData();
      }
    );
  }

  openInfoWindow(marker, activity) {
    this.selectedMarker = activity;
    this.infoWindow.open(marker);
    this.dataService.zoomIn();

    // set zoom back to default when info window is closed
    this.infoWindow.closeclick.subscribe(() => {
      this.dataService.zoom = 15;
    });
  }

  switchCase() {
    this.sharedService.getCurrentCase().subscribe((caseValue) => {
      switch (caseValue) {
        case 'places':
          this.showPlacesMarkers = true;
          this.showActivitiesMarkers = false;
          this.showEventsMarkers = false;
          break;

        case 'activities':
          this.showPlacesMarkers = false;
          this.showActivitiesMarkers = true;
          this.showEventsMarkers = false;
          break;

        case 'events':
          this.showPlacesMarkers = false;
          this.showActivitiesMarkers = false;
          this.showEventsMarkers = true;
          break;

        default:
          break;
      }
    });
  }

  updateLocation() {
    // send user geolocation coordinates to data service
    const userLat = this.dataService.center.lat;
    const userLng = this.dataService.center.lng;
    this.dataService.updateUserLocationForApiDataGet(userLat, userLng);
    this.searchField.nativeElement.value = "";
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    const userLat = event.latLng.lat();
    const userLng = event.latLng.lng();
    this.dataService.pan = { lat: userLat, lng: userLng };
    this.dataService.updateUserLocationForApiDataGet(userLat, userLng);
    this.dataService.getFavoritesData();
    this.dataService.getActivitiesData();
    this.dataService.getEventsData();
    this.dataService.getPlacesData();
    this.searchField.nativeElement.value = "";
  }

  ngAfterViewInit(): void {
    this.searchInput();
  }

  searchInput() {
    // set input options
    const input = this.searchField.nativeElement;
    const options = {
      types: [],
      componentRestrictions: {'country': ['FI']},
      fields: ["formatted_address", "geometry", "name"]
    };

    // align input field on top of map
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchField.nativeElement,
    );

    // bind autocomplete to input
    const autocomplete = new google.maps.places.Autocomplete(input, options);
      
    // set action to handle suggestion click
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        // verify result.
        if (!place.geometry || !place.geometry.location) {
        return;
        }

        // save place coordinates
        const resultPlaceLat = place.geometry.location?.lat();
        const resultPlaceLng = place.geometry.location?.lng();

        // update user marker and pan to selected place
        this.dataService.center = { lat: resultPlaceLat, lng: resultPlaceLng };
        this.dataService.pan = { lat: resultPlaceLat, lng: resultPlaceLng };

        // update user location to selected place
        this.dataService.updateUserLocationForApiDataGet(resultPlaceLat, resultPlaceLng);

        // fetch api results near new location
        this.dataService.getFavoritesData();
        this.dataService.getActivitiesData();
        this.dataService.getEventsData();
        this.dataService.getPlacesData();
      });
    });
  }

} 


