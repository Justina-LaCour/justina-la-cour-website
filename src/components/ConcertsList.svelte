<script lang="ts">
    import type { Concert } from "../types/concert";
    import { browser } from '$app/environment';
    import { onMount } from "svelte";

    export let concertsList: Concert[];

    export let maxCount = -1;

    export let forceCompact = false;

    function formatConcertDate(c: Concert) {
        return c.endDate ? `${c.date.toLocaleDateString()} - ${c.endDate.toLocaleDateString()}` : c.date.toLocaleDateString();
    }

    let autoCompact = false;

    onMount(() => {
        if (browser) {
            window.matchMedia("(max-width: 50rem)").addEventListener("change", (ev) => {
                autoCompact = ev.matches;
            });
        }
    });

    $: truncatedConcerts = maxCount > 0 ? concertsList.slice(0, maxCount) : concertsList;

    $: compact = forceCompact || autoCompact;
</script>

<ul class:compact={compact}>
    {#each truncatedConcerts as concert}
        <li>
            <a href={concert.url} target="_blank" rel="noopener noreferrer">
                <div class="concert-container">
                    <div class="concert-date">{ formatConcertDate(concert) }</div>
                    <div class="concert-title">{ concert.location }</div>
                    <div class="concert-description">{ concert.description }</div>
                </div>
            </a>
        </li>
    {/each}
</ul>

<style>

    ul {
        list-style-type: none;
        margin: 1rem 0;
        padding: 0;
    }
    
    a {
        display: block;
        padding: 0.5rem 0.5rem 0.5rem 0;
        text-decoration: none;
        color: inherit;
        border-top-right-radius: 2rem;
        border-bottom-right-radius: 2rem;

        transition: 0.25s;
    }

    a:hover {
        background-color: rgba(51, 51, 51, 0.1);
        padding-left: 1rem;
    }

    .concert-container {
        display: grid;
        grid-template-areas:
            "date title"
            "date description";
        grid-template-columns: 5rem 1fr;
        gap: 0.5rem 1rem;

        max-width: calc(100% - 1rem);
    }

    .compact .concert-container {
        grid-template-areas:
            "title"
            "date"
            "description";
        grid-template-columns: 1fr;

    }

    .concert-title {
        font-size: 1.25rem;
        font-weight: bold;
        grid-area: title;
    }

    .concert-date {
        grid-area: date;
    }

    .concert-description {
        grid-area: description;
    }

</style>