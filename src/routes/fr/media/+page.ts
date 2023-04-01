import { updateGallery } from "../../../stores/gallery";
import { updateVideos } from "../../../stores/videos";

export async function load() {
    await updateGallery();
    await updateVideos();
}