import { Link } from 'react-router-dom';
import LegalLayout from '@/components/LegalLayout';

function Privacy() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="26 août 2026">
      <section>
        <h2>1. Qui sommes-nous</h2>
        <p>
          Cette plateforme (« macartedigitale ») permet de créer et partager une carte de visite digitale. Elle est
          éditée par Yves, basé à Cotonou, Bénin. Pour toute question relative à tes données personnelles,
          contacte-nous via notre{' '}
          <Link to="/contact" className="text-[#0100AD] font-semibold">
            page Contact
          </Link>
          .
        </p>
      </section>
      <section>
        <h2>2. Données que nous collectons</h2>
        <p>
          <strong>Données de compte :</strong> ton adresse email et ton mot de passe, gérés par notre prestataire
          d'authentification Supabase — nous ne voyons jamais ton mot de passe en clair.
        </p>
        <p className="mt-2">
          <strong>Données de ta carte de visite :</strong> prénom, nom, organisation, titre, téléphone, email,
          adresse postale, ville, réseaux sociaux et photo — toutes saisies volontairement par toi, avec des
          réglages de confidentialité par champ (public / masqué / visible par tes connexions uniquement) que tu
          contrôles depuis ton tableau de bord.
        </p>
        <p className="mt-2">
          <strong>Données liées à l'usage du service :</strong> tes connexions avec d'autres utilisateurs, tes
          commandes de carte RFID (quantité, notes), et les messages que tu nous envoies via la page Contact.
        </p>
        <p className="mt-2">
          Nous ne collectons aucune donnée de navigation à des fins publicitaires et n'utilisons aucun outil de
          suivi tiers (pas de Google Analytics, pas de pixels publicitaires).
        </p>
      </section>
      <section>
        <h2>3. Pourquoi nous utilisons ces données</h2>
        <p>
          Pour faire fonctionner ton compte et afficher ta carte, te permettre de contrôler qui voit quoi, traiter
          tes commandes de carte RFID, et te répondre quand tu nous contactes. Nous ne vendons ni ne partageons tes
          données avec des tiers à des fins commerciales.
        </p>
      </section>
      <section>
        <h2>4. Où sont hébergées tes données</h2>
        <p>
          Chez notre prestataire technique Supabase (base de données, authentification, et stockage des photos et
          QR codes). Aucune autre société n'y a accès.
        </p>
      </section>
      <section>
        <h2>5. Durée de conservation</h2>
        <p>
          Tant que ton compte existe. Si tu supprimes ton compte ou nous en fais la demande via la page Contact, tes
          données sont supprimées dans un délai raisonnable, sauf obligation légale de conservation.
        </p>
      </section>
      <section>
        <h2>6. Tes droits</h2>
        <p>
          Tu peux à tout moment demander à consulter, corriger ou supprimer tes données personnelles en nous
          écrivant via la{' '}
          <Link to="/contact" className="text-[#0100AD] font-semibold">
            page Contact
          </Link>
          . Tu peux aussi modifier ou supprimer directement la plupart de tes informations depuis ton tableau de
          bord.
        </p>
      </section>
      <section>
        <h2>7. Cookies</h2>
        <p>
          Nous utilisons uniquement les cookies techniques nécessaires à ta connexion (session d'authentification).
          Aucun cookie publicitaire ou de suivi n'est déposé.
        </p>
      </section>
      <section>
        <h2>8. Modifications</h2>
        <p>Cette politique peut évoluer ; la date de dernière mise à jour est indiquée en haut de cette page.</p>
      </section>
    </LegalLayout>
  );
}

export default Privacy;
