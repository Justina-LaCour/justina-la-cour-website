<script lang="ts">
    import type { Snippet } from "svelte";

    interface FormFieldAttributes {
        id: string;
        name: string;
        invalid?: "true";
        describedBy?: string;
    }

    interface Props {
        label: string;
        name: string;
        error?: string;
        icon?: string;
        iconAlt?: string;
        children: Snippet<[FormFieldAttributes]>;
    }

    let {
        label,
        name,
        error,
        icon,
        iconAlt = "",
        children
    }: Props = $props();

    const instanceId = $props.id();
    const controlId = $derived(`${instanceId}-${name}`);
    const errorId = $derived(`${controlId}-error`);
    const fieldAttributes = $derived<FormFieldAttributes>({
        id: controlId,
        name,
        invalid: error ? "true" : undefined,
        describedBy: error ? errorId : undefined
    });
</script>

<div class="form-field mb-4">
    <label for={controlId} class="flex items-center gap-2">
        {#if icon}
            <img class="block h-6" src={icon} alt={iconAlt} />
        {/if}
        <span>{label}</span>
    </label>

    {#if error}
        <p id={errorId} class="mt-1 text-red-800">{error}</p>
    {/if}

    {@render children(fieldAttributes)}
</div>

<style>
    .form-field :global(input),
    .form-field :global(select),
    .form-field :global(textarea) {
        display: block;
        margin-top: 0.25rem;
        font-size: 1.125rem;
        padding: 0.5rem;
        box-shadow: none;
        border: 1px solid var(--color-control-border);
        border-radius: 0.25rem;
        background: white;
        transition-property: border-color, box-shadow;
        transition-duration: var(--transition-duration-ui);
    }

    .form-field :global(input:focus),
    .form-field :global(select:focus),
    .form-field :global(textarea:focus) {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 0.2rem var(--color-focus-ring);
        outline: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .form-field :global(input),
        .form-field :global(select),
        .form-field :global(textarea) {
            transition-property: none;
        }
    }
</style>
