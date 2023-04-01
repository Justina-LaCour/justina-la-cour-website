<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import SmartConcertList from "../../../components/concerts/SmartConcertList.svelte";
</script>

<PageStructure title="Concerts" bgImgName="ParisGrandPrix_CloseShot.jpg" bgPositionX="0" bgPositionY="-100px" bgPositionMobileX="60%" bgPositionMobileY="0%" imgName="concerts-extrapic.jpg">
    <h2>Prochains concerts</h2>
    <SmartConcertList mode="upcoming" />

    <h2>Concerts passés</h2>
    <SmartConcertList mode="past" />
</PageStructure>