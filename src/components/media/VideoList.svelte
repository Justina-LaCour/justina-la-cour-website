<script lang="ts">
    import { videos } from "../../stores/videos";
    import { Status } from "../../types/status";
    import LoadingSpinner from "../../components/utils/LoadingSpinner.svelte";

    export let loadingText: string = "Loading videos";
</script>

{#if $videos.status === Status.PENDING}
    <LoadingSpinner message={loadingText} />
{:else}
    <div class="video-gallery auto-grid">
        {#each $videos.videos as video}
            <div>
                <iframe class="yt-video" width="560" height="315" src="https://www.youtube.com/embed/{video.youtubeHandle}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="video-title">{video.title}</div>
            </div>
        {/each}
    </div>
{/if}

<style>

    .video-gallery {
        --player-max-size: 540px;
        --cell-width: min(90vw, var(--player-max-size));
        --cell-height: calc(var(--cell-width) * 9 / 16 + 3rem);
    }

    .yt-video {
        margin-bottom: 0.5rem;
    }

    .video-title {
        text-align: center;
    }

</style>