# Page structure

`PageStructure.svelte` is the stable route-facing component. It resolves the
site-wide defaults, renders Open Graph metadata, and delegates visual layout to
the configured design.

| Design | Composition |
| --- | --- |
| `PageStructureSimpleTwoColumns.svelte` | Full-height sticky split |
| `PageStructureCinematicCover.svelte` | Immersive image with an overlaid title |
| `PageStructureDarkGallery.svelte` | Dark exhibition canvas with a separately framed image |
| `PageStructureFloatingPortrait.svelte` | Offset portrait beside a long-form content canvas |
| `PageStructureLayeredPoster.svelte` | Monumental typography and overlapping graphic planes |

Set the site-wide design once in
`src/lib/config/pageStructure.ts`:

```ts
export const defaultPageStructureConfig: PageStructureConfig = {
    design: PageStructureSimpleTwoColumns,
    mobileHeaderHeight: "28rem",
    lgHeaderImageMinHeight: "55rem",
    titleSize: "default",
    // Shared defaults
};
```

Routes always import the wrapper. A route can override the design without
changing the shared default:

```svelte
<script lang="ts">
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import { PageStructureDarkGallery } from "$lib/components/navigation/pageStructure/designs";
</script>

<PageStructure
    title="Biography"
    metadataTitle="Biography - Artist Name"
    ogDescription="Biography of the artist"
    config={{
        design: PageStructureDarkGallery,
        bannerImage,
        titleSize: "compact",
        layout: "image-left"
    }}
>
    <!-- Route content -->
</PageStructure>
```

Every design receives resolved visual configuration and supports `image-left`,
`image-right`, and `content-only`. Use `titleSize: "compact"` for translations
or authored titles that need smaller display typography; the component never
guesses from character count. Metadata props remain owned by the wrapper.
`metadataTitle` overrides only the document and Open Graph title; the visible
page title remains unchanged. When omitted, the wrapper appends the configured
site title suffix to the visible title.
