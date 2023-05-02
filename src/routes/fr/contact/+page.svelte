<script lang="ts">
    import PageStructure from "../../../components/PageStructure.svelte";
    import ContactForm from "../../../components/contact/ContactForm.svelte";
</script>

<PageStructure title="Contact" bgPositionY="-250px" bgPositionMobileX="40%" bgPositionMobileY="-150px" imgName="contact-extrapic.jpg">
    <h2>Contactez-moi</h2>

    <ContactForm
        okMessage="Message envoyé avec succès !"
        errorMessage="Une erreur est survenue lors de l'envoi du message"
        nameFieldLabel="Votre nom"
        emailFieldLabel="Votre adresse email"
        messageFieldLabel="Message"
        sendButtonText="Envoyer"
    />
</PageStructure>
