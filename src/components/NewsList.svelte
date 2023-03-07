<script lang="ts">

    interface NewsArticle {
        picture: string;
        title: string;
        published: Date;
        article: string;
    }

    const news: NewsArticle[] = [
        {
            picture: "/imgs/BYMC2022JustinaLaCour.jpg",
            title: "Won a prize there",
            published: new Date(),
            article: "Bla bla bla bla pretend there are more news"
        }
    ];

</script>

<ul class="container">
    {#each news as article}
        <li>
            <div class="news-article">
                <img src={article.picture} alt={article.title} />
                <div class="content">
                    <h4>{article.title}</h4>
                    <h5>{article.published.toDateString()}</h5>
                    <p>{article.article}</p>
                </div>
            </div>
        </li>
    {/each}
</ul>

<style>

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        margin-bottom: 2rem;
    }

    .news-article {
        width: 16rem;
        aspect-ratio: 3 / 4;
        border-radius: 1rem;
        overflow: hidden;
    }

    .news-article img {
        display: block;
        width: 100%;
        height: 50%;
        object-fit: cover;
    }

    .content {
        height: 50%;
        padding: 0.5rem;
        background-color: rgb(51, 51, 51);
    }

    h4, h5 {
        margin-top: 0;
    }

</style>