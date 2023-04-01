import { Status } from "../types/status";
import { writable } from "svelte/store";

export interface GalleryPicture {
    url: string;
    thumbnailUrl: string;
    copyright: string;
    uploadedDate: Date;
}

export interface GalleryFetchResult {
    pictures: GalleryPicture[];
    status: Status;
}

export const gallery = writable<GalleryFetchResult>({
    pictures: [],
    status: Status.PENDING
});

interface RawGalleryPicture {
    name: string;
    fields: {
        url: {
            stringValue: string;
        }
        thumbnailUrl: {
            stringValue: string;
        }
        copyright: {
            stringValue: string;
        }
        uploadedDate: {
            timestampValue: string;
        }
    }
}

export async function updateGallery() {
    try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/justina-la-cour-website/databases/(default)/documents/gallery");
        const json = await res.json();

        const pictures: GalleryPicture[] = [];
        
        json.documents.forEach((rawPicture: RawGalleryPicture) => {
            const picture: GalleryPicture = {
                url: rawPicture.fields.url.stringValue,
                thumbnailUrl: rawPicture.fields.thumbnailUrl.stringValue,
                copyright: rawPicture.fields.copyright.stringValue,
                uploadedDate: new Date(rawPicture.fields.uploadedDate.timestampValue),
            };

            pictures.push(picture);
        });

        pictures.sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime());

        gallery.set({
            pictures,
            status: Status.OK
        });
    } catch (error) {
        gallery.set({
            pictures: [],
            status: Status.FAILED
        });
    }
}