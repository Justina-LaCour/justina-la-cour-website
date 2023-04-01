<script lang="ts">
    import { goto, afterNavigate } from "$app/navigation";

    let select: HTMLSelectElement;

    const languages = [
        {
            value: "en",
            display: "EN"
        },
        {
            value: "fr",
            display: "FR"
        }
    ];

    afterNavigate(() => {
        const parts = window.location.pathname.split("/");
        parts.shift(); // "/er/tz".split("/") -> ["", "er", "tz"]
        select.value = parts[0];
    });

    function languageChanged() {
        const parts = window.location.pathname.split("/");
        parts.shift(); // "/er/tz".split("/") -> ["", "er", "tz"]
        parts[0] = languages[select.selectedIndex].value;

        goto(`/${parts.join("/")}`);
    }
</script>


<select name="language-picker" id="language-picker" bind:this={select} on:change={languageChanged}>
    {#each languages as lang}
        <option value={lang.value} class="language-option">{lang.display}</option>
    {/each}
</select>

<style>

    select {
        font-family: inherit;
        font-size: 1.125rem;
        background: transparent;
        color: white;
        border: none;
        cursor: pointer;

        border-radius: 0.5rem;

        transition: 0.2s;
    }
    
    select:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }
    
    option {
        font-family: inherit;
        font-size: 1.125rem;
        cursor: pointer;
        border-top-left-radius: 0;
        border-top-right-radius: 0;

        background: rgba(0, 0, 0, 0.5);
    }

</style>