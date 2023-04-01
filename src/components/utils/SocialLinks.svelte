<script lang="ts">
    import { socialMedias } from "../../stores/socialMedias";
</script>

<ul>
    {#if $socialMedias.youtube.handle}
    <li>
        <a href="https://www.youtube.com/{$socialMedias.youtube.handle}" target="_blank" rel="noopener noreferrer">
            <img src="/icons/youtube.svg" alt="Youtube" class="icon" />
        </a>
    </li>
    {/if}
    {#if $socialMedias.facebook.handle}
    <li>
        <a href="https://www.facebook.com/{$socialMedias.facebook.handle}" target="_blank" rel="noopener noreferrer">
            <img src="/icons/facebook.svg" alt="Facebook" class="icon" />
        </a>
    </li>
    {/if}
    {#if $socialMedias.instagram.handle}
        <li>
            <a href="https://www.instagram.com/{$socialMedias.instagram.handle}" target="_blank" rel="noopener noreferrer">
                <img src="/icons/instagram.svg" alt="Instagram" class="icon" />
            </a>
        </li>
    {/if}
</ul>

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 0.5rem;
    }

    a {
        display: block;
        height: 2rem;
        padding: 0.25rem;
        border-radius: 0.5rem;
        transition: 0.25s;
    }

    a:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }

    img {
        display: block;
        height: inherit;
    }
</style>