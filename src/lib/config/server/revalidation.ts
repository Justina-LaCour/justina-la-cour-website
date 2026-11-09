import { PUBLIC_ARTKYT_BIO_ID, PUBLIC_ARTKYT_GALLERY_ID } from "$app/env/public";
import { site } from "$lib/config/config";
import type { ArtkytResourceType } from "$lib/artkyt/types";
import { includesResource, RevalidationMap } from "$lib/server/revalidationMap";

export const revalidationMap = new RevalidationMap<ArtkytResourceType>({
    supportedLanguages: site.locales.supported,
    allRoutes: ({ localizeAndResolve }) => [
        ...localizeAndResolve("/[lang]", {}),
        ...localizeAndResolve("/[lang]/bio", {}),
        ...localizeAndResolve("/[lang]/news", {}),
        ...localizeAndResolve("/[lang]/concerts", {}),
        ...localizeAndResolve("/[lang]/media", {}),
        ...localizeAndResolve("/[lang]/contact", {})
    ],
    resolvers: {
        links: (_selection, { allRoutes }) => allRoutes(),
        bios: (selection, { localizeAndResolve }) =>
            includesResource(selection, PUBLIC_ARTKYT_BIO_ID)
                ? [
                    ...localizeAndResolve("/[lang]", {}),
                    ...localizeAndResolve("/[lang]/bio", {})
                ]
                : [],
        news: (selection, { localizeAndResolve }) => [
            ...localizeAndResolve("/[lang]", {}),
            ...localizeAndResolve("/[lang]/news", {}),
            ...(selection === "all" ? [] : selection.flatMap((id) =>
                localizeAndResolve("/[lang]/news/[id]", { id })
            ))
        ],
        concerts: (_selection, { localizeAndResolve }) => [
            ...localizeAndResolve("/[lang]", {}),
            ...localizeAndResolve("/[lang]/concerts", {})
        ],
        recordings: (_selection, { localizeAndResolve }) => [
            ...localizeAndResolve("/[lang]", {}),
            ...localizeAndResolve("/[lang]/media", {})
        ],
        galleries: (selection, { localizeAndResolve }) =>
            includesResource(selection, PUBLIC_ARTKYT_GALLERY_ID)
                ? localizeAndResolve("/[lang]/media", {})
                : []
    }
});
