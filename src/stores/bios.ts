import { Status } from "../types/status";
import { writable } from "svelte/store";

export interface Biography {
    short: string;
    full: string;
}

// short["en"] ; short["fr"] ; short["de"] ...
export interface BioFetchResult {
    biography: Biography;
    status: Status;
}

// Key is language code (i.e. "en", "fr", "de")
export type MultilingualBioFetchResult = { [key: string]: BioFetchResult };

export const bios = writable<MultilingualBioFetchResult>({});

interface RawBio {
    name: string;
    fields: {
        short: {
            stringValue: string;
        },
        full: {
            stringValue: string;
        }
    }
}

export async function updateBio(lang: string = "en") {
    bios.update((bioFetches: MultilingualBioFetchResult): MultilingualBioFetchResult => {
        return {
            ...bioFetches,
            [lang]: {
                biography: {
                    short: "",
                    full: "",
                },
                status: Status.PENDING
            }
        };
    });

    try {
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/justina-la-cour-website/databases/(default)/documents/bios/${lang}`);
        const json = await res.json() as RawBio;
        
        bios.update((bioFetches: MultilingualBioFetchResult): MultilingualBioFetchResult => {
            return {
                ...bioFetches,
                [lang]: {
                    biography: {
                        short: json.fields.short.stringValue,
                        full: json.fields.full.stringValue,
                    },
                    status: Status.OK
                }
            };
        });
    } catch (error) {
        bios.update((bioFetches: MultilingualBioFetchResult): MultilingualBioFetchResult => {
            return {
                ...bioFetches,
                [lang]: {
                    biography: {
                        short: "",
                        full: "",
                    },
                    status: Status.FAILED
                }
            };
        });
    }
}