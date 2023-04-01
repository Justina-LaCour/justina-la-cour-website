import { Status } from "../types/status";
import { writable } from "svelte/store";

export interface Video {
    youtubeHandle: string;
    title: string;
    addedDate: Date;
}

export interface VideosFetchResult {
    videos: Video[];
    status: Status;
}

export const videos = writable<VideosFetchResult>({
    videos: [],
    status: Status.PENDING
});

interface RawVideo {
    name: string;
    fields: {
        youtubeHandle: {
            stringValue: string;
        }
        title: {
            stringValue: string;
        }
        addedDate: {
            timestampValue: string;
        }
    }
}

export async function updateVideos() {
    try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/justina-la-cour-website/databases/(default)/documents/videos");
        const json = await res.json();

        const videosList: Video[] = [];
        
        json.documents.forEach((rawPicture: RawVideo) => {
            const picture: Video = {
                youtubeHandle: rawPicture.fields.youtubeHandle.stringValue,
                title: rawPicture.fields.title.stringValue,
                addedDate: new Date(rawPicture.fields.addedDate.timestampValue),
            };

            videosList.push(picture);
        });

        videosList.sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime());

        videos.set({
            videos: videosList,
            status: Status.OK
        });
    } catch (error) {
        videos.set({
            videos: [],
            status: Status.FAILED
        });
    }
}