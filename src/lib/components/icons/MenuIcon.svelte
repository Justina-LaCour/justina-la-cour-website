<script lang="ts">
    interface Props {
        class?: string;
    }

    let { class: className = "" }: Props = $props();
</script>

<svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 72"
    aria-hidden="true"
    focusable="false"
>
    <path
        d="M8 17h56M8 36h56M8 56h56"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
    />
</svg>
