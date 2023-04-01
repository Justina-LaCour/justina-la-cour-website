import { Status } from "../types/status";
import { writable } from "svelte/store";

export interface SocialMediaFetchResult {
    facebook: {
        handle: string;
    };
    instagram: {
        handle: string;
    };
    twitter: {
        handle: string;
    };
    youtube: {
        handle: string;
    };
    status: Status;
}

export const socialMedias = writable<SocialMediaFetchResult>({
    facebook: {
        handle: ""
    },
    instagram: {
        handle: ""
    },
    twitter: {
        handle: ""
    },
    youtube: {
        handle: ""
    },
    status: Status.PENDING
});

export async function updateSocialMedias() {
    try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/justina-la-cour-website/databases/(default)/documents/socialMedias/handles");
        const json = await res.json();
        socialMedias.set({
            facebook: {
                handle: json.fields.facebook?.stringValue ?? ""
            },
            instagram: {
                handle: json.fields.instagram?.stringValue ?? ""
            },
            twitter: {
                handle: json.fields.twitter?.stringValue ?? ""
            },
            youtube: {
                handle: json.fields.youtube?.stringValue ?? ""
            },
            status: Status.OK
        });
    } catch (error) {
        socialMedias.set({
            facebook: {
                handle: ""
            },
            instagram: {
                handle: ""
            },
            twitter: {
                handle: ""
            },
            youtube: {
                handle: ""
            },
            status: Status.FAILED
        });
    }
}