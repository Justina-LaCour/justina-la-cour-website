import { updateConcerts } from "../../stores/concerts";
import { updateNews } from "../../stores/news";
import { updateBio } from "../../stores/bios";
import { updateSocialMedias } from "../../stores/socialMedias";


export async function load() {
    await Promise.all([updateBio(), updateConcerts(), updateSocialMedias(), updateNews()]);
}