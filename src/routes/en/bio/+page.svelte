<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import { bios } from "../../../stores/bios";
</script>

<PageStructure title="Biography" bgImgName="bio_bg.JPG" imgName="Portrait2.jpg">
    <p class="line-breaks">{ $bios["en"].biography.full }</p>
</PageStructure>