import type { Concert } from "src/types/concert";
import { writable } from "svelte/store";

export enum Status {
    OK,
    FAILED,
    PENDING
};

export interface ConcertFetchResult {
    upcoming: Concert[];
    past: Concert[];
    status: Status;
}

export const concerts = writable<ConcertFetchResult>({
    upcoming: [],
    past: [],
    status: Status.PENDING
});

interface RawConcert {
    name: string;
    fields: {
        date: {
            timestampValue: string;
        },
        endDate?: {
            timestampValue: string;
        },
        location: {
            stringValue: string;
        },
        description: {
            stringValue: string;
        },
        url?: {
            stringValue: string;
        }
    }
}

export async function updateConcerts() {
    try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/cyprien-keiser/databases/(default)/documents/concerts");
        const json = await res.json();

        const upcoming: Concert[] = [];
        const past: Concert[] = [];
        
        json.documents.forEach((rawConcert: RawConcert) => {
            const concert: Concert = {
                location: rawConcert.fields.location.stringValue,
                description: rawConcert.fields.description.stringValue,
                date: new Date(rawConcert.fields.date.timestampValue)
            };

            if (concert.date.getTime() < Date.now()) {
                past.push(concert);
            } else {
                upcoming.push(concert);
            }
        });

        upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
        past.sort((a, b) => b.date.getTime() - a.date.getTime());
    
        concerts.set({
            upcoming,
            past,
            status: Status.OK
        });
    } catch (error) {
        concerts.set({
            upcoming: [],
            past: [],
            status: Status.FAILED
        });
    }
}