<script lang="ts">
    export let date: Date;
    export let compact: boolean;

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
</script>

{#if compact}
    { date.toLocaleDateString() }
{:else}
    <div class="wrapper">
        <div class="year">{ date.getFullYear() }</div>
        <div class="month">{ months[date.getMonth()] }</div>
        <div class="day">{ date.getDate() }</div>
    </div>
{/if}

<style>

    .wrapper {
        width: 5rem;
        height: 5rem;
        border-radius: 1rem;
        background-color: var(--color-primary-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .year {
        font-size: 0.75rem;
    }

    .month {
        font-size: 1.25rem;
    }

    .day {
        font-size: 1rem;
    }

</style>