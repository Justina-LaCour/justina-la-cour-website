<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { concerts } from "../../../stores/concerts";
    import type { Concert } from "../../../types/concert";

    const dispatch = createEventDispatcher();

    export let selection: { [key: number]: boolean } = {};

    function toggleSelection(index: number) {
        selection[index] = !selection[index];

        dispatch("selection-changed");
    }

    export function getSelectedConcerts(): Concert[] {
        const selectedConcerts: Concert[] = [];

        for (const index in selection) {
            const isSelected = selection[index];
            if (isSelected) {
                selectedConcerts.push($concerts.upcoming[index]);
            }
        }

        return selectedConcerts;
    }

    function autoSelectNextN() {
        let n = parseInt(prompt("How many concerts do you want to include ?", "5") ?? "0");

        if (n >= $concerts.upcoming.length) {
            n = $concerts.upcoming.length;
            alert(`The list doesn't contain as many concerts, will select only ${n} concerts`);
        }

        for (let i = 0; i < n; i++) {
            selection[i] = true;
        }

        dispatch("selection-changed");
    }

    function autoSelectMonth(month: number, year: number) {
        $concerts.upcoming.forEach((concert: Concert, i: number) => {
            if (concert.date.getMonth() === month && concert.date.getFullYear() === year) {
                selection[i] = true;
            }
        });

        dispatch("selection-changed");
    }
    
    function autoSelectThisMonth() {
        const now = new Date();
        autoSelectMonth(now.getMonth(), now.getFullYear());
    }

    function autoSelectNextMonth() {
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        autoSelectMonth(now.getMonth(), now.getFullYear());
    }

    function clearSelection() {
        Object.keys(selection).forEach((key) => {
            const i = key as unknown as number; // Fuck TS
            selection[i] = false;
        });

        dispatch("selection-changed");
    }
</script>

<div class="mini-toolbar">
    <button class="toolbar-button" on:click={autoSelectNextN}>Next N</button>
    <button class="toolbar-button" on:click={autoSelectThisMonth}>This month</button>
    <button class="toolbar-button" on:click={autoSelectNextMonth}>Next month</button>
    <button class="toolbar-button" on:click={clearSelection}>Clear</button>
</div>
<ul class="selector">
    {#each $concerts.upcoming as concert, i}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li class:selected={selection[i]} on:click={() => { toggleSelection(i); }}>
            { concert.date.toLocaleDateString() } <br />
            {concert.location}
        </li>
    {/each}
</ul>

<style>

    .mini-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }

    .selector {
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 20rem;

        overflow: auto;
    }

    .selector li {
        padding: 0.5rem;
        cursor: pointer;

        transition: 0.25s;
    }

    .selector li:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .selector li.selected {
        background-color: rgba(0, 0, 0, 0.3);
    }

</style>