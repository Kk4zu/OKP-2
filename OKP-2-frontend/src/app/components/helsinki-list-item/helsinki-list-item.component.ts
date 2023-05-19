import { Component, Input } from '@angular/core';
import { ActivityV2, PlaceV2, Event } from 'src/app/models/helsinki-api-model';
import { DataService } from 'src/app/services/data.service';
import { HelsinkiService } from 'src/app/services/helsinki.service';
import { faCircleInfo, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
import { APIFavoritesResponse, ApiTypes } from 'src/app/models/IApiResponse';
import { AccountService } from 'src/app/services/account.service';

type ApiData = PlaceV2 | ActivityV2 | Event;

@Component({
    selector: 'app-helsinki-list-item',
    templateUrl: './helsinki-list-item.component.html',
    styleUrls: ['./helsinki-list-item.component.css']
})
export class HelsinkiListItemComponent {

    faCircleInfo = faCircleInfo;
    faLocationDot = faLocationDot;
    faStar = faStar;

    textShow: boolean | undefined;
    showText() {
        this.textShow = true;
    }
    hideText() {
        this.textShow = false;
    }

    toggleFavorite() {
        this.favorite = !this.favorite;
        if (this.favorite) this.dataService.addFavorite(this.type, this.helsinkiService.getId(this.data)).subscribe((res: APIFavoritesResponse) => {
            // this.activities = result.rows;
            console.log("Favorites");
            console.log(res.favorites);
        });
        else this.dataService.removeFavorite(this.type, this.helsinkiService.getId(this.data)).subscribe((res: APIFavoritesResponse) => {
            // this.activities = result.rows;
            console.log("Favorites");
            console.log(res.favorites);
        });
    }

    @Input()
    public data: ApiData;

    @Input()
    public type: ApiTypes;

    @Input()
    public favorite: boolean;

    constructor(public accountService: AccountService, public helsinkiService: HelsinkiService,
        private dataService: DataService) { }

    showOnMap() {
        const resultPlaceLat = this.helsinkiService.getCoordinates(this.data, this.type).lat;
        const resultPlaceLng = this.helsinkiService.getCoordinates(this.data, this.type).lon;
        this.dataService.pan = { lat: resultPlaceLat, lng: resultPlaceLng };
        this.dataService.zoom = 19;
    }
}
