<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import SmartConcertList from "../../../components/concerts/SmartConcertList.svelte";
</script>

<PageStructure title="Concerts" bgImgName="concerts_bg.jpeg" bgPositionX="0" bgPositionY="25px" bgPositionMobileX="45%" bgPositionMobileY="25px" imgName="concerts_extrapic.jpeg">
    <h2>Prochains concerts</h2>
    <SmartConcertList mode="upcoming" />

    <h2>Concerts passés</h2>
    <SmartConcertList mode="past" />
</PageStructure>