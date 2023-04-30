<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import { bios } from "../../../stores/bios";
</script>

<PageStructure title="Biographie" bgImgName="bio_bg.jpeg" bgPositionY="-75px" bgPositionMobileX="10%" imgName="Portrait2.JPG">
    <p class="line-breaks">{ $bios["fr"].biography.full }</p>
</PageStructure>