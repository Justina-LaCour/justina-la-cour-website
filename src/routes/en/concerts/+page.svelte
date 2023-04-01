<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import SmartConcertList from "../../../components/concerts/SmartConcertList.svelte";
</script>

<PageStructure title="Concerts" bgImgName="ParisGrandPrix_CloseShot.jpg" bgPositionX="0" bgPositionY="-100px" bgPositionMobileX="60%" bgPositionMobileY="100%" imgName="concerts-extrapic.jpg">
    <h2>Upcoming concerts</h2>
    <SmartConcertList mode="upcoming" />

    <h2>Past concerts</h2>
    <SmartConcertList mode="past" />
</PageStructure>