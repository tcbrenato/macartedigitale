import { Link } from 'react-router-dom';
import LegalLayout from '@/components/LegalLayout';

function Terms() {
  return (
    <LegalLayout title="Conditions d'utilisation" updated="26 août 2026">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent l'utilisation de la plateforme macartedigitale, qui permet de créer,
          personnaliser et partager une carte de visite digitale. En créant un compte, tu acceptes ces conditions.
        </p>
      </section>
      <section>
        <h2>2. Ton compte</h2>
        <p>
          Tu es responsable de la confidentialité de tes identifiants et de l'exactitude des informations que tu
          publies sur ta carte. Tu dois avoir le droit d'utiliser les informations et images (notamment ta photo)
          que tu publies.
        </p>
      </section>
      <section>
        <h2>3. Contenu publié</h2>
        <p>
          Tu restes seul responsable du contenu de ta carte de visite (texte, photo, liens). Nous nous réservons le
          droit de suspendre ou supprimer un compte dont le contenu est illicite, trompeur ou porte atteinte aux
          droits d'un tiers.
        </p>
      </section>
      <section>
        <h2>4. Disponibilité du service</h2>
        <p>
          Nous faisons notre possible pour maintenir le service accessible, mais ne garantissons pas une
          disponibilité continue ni l'absence d'interruption ou d'erreur.
        </p>
      </section>
      <section>
        <h2>5. Commandes de carte RFID</h2>
        <p>
          Toute commande de carte physique RFID passée depuis le tableau de bord est traitée manuellement ; les
          délais et modalités te seront communiqués directement.
        </p>
      </section>
      <section>
        <h2>6. Abonnements et facturation</h2>
        <p>
          À ce jour, l'utilisation de la plateforme est gratuite. Si des offres payantes sont proposées à l'avenir,
          leurs conditions spécifiques (tarifs, modalités de paiement, résiliation) te seront communiquées avant
          toute souscription.
        </p>
      </section>
      <section>
        <h2>7. Propriété intellectuelle</h2>
        <p>
          Le design, le code et la marque de la plateforme nous appartiennent. Le contenu que tu publies sur ta
          carte (textes, photo) reste ta propriété ; tu nous accordes simplement le droit de l'afficher dans le
          cadre du service.
        </p>
      </section>
      <section>
        <h2>8. Résiliation</h2>
        <p>
          Tu peux cesser d'utiliser le service à tout moment. Nous pouvons suspendre un compte en cas de
          non-respect de ces conditions.
        </p>
      </section>
      <section>
        <h2>9. Droit applicable</h2>
        <p>
          Ces conditions sont régies par le droit béninois. Tout litige sera soumis aux juridictions compétentes de
          Cotonou, Bénin.
        </p>
      </section>
      <section>
        <h2>10. Contact</h2>
        <p>
          Pour toute question, écris-nous via la{' '}
          <Link to="/contact" className="text-[#0100AD] font-semibold">
            page Contact
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}

export default Terms;
