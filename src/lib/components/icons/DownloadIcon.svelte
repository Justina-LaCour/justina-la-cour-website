<script lang="ts">
    interface Props {
        class?: string;
    }

    let { class: className = "" }: Props = $props();
</script>

<svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
>
    <path
        fill="currentColor"
        d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"
    />
    <path fill="currentColor" d="M10 15l5-6h-4V1H9v8H5l5 6z" />
</svg>
