<script lang="ts">
    import { onNavigate } from "$app/navigation";
    import { resolve } from "$app/paths";

    import { page } from "$app/state";
    import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
    import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
    import { site } from "$lib/config/config";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import type { SiteNavigationItem } from "$lib/site/definition";
    import { isNavigationPathActive } from "$lib/site/navigation";
    import LanguagePicker from "./LanguagePicker.svelte";
    import LanguagePickerPopup from "./LanguagePickerPopup.svelte";

    const i18n = useI18n();
    const navigationWordmark = site.identity.navigationWordmark;
    const showLanguagePicker = site.locales.supported.length > 1;

    let drawer: HTMLDialogElement;
    let menuTrigger: HTMLButtonElement;
    let hamburgerOpen = $state(false);

    function openMenu(): void {
        if (drawer.open) return;

        hamburgerOpen = true;
        drawer.showModal();
    }

    function closeMenu(): void {
        if (drawer.open) {
            drawer.close();
        }
    }

    function handleDrawerClosed(): void {
        hamburgerOpen = false;
        menuTrigger.focus();
    }

    function handleDrawerClick(event: MouseEvent): void {
        if (event.target === drawer) {
            closeMenu();
        }
    }

    function isActivePath(href: string): boolean {
        return isNavigationPathActive(
            page.url.pathname,
            // @ts-expect-error URL accepts a readonly URL as its base without mutating it.
            new URL(href, page.url).pathname
        );
    }

    function resolveNavigationPath(link: SiteNavigationItem): string {
        // @ts-expect-error SvelteKit cannot correlate a runtime route union with its params.
        return resolve(link.route, {
            ...(link.params ?? {}),
            lang: i18n.locale
        });
    }

    function navigationLabel(link: SiteNavigationItem): string {
        return i18n.t(link.nameKey, link.labelVariables);
    }

    onNavigate(() => {
        closeMenu();
    });

</script>

{#snippet anchors(classes = "", colorClasses = "text-current border-transparent hover:border-current", activeClasses = "font-semibold text-current border-current", shadowClass = "text-shadow-sm")}
    {#each site.navigation as link}
        {@const pathname = resolveNavigationPath(link)}
        {@const active = isActivePath(pathname)}
        <a
            class="transition-ui reduce-motion inline-block w-fit border-b {active ? activeClasses : colorClasses} {shadowClass} {classes}"
            href={pathname}
            aria-current={active ? "page" : undefined}
        >
            {navigationLabel(link)}
        </a>
    {/each}
{/snippet}

<nav
    class="fixed top-0 w-full z-10 px-6 py-2 flex justify-between items-center bg-navigation-background/90 text-navigation-foreground backdrop-blur-lg"
>
    <a
        class="transition-ui reduce-motion border-b border-transparent text-current hover:border-current {navigationWordmark ? '' : 'font-heading text-2xl'}"
        href="/{i18n.locale}"
        aria-label={i18n.t("nav.home")}
    >
        {#if navigationWordmark}
            <img
                src={navigationWordmark.src}
                alt={navigationWordmark.alt}
                width={navigationWordmark.width}
                height={navigationWordmark.height}
                decoding="async"
                class="block h-10 max-w-[min(16rem,50vw)] w-auto object-contain"
            />
        {:else}
            {site.identity.name}
        {/if}
    </a>
    <div class="hidden xl:flex gap-4 text-lg">
        {@render anchors()}

        {#if showLanguagePicker}
            <div>
                <LanguagePickerPopup>
                    <LanguagePicker supportedLanguages={site.locales.supported} />
                </LanguagePickerPopup>
            </div>
        {/if}
    </div>

    <div class="relative z-10 block xl:hidden">
        <button
            bind:this={menuTrigger}
            type="button"
            class="transition-ui reduce-motion -m-2 rounded-xl p-2 text-current hover:bg-background/20"
            class:opacity-0={hamburgerOpen}
            aria-label={i18n.t("nav.openMenu")}
            aria-controls="mobile-navigation"
            aria-expanded={hamburgerOpen}
            onclick={openMenu}
        >
            <MenuIcon class="size-6" />
        </button>

        <dialog
            bind:this={drawer}
            id="mobile-navigation"
            class="mobile-navigation bg-navigation-background/95 text-navigation-foreground"
            aria-label={i18n.t("nav.mainNavigation")}
            onclick={handleDrawerClick}
            onclose={handleDrawerClosed}
        >
            <div class="flex h-full flex-col">
                <div class="flex justify-end py-4 px-6">
                    <button
                        type="button"
                        class="transition-ui reduce-motion -m-2 rounded-xl p-2 hover:bg-background/20"
                        aria-label={i18n.t("nav.closeMenu")}
                        onclick={closeMenu}
                    >
                        <CloseIcon class="size-6" />
                    </button>
                </div>

                <div class="py-4 px-6 flex-1 w-full flex flex-col gap-4 text-xl">
                    {@render anchors(
                        "",
                        "text-current border-transparent hover:border-current",
                        "font-semibold text-current border-current",
                        ""
                    )}
                </div>

                {#if showLanguagePicker}
                    <div class="px-4 pb-6">
                        <LanguagePicker supportedLanguages={site.locales.supported} />
                    </div>
                {/if}
            </div>
        </dialog>
    </div>
</nav>

<style>
    nav {
        view-transition-name: global-nav;
    }

    .mobile-navigation {
        position: fixed;
        inset: 0 0 0 auto;
        width: min(24rem, calc(100vw - 3rem));
        height: 100dvh;
        max-height: none;
        margin: 0;
        padding: 0;
        border: 0;
        opacity: 0;
        transform: translateX(5rem);
        transition:
            opacity var(--transition-duration-panel),
            transform var(--transition-duration-panel),
            overlay var(--transition-duration-panel) allow-discrete,
            display var(--transition-duration-panel) allow-discrete;
    }

    .mobile-navigation[open] {
        opacity: 1;
        transform: translateX(0);
    }

    @starting-style {
        .mobile-navigation[open] {
            opacity: 0;
            transform: translateX(5rem);
        }
    }

    .mobile-navigation::backdrop {
        background: rgb(255 255 255 / 0.4);
        opacity: 0;
        transition:
            opacity var(--transition-duration-panel),
            overlay var(--transition-duration-panel) allow-discrete,
            display var(--transition-duration-panel) allow-discrete;
    }

    .mobile-navigation[open]::backdrop {
        opacity: 1;
    }

    @starting-style {
        .mobile-navigation[open]::backdrop {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .mobile-navigation,
        .mobile-navigation::backdrop {
            transition: none;
        }
    }

    ::view-transition-group(global-nav) {
        z-index: 999;
    }
</style>
