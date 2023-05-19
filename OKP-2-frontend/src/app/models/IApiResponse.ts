import { ActivityV2, PlaceV2, Event } from "./helsinki-api-model";

export interface APIResponse {
    data: {
        result: string;
    }
}

export type ApiTypes = "Activity" | "Event" | "Place";

export interface APIFavoritesResponse {
    status: string;
    favorites: {
        activities: string[];
        activityErrors: string[];
        events: string[];
        eventErrors: string[];
        places: string[];
        placeErrors: string[];
        userdata: UserData[];
    }
}

interface UserData {
  user: string;
  id: string;
  type: string;
}
