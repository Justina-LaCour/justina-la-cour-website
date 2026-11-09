import {
    PUBLIC_ARTKYT_PROFILE_ID,
    PUBLIC_ARTKYT_WEBSITE_ID
} from "$app/env/public";
import { ArtkytClient } from "./client";

export const artkytClient = new ArtkytClient({
    profileId: PUBLIC_ARTKYT_PROFILE_ID,
    websiteId: PUBLIC_ARTKYT_WEBSITE_ID
});
