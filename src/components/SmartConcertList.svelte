<script lang="ts">
    import { concerts, Status } from "../stores/concerts";
    import ConcertsList from "./ConcertsList.svelte";

    export let mode: "upcoming" | "past" = "upcoming";

    export let maxCount = -1;

    $: concertList = mode === "upcoming" ? $concerts.upcoming : $concerts.past;

</script>


{#if $concerts.status === Status.OK}
    <ConcertsList concertsList={concertList} maxCount={maxCount} />
{:else if $concerts.status === Status.FAILED}
    <p>An error occured while fetching the concerts</p>
{:else if $concerts.status === Status.PENDING}
    <p>Loading</p>
{/if}