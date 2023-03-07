<script lang="ts">
    import PageStructure from "../../components/PageStructure.svelte";
    import emailjs from "@emailjs/browser";

    enum FormState {
        NORMAL,
        SENDING,
        SUCCESS,
        ERROR
    };

    let state: FormState = FormState.NORMAL;

    async function submit(e: Event) {
        if (e.target instanceof Element) {
            const form: HTMLFormElement = e.target as HTMLFormElement;
            state = FormState.SENDING;

            try {
                await emailjs.sendForm("service_yndpnqd", "template_smd2rni", form, "JyZlcg8R1T-HNAxVz");
                state = FormState.SUCCESS;
                form.reset();
            } catch (error) {
                state = FormState.ERROR;
            }
        }
    }
</script>

<PageStructure title="Contact" imgName="contact-extrapic.jpg">
    <h2>Send me a message</h2>
    {#if state === FormState.SUCCESS}
        <p>Your message has been sent to me !</p>
    {:else if state === FormState.SENDING}
        <p>Sending...</p>
    {:else}
        <form on:submit|preventDefault={submit}>
            {#if state === FormState.ERROR}
                <p class="error">An error has occured, please try again</p>
            {/if}
            <div class="form-group">
                <label for="name">Your name</label>
                <input type="text" id="name" name="user_name" placeholder=" " />
            </div>
            <div class="form-group">
                <label for="email">Your email address</label>
                <input type="email" id="email" name="user_email" placeholder=" " />
            </div>
            <div class="form-group">
                <label for="message">Your message</label>
                <textarea id="message" name="message" rows="10" />
            </div>

            <button class="cta">Send</button>
        </form>
    {/if}
</PageStructure>

<style>
    .form-group {
        position: relative;
        margin-bottom: 1rem;
    }

    label {
        width: max-content;
    }

    label, input, textarea {
        display: block;
    }

    input, textarea {
        margin-top: 0.1rem;
        font-size: 1.25rem;
        padding: 0.4rem;
        border: none;
        box-shadow: none;
        border-radius: 0.25rem;
        width: 100%;
        box-sizing: border-box;
    }
    
    input:focus, textarea:focus {
        border: none;
        box-shadow: 0 0.25rem 0.5rem 0.25rem rgba(0, 0, 0, 0.1);
        outline: none;
    }

    textarea {
        resize: vertical;
    }

    .error {
        color: rgb(180, 0, 0);
    }

    button {
        cursor: pointer;
        font-size: 1.25rem;
    }
</style>