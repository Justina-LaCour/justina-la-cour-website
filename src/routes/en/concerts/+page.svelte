<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import SmartConcertList from "../../../components/concerts/SmartConcertList.svelte";
</script>

<PageStructure title="Concerts" bgImgName="concerts_bg.jpeg" bgPositionX="0" bgPositionY="-150px" bgPositionMobileX="15%" bgPositionMobileY="-75px" imgName="concerts_extrapic.jpeg">
    <h2>Upcoming concerts</h2>
    <SmartConcertList mode="upcoming" />

    <h2>Past concerts</h2>
    <SmartConcertList mode="past" />
</PageStructure>