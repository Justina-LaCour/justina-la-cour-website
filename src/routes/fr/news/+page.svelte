<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import NewsList from "../../../components/news/NewsList.svelte";
</script>

<PageStructure title="News" bgImgName="ParisGrandPrix_CloseShot.jpg" bgPositionX="0" bgPositionY="-50px" bgPositionMobileX="70%" bgPositionMobileY="100%" imgName="news_extrapic.jpeg">
    <h2>Toutes les actualités</h2>
    <NewsList lang="fr" />
</PageStructure>