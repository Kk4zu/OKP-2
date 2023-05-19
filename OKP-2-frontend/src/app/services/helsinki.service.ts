import { Injectable } from '@angular/core';
import { ActivityV2, PlaceV2, Event } from '../models/helsinki-api-model';
import { ApiTypes } from '../models/IApiResponse';

type ApiData = PlaceV2 | ActivityV2 | Event;

@Injectable({
    providedIn: 'root'
})
export class HelsinkiService {

    constructor() { }

    getName(data: ApiData, type: ApiTypes) {
        let name: string;

        if (type == "Place") {
            let place = data as PlaceV2;
            name = place.name.fi ?? place.name.en;
        }
        else if (type == "Event") {
            let event = data as Event;
            name = event.name.fi ?? event.name.en;
        }
        else if (type == "Activity") {
            let activity = data as ActivityV2;
            name = activity.descriptions['fi']?.name ?? activity.descriptions['en']?.name;
        }
        
        return name;
    }

    getDescription(data: ApiData, type: ApiTypes) {
        let description: string;

        if (type == "Place") {
            let place = data as PlaceV2;
            description = place.description.body;
        }
        else if (type == "Event") {
            let event = data as Event;
            description = event.description.body;
        }
        else if (type == "Activity") {
            let activity = data as ActivityV2;
            description = activity.descriptions['fi']?.name ?? activity.descriptions['en']?.name;
        }
        
        return description.replace(/<\/?[^>]+(>|$)/g, '');
    }

    getLink(data: ApiData, type: ApiTypes) {
        let link: string;

        if (type == "Place") {
            let place = data as PlaceV2;
            link = place.info_url;
        }
        else if (type == "Event") {
            let event = data as Event;
            link = event.info_url;
        }
        else if (type == "Activity") {
            let activity = data as ActivityV2;
            link = activity.siteUrl;
        }
        
        return link;
    }

    hasLink(data: ApiData, type: ApiTypes) {
        return !!this.getLink(data, type);
    }

    getCoordinates(data: ApiData, type: ApiTypes) {
        let position: { lat?: number; lon?: number };
      
        if (type === "Place") {
          let place = data as PlaceV2;
          position = { lat: place.location?.lat, lon: place.location?.lon };
        } else if (type === "Event") {
          let event = data as Event;
          position = { lat: event.location?.lat, lon: event.location?.lon };
        } else if (type === "Activity") {
          let activity = data as ActivityV2;
          if (activity.address?.location) {
            const { lat, long } = activity.address.location;
            position = { lat, lon: long };
          } else {
            console.log('Ei sijaintitietoja.')
          }
        }
      
        return { lat: position.lat ?? 0, lon: position.lon ?? 0 };
      }

    getAddress(data: ApiData, type: ApiTypes) {
        let addresses: { street_address: string, postal_code: string, city: string }[] = [];

        if (type == "Place") {
            let place = data as PlaceV2;
            addresses.push({
            street_address: place.location.address.street_address,
            postal_code: place.location.address.postal_code,
            city: place.location.address.locality
        });
        }
        else if (type == "Event") {
            let event = data as Event;
            addresses.push({
            street_address: event.location.address.street_address,
            postal_code: event.location.address.postal_code,
            city: event.location.address.locality
        });
        }
        else if (type == "Activity") {
            let activity = data as ActivityV2;
            addresses.push({
            street_address: activity.address.streetName,
            postal_code: activity.address.postalCode,
            city: activity.address.city
        });
        }
    
        return addresses;
    }

    getId(data: ApiData) {
        return data.id;
      }
}
