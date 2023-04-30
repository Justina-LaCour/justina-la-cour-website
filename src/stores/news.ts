import type { News } from "../types/news";
import { Status } from "../types/status";
import { writable } from "svelte/store";

export interface NewsFetchResult {
    news: News[];
    status: Status;
}

export const news = writable<NewsFetchResult>({
    news: [],
    status: Status.PENDING
});

interface RawNews {
    name: string;
    fields: {
        imageUrl: {
            stringValue: string;
        },
        imageCopyright: {
            stringValue: string;
        },
        text: {
            mapValue: {
                fields: {
                    [key: string]: {
                        mapValue: {
                            fields: {
                                title: {
                                    stringValue: string;
                                };
                                content: {
                                    stringValue: string;
                                }
                            }
                        }
                    }
                }
            }
        }
        title: {
            stringValue: string;
        },
        content: {
            stringValue: string;
        },
        date: {
            timestampValue: string;
        },
    }
}

export async function updateNews() {
    try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/justina-la-cour-website/databases/(default)/documents/news");
        const json = await res.json();

        const allNews: News[] = [];
        
        json.documents.forEach((rawNews: RawNews) => {
            const newsItem: News = {
                imageUrl: rawNews.fields.imageUrl.stringValue,
                imageCopyright: rawNews.fields.imageCopyright.stringValue,
                text: {
                    en: {
                        title: rawNews.fields.text.mapValue.fields["en"].mapValue.fields.title.stringValue,
                        content: rawNews.fields.text.mapValue.fields["en"].mapValue.fields.content.stringValue,
                    },
                    fr: {
                        title: rawNews.fields.text.mapValue.fields["fr"].mapValue.fields.title.stringValue,
                        content: rawNews.fields.text.mapValue.fields["fr"].mapValue.fields.content.stringValue,
                    },
                },
                date: new Date(rawNews.fields.date.timestampValue),
            };

            allNews.push(newsItem);
        });

        allNews.sort((a, b) => b.date.getTime() - a.date.getTime());
    
        news.set({
            news: allNews,
            status: Status.OK
        });
    } catch (error) {
        news.set({
            news: [],
            status: Status.FAILED
        });
    }
}