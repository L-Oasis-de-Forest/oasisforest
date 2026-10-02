# Union Oasis Forest — site du club

Site vitrine one-page d'un club de futsal bruxellois (Forest, 1190).
Hébergé sur **GitHub Pages** depuis la branche principale du dépôt `tristede/oasisforest`.

## Identité légale (à ne pas confondre)

Le club se présente partout sous le nom sportif **Union Oasis Forest**, mais l'entité
juridique qui le porte est **L'Oasis de Forest ASBL** (association sans but lucratif de
droit belge). Les deux noms désignent la même structure — c'est précisément ce que Google
demande d'expliquer sur le site (« Organizational Clarity »).

| Donnée | Valeur | Source |
|---|---|---|
| Dénomination légale | L'Oasis de Forest ASBL | Moniteur belge, 06/07/2016 |
| Numéro d'entreprise (BCE) | 0867.614.619 | Extrait UBO, 20/08/2026 |
| Constitution | 05/10/2004 | Extrait UBO |
| Siège social | Rue du Croissant 85, 1190 Forest | Extrait UBO |
| Salle / entraînements | Bd. de la 2ème Armée Britannique 600, 1190 Forest | — |
| E-mail (et super admin Workspace) | union@oasisforest.be | — |

⚠️ L'ancien pied de page annonçait « Union Oasis Forest ASBL », ce qui ne correspond à
aucune entité enregistrée. Ne pas réintroduire cette formulation.

## Stack

- **Site multi-pages, sans build** : 6 fichiers HTML à la racine, plus des ressources
  partagées dans `assets/`. Pas de bundler, pas d'étape de compilation.
- **Tailwind CSS via CDN** (`cdn.tailwindcss.com`), configuré en ligne dans une balise `<script>` du `<head>`.
  ⚠️ Le CDN affiche un warning en production. Migration vers Tailwind CLI/PostCSS à prévoir avant la mise en ligne définitive.
- **Font Awesome 6.4** (CDN) pour les icônes.
- **Google Fonts** : Montserrat (texte) + Caveat (`font-handwriting`, légendes des polaroids).

## Fichiers du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil (hero, mission, équipes, agenda, valeurs, teasers, contact) |
| `a-propos.html` | Le club : mission détaillée, identité juridique, ligne du temps, valeurs |
| `equipes.html` | Les 5 équipes, **du plus jeune à la D2**, puis l'encart « Classements officiels » (RBFA) |
| `galerie.html` | Galerie complète avec filtres, rendue depuis `data/gallery.json` |
| `partenaires.html` | Chiffres d'impact (argument sponsoring), argumentaire, liste des partenaires |
| `contact.html` | Coordonnées, carte, adresses légales |
| `inscription.html` | Formulaire d'inscription des jeunes (Baby Futsal, U15, U17), envoyé à l'outil admin qui crée la fiche dans Notion |
| `assets/site.css` | Styles du site, partagés par les 6 pages (extraits d'`index.html`) |
| `assets/tailwind-config.js` | Config Tailwind partagée (chargée après le CDN) |
| `assets/commun.js` | Menu mobile, `.reveal`, année, protection photos, bandeau sponsors — pour les 5 pages secondaires (`index.html` garde son propre script) |
| `sitemap.xml` / `robots.txt` | Référencement ; `robots.txt` exclut `/admin/` |
| `favicon.svg` | Icône webapp iOS (logo sur fond sombre) |
| `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` | Icônes PNG (iOS ignore le SVG pour l'écran d'accueil) |
| `logo uof.svg` | Logo blanc : icône d'onglet **et** logo des pages secondaires (⚠️ espace dans le nom → toujours encoder en `logo%20uof.svg`, jamais `logo_uof.svg`) |
| `img/*.webp` | Photos du club (`D85A3835`, `IMG_8135`, `IMG_8323`) — dossier média du CMS |
| `data/gallery.json` | Vignettes de la galerie (généré au chargement par JS) |
| `data/categories.json` | Liste des filtres de la galerie (`value`/`label`, éditable, ordre = ordre d'affichage) |
| `data/sponsors.json` | Bandeau sponsors (généré par JS, deux pistes) |
| `data/hero.json` | Polaroids du hero : liste d'images par polaroid, **tirage aléatoire à chaque visite** |
| `data/evenements.json` | Matchs/détections/événements : alimente la notification « Actu » (voir Chantiers) |
| `admin/index.html` + `admin/config.yml` | Interface Sveltia CMS (`/admin`) |
| `.nojekyll` | Empêche Jekyll d'ignorer les dossiers en underscore sur GitHub Pages |

## Conventions de code

- **Commentaires en français**, comme le reste du projet.
- **Navigation et pied de page sont dupliqués dans les 6 pages HTML.** C'est volontaire :
  il n'y a pas de build, et les mentions légales du pied de page doivent être lisibles
  sans exécuter de JavaScript (un validateur Google peut lire le HTML brut). Toute
  modification de la navbar, du menu mobile ou du pied de page **doit être reportée à
  l'identique dans les 6 fichiers** — un commentaire le rappelle au-dessus de chaque bloc.
- **Le pied de page contient des mentions obligatoires** (dénomination légale, n° BCE,
  siège social, e-mail de l'administrateur Workspace, domaine). Elles sont exigées *sur
  chaque page* par la validation Google for Nonprofits : ne pas les retirer d'une page.
- Les pages secondaires affichent le logo via `<img src="logo%20uof.svg">` et non via
  `<use href="#club-logo">` : un `<use>` vers un fichier SVG externe n'est pas supporté
  par les navigateurs. Le `<symbol>` reste déclaré une seule fois, dans `index.html`.
- Le logo est déclaré **une seule fois** en `<symbol id="club-logo">` juste après `<body>`, puis réutilisé via `<use href="#club-logo">`. Ne jamais dupliquer les tracés.
- Classe `.reveal` + IntersectionObserver pour les apparitions au scroll. Ajouter `reveal` à tout nouveau bloc.
- Classe `.zone-unie` (`#070f20`) : fond de couleur **unie** couvrant de la section « Nos Équipes » jusqu'à « Devenez Partenaire ». Un seul dégradé toléré, très léger, sur `#partenaires` (`to-accent/5`).
- `section[id] { scroll-margin-top: 11rem; }` compense la navbar + le bandeau sponsors, tous deux fixes. À conserver pour toute nouvelle section ancrée.
- Bascule desktop → menu mobile au breakpoint **`lg`** (1024px), pas `md`. En dessous, les liens s'écrasaient contre le logo.
- Couleur d'accent : `accent` = `#00c2ff` (bleu vif, remonté depuis `#38bdf8` pour un rendu
  plus « HDR »/pétant), `accentDark` = `#0091ea`, `night` = `#020617`. Toutes les lueurs
  `rgba(56, 189, 248, …)` du fichier ont été converties en `rgba(0, 194, 255, …)` en même
  temps — si `accent` est retouché à nouveau, penser à refaire ce remplacement global pour
  rester cohérent (25 occurrences au dernier compte).
- **Protection légère des photos** (`img { -webkit-touch-callout: none; user-select: none;
  -webkit-user-drag: none; }` + `contextmenu`/`dragstart` bloqués en JS sur les `<img>`) :
  empêche le menu « Enregistrer l'image » au clic long iOS et le clic droit desktop. Aucune
  technique web ne bloque les captures d'écran — c'est une gêne, pas une vraie protection.
- **Ne jamais appliquer de `filter` CSS à `body`/`html`** (même scopé à un wrapper englobant
  les éléments `fixed`) : ça change leur containing block et casse leur positionnement au
  scroll (navbar, popup, WhatsApp…). Un `filter: saturate()/contrast()` global sur `img` a
  été testé pour un rendu plus vif, puis retiré : combiné à des photos non redimensionnées
  (20+ mégapixels affichés à ~200px), le recalcul du filtre à chaque repaint ralentissait
  nettement l'ouverture des modales (backdrop-blur qui recomposite tout ce qu'il y a derrière).
- **Contenus éditables** (galerie, sponsors, polaroids du hero) : ne jamais recoder les
  images en dur. Ajouter la donnée dans `data/*.json` + le champ correspondant dans
  `admin/config.yml`. Le rendu JS est regroupé dans `index.html` (bloc « RENDU DES CONTENUS
  ÉDITABLES »), avec dégradation propre si le JSON manque (image de secours pour le hero,
  section masquée pour les sponsors, état vide pour la galerie).
- **Chemins d'images** : le CMS écrit des chemins absolus `/img/…`, mais le rendu les
  convertit en relatifs (`toRel()` retire le `/` initial) — indispensable tant qu'il n'y a
  pas de `CNAME` (GitHub Pages sert alors sur le sous-chemin `/oasisforest/`).
- **Filtres de la galerie** : la liste des catégories (`data/categories.json`) est éditable
  via `/admin`, mais le champ « Catégorie » d'une photo reste un champ **texte libre**
  (widget `select` impossible : Sveltia CMS ne peut pas lire dynamiquement les options
  depuis un autre fichier JSON dans une config statique). Le volontaire doit taper la même
  valeur que la colonne « Valeur » d'un filtre — un `pattern` regex limite la casse/les
  caractères, mais ne garantit pas la correspondance exacte.

## Direction artistique (refonte du 09/09/2026)

Le premier jet de la mise en conformité a été refusé par le club : cartes vitrées
arrondies, icônes Font Awesome partout, textes longs et répétitifs — « ça fait trop IA ».
La grammaire visuelle a été refaite. Règles à respecter pour toute nouvelle page :

- **Aucun arrondi.** Zéro `rounded-*` hors du hero et des `blob-*` du fond. Les modales
  sont ramenées à l'équerre par une règle CSS dédiée en fin d'`assets/site.css`.
- **Pas d'icône décorative par défaut.** Les icônes de section sont remplacées par une
  **numérotation en contour** (`.numero`, `01`, `02`…). Quatre exceptions demandées par
  le club, à conserver : le bouton **WhatsApp flottant** (pastille ronde verte d'origine,
  sur les 6 pages), les **icônes de marque des réseaux sociaux** (Font Awesome, mises en
  avant sur l'accueil et la page Partenaires), les **icônes SVG des valeurs** (tracées à
  la main dans `build`, trait `#00c2ff`), et la **ligne du temps d'origine** de
  `a-propos.html`, reprise telle quelle avec ses cartes vitrées et ses polaroids.
- **Classes maison** (fin d'`assets/site.css`) : `.bloc`, `.bloc-accent`, `.bloc-plein`,
  `.filet`, `.numero`, `.titre-brut`, `.bande-diagonale`, `.table-faits`, `.lien-action`,
  `.bouton-plein`, `.bouton-vide`. Les utiliser plutôt que d'empiler des classes Tailwind.
- **Les données factuelles vont dans `.table-faits`**, pas dans des grilles de cartes :
  plus dense, plus sérieux, et c'est ce que lit un validateur.
- **`.bande-diagonale`** (fond accent incliné) est la seule rupture forte : réservée aux
  appels à l'action de fin de page. Pas plus d'une par page.
- **Textes courts.** Une idée par paragraphe, jamais la même phrase sur deux pages. Le
  hero, les polaroids, le bleu accent et le fond sombre sont conservés tels quels.

**Hiérarchie de l'information**, fixée par le club, dans cet ordre :
crédibilité institutionnelle → vitrine du club → inscriptions → sponsors.
C'est l'ordre des sections de l'accueil (01 L'association, 02 En images, 03 Nos équipes,
04 Soutenir le club) et l'ordre de la navigation.

## Choix de mise en page (retours du club)

- **Photo pleine largeur de l'équipe première** dans la section 01 de l'accueil, entre la
  mission et les réseaux (`img/D85A3835.webp`, l'équipe dans le couloir avant d'entrer).
  Codée en dur comme les photos de la ligne du temps, pas via le CMS. Cadrage `4/3` sur
  mobile et `16/9` à partir de `sm` : le fichier source fait 1600×1068, un rapport plus
  large rognerait les joueurs.
- **Le tableau d'identité légale est en bas de l'accueil**, sous Contact (`#identite`).
  Les mentions doivent être présentes et vérifiables, pas occuper le haut de page.
- **Les réseaux sociaux vivent DANS la section 01** (« L'association ») de l'accueil, en
  bas de bloc sous l'intitulé « Suivre le club » — pas dans une section à eux.
  **Sans cadre** : logo, nom et pseudo posés sur le fond, groupe centré, large écart entre
  les trois. Les encarts bordés avaient été essayés puis abandonnés — trois boîtes vides
  pour trois liens, ça ramenait le rendu « carte » dont le club ne voulait plus. Seulement
  Instagram / Facebook / TikTok : **pas la RBFA**, qui n'est pas un réseau social.
  **Aucun chiffre d'audience sur l'accueil** : les statistiques servent d'argument
  commercial et vivent sur `partenaires.html` uniquement.
- **Logos de marque officiels**, pas des redessins : tracés repris de Simple Icons v13
  (CC0), inlinés en SVG plein (`fill="currentColor"`). Mise à jour éventuelle depuis
  `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/<nom>.svg`. Les icônes **au trait**
  restent réservées aux valeurs de `a-propos.html`, qui ne représentent aucune marque.
- **Aucun lien vers le registre BCE nulle part.** Google exige que le numéro d'entreprise
  soit *affiché*, pas qu'il renvoie au registre : il est en texte simple partout.
- **Principe général : n'exposer que ce qui est exigé.** Les mentions obligatoires
  (dénomination légale, n° d'entreprise, siège social, e-mail de l'administrateur,
  domaine) vivent dans le pied de page, présent sur les six pages — c'est ce que demande
  la validation. Tout doublon de ces données ailleurs a été supprimé : l'ancienne section
  `#identite` de l'accueil et la ligne « Siège social » du tableau de contact faisaient
  répétition avec ce pied de page. Ne pas les réintroduire, et ne rien ajouter
  (téléphones privés, noms d'administrateurs, IBAN, documents officiels) : c'est une
  surface de phishing, pas un gage de sérieux.
- **La carte de contact garde ses deux boutons d'itinéraire au survol** (Google Maps,
  Waze) : c'est l'interaction d'origine, le club y tient. `pointer-events: none` sur
  l'iframe, sinon la carte capte le survol et l'overlay ne s'affiche jamais.
- **L'effet d'inclinaison des polaroids** (`.hover-tilt`) est géré par `activerTilt()`
  dans `assets/commun.js` pour les pages secondaires. Les cartes créées après le
  chargement (galerie) doivent appeler `activerTilt(conteneur)` après le rendu, et
  stocker leur rotation de base dans `dataset.rotation` — sinon le survol redresse la
  photo au lieu de composer avec son angle.

### Boutons

Un seul vocabulaire sur tout le site : **angles vifs, aplats, pas de dégradé**.
Trois variantes, définies en fin d'`assets/site.css` — `.bouton-plein` (accent, action
principale), `.bouton-vide` (contour), `.lien-action` (lien souligné). Dans les modales,
les mêmes styles sont écrits en Tailwind faute de pouvoir toucher au JS qui les pilote.

Une seule exception assumée, demandée par le club : le **bouton WhatsApp flottant** (rond,
vert). Tout le reste est à l'équerre — y compris depuis le 02/10/2026 le badge « Division 2
Nationale » et les deux boutons du hero (angles nets désormais ; ils gardent leur dégradé
et le hero reste par ailleurs hors périmètre de la refonte).

**Le bouton « S'abonner à l'agenda » vit dans la modale des horaires**, pas sur la fiche
d'équipe : on s'abonne une fois le calendrier sous les yeux. Il reste piloté par
`openTeamModal()`, qui l'affiche pour la D2 et les U21 (les seules équipes avec un flux
ICS) et le masque pour les jeunes.

### Cache des ressources

Les liens vers `assets/*.css` et `assets/*.js` portent un **numéro de version**
(`?v=AAAAMMJJHHMM`). Sans lui, un navigateur qui a déjà chargé l'ancienne feuille de
style continue de la servir après une mise à jour — un composant peut alors s'afficher
en vrac sans que rien ne soit cassé côté serveur. **Rebumper ce numéro dans les six
pages à chaque modification de `assets/`** (le générateur le fait automatiquement).

Le serveur de prévisualisation local (`.claude/serveur-local.py`) envoie en plus
`Cache-Control: no-store`, pour ne pas relire une version périmée pendant une relecture.

### Compteur à rouleaux (page Partenaires)

Le nombre de vues cumulées défile façon compteur mécanique : chaque chiffre est une
colonne 0-9 (`.compteur-*` en fin d'`assets/site.css`) qui fait quatre tours avant de se
caler, les chiffres s'arrêtant en cascade. Trois garde-fous à conserver :

- le **nombre final est déjà écrit dans le HTML** (`data-valeur` + texte visible) : sans
  JavaScript, la valeur reste lisible ;
- l'animation est **désactivée** si le visiteur a demandé moins d'animations
  (`prefers-reduced-motion`) ;
- un **filet de sécurité à 6 secondes** cale les rouleaux sur la valeur finale si
  l'IntersectionObserver ne s'est jamais déclenché (onglet resté en arrière-plan). Sans
  lui, la page afficherait « 0 000 000 » — un chiffre faux, pas juste une animation ratée.

### Chiffres réseaux sociaux

Les données de `partenaires.html` et de la section `#reseaux` viennent du **rapport
digital interne du club, saison 2025-2026** (septembre 2025 → septembre 2026) :
2 033 800 vues cumulées, Instagram 1 821 abonnés / 953 100 vues, Facebook 2 500 / 883 300,
TikTok 602 / 197 400. **Ne jamais extrapoler ces chiffres** : toute mise à jour vient d'un
nouveau rapport fourni par le club.


- **Le bandeau sponsors ne doit jamais être masqué.** Les 4 emplacements au logo du club
  sont une vitrine assumée : ils montrent le rendu aux futurs sponsors. Voir le champ
  `demo` dans `data/sponsors.json`.
- **Pas de jalons d'histoire sur l'accueil** : la section `#club` de `index.html` n'est
  qu'un renvoi vers `a-propos.html`. Répéter les dates faisait doublon avec la ligne du temps.
- **« Notre impact » vit sur `partenaires.html`**, pas sur `a-propos.html` : ces chiffres
  (BX1, +250 spectateurs, +40 matchs) servent d'argument commercial, pas de bilan associatif.
- **Pas de « semaine type » pour la D2 ni les U21** : leurs horaires bougent trop en cours
  de saison, on renvoie au calendrier RBFA. Les U15-U17 et le Baby Futsal la gardent.
- **Ordre des équipes sur `equipes.html` : du plus jeune à l'équipe première**, l'encart
  « Classements officiels » fermant la page juste après la D2.
- **Mentions légales discrètes** : deux lignes en `text-[11px]` tout en bas du pied de
  page. Complètes mais pas envahissantes — ne pas les remonter en colonne.
- **Menu mobile aligné à droite** (`items-end text-right`), du même côté que la croix de
  fermeture — comme sur l'ancienne landing (`old.html`).
- **Logo plus petit que le nom** dans l'en-tête desktop : c'est « Union Oasis Forest » qui
  doit se lire d'abord (`h-7`), avec un `gap-4` pour ne pas coller au texte.
- **Pas de barre d'en-tête sur téléphone** (demande du club, 12/09/2026) : le bandeau
  sponsors (`h-12`) occupe le haut de l'écran ; le bouton menu (et la croix) **flotte juste
  en dessous, à droite, sans cadre ni fond** (`top-[3.6rem] right-4`, icône `text-3xl` avec
  ombre portée). Une première version en case accolée au bandeau a été refusée par le club. Le nom de l'association reste lisible
  dans le hero de l'accueil, les titres de page et le pied de page (mentions légales).
- **Pas de numéros sur les équipes** (liste de l'accueil, blocs d'`equipes.html`) : ils
  faisaient doublon avec les catégories (U3 — U7, U15 — U17…). La numérotation `.numero`
  reste réservée aux sections.
- **Compteur de vues** : « + 2 033 800 », sans « de », le « + » à la taille du nombre.
- **Images d'aperçu de partage** (`og:image`, 1200 × 630, **JPG** — WhatsApp et Facebook
  gèrent mal le WebP) : `img/partage.jpg` (équipe première) sur toutes les pages, sauf
  `inscription.html` → `img/partage-inscription.jpg` (accolade des jeunes, demandée par le
  club pour les liens partagés aux familles). Générées par recadrage de `img/D85A3835.webp`
  et `img/IMG_8323.webp`.

## Inscription en ligne (`inscription.html`)

Remplace l'encodage à la main des affiliés. Le lien se partage dans les groupes WhatsApp
des parents ; la page n'est volontairement pas dans la navigation.

- **Circuit** : la page envoie un `POST` multipart à `/api/inscription` de l'outil admin
  (`oasisforest-admin-tool`, Worker Cloudflare, dépôt local `~/oasisforest-admin-tool`,
  fichier `src/routes/inscription-publique.js`), qui crée la fiche dans la base Notion
  **👥 Affiliés**. Le site reste statique : il ne stocke et ne voit aucune donnée.
- **Catégories** : la page affiche les noms du site (Baby Futsal, Futsal U15, Futsal U17)
  mais l'outil écrit les valeurs Notion existantes (`Baby-foot`, `Futsal U15`,
  `Futsal U17`) — c'est ce qui fait fonctionner le barème et les accès coachs de l'outil
  admin. Ne pas renommer ces options dans Notion sans modifier l'outil admin en même
  temps (listes déroulantes, `COTISATION_PRESETS`, `roles.js`). U21 et D2 sont exclues :
  ces joueurs s'inscrivent via la RBFA.
- **Remplis automatiquement par le serveur** : cotisation due (barème : Baby-foot 250 €,
  U15/U17 175 €), date d'inscription à l'heure de Bruxelles (la colonne Saison en
  dépend), « Créé par : Formulaire en ligne (oasisforest.be) ». « Montant payé » reprend le montant déclaré par la famille (voir plus bas) : la fiche arrive « À valider » et c'est le club qui confirme.
- **Champs demandés** : identité de l'enfant, catégorie, parent (nom, téléphone qui sert
  aussi de contact d'urgence, e-mail), paiement déclaré, preuve facultative. Pas d'infos
  médicales, de carte d'identité ni de nationalité (choix du club). L'autorisation à
  l'image est gérée à part pendant la saison.
- **Anti-abus** (côté Worker) : origine limitée à `https://oasisforest.be`, champ piège,
  délai minimal de 3 s, plafond de 10 envois/heure par connexion (IP hachée, TTL 1 h).
- **Tester en local** : `npm run dev` dans l'outil admin (port 8787) + serveur du site
  (port 4173) ; la page bascule seule sur `localhost:8787`. ⚠️ Le mode local écrit dans le
  **vrai** Notion : préfixer les fiches de test (`TEST-…`) et les supprimer après.


### Validation, ouverture et fermeture (12/09/2026)

- **Second contact** facultatif (bouton « + Ajouter un second contact ») → colonnes Notion
  « Contact urgence 2 - Nom/Téléphone/Mail ». **Case newsletter** facultative (« Recevoir les
  annonces du club par mail ») → colonne « Newsletter » + fiche dans 📧 Newsletter — Contacts.
- Chaque fiche arrive **« À valider »** (colonne « Statut fiche ») : l'outil admin la signale
  par un « ! » jusqu'à ce qu'un membre du club l'ait relue et validée.
- **Le formulaire s'ouvre et se ferme depuis l'outil admin** (onglet Affiliés), pour une
  durée ou sans limite. **Fermé par défaut.** Au chargement, la page interroge
  `GET /api/inscription/statut` : fermé → bloc `#ferme` (contact inscriptions@oasisforest.be
  ou WhatsApp) à la place du formulaire. Si le Worker ne répond pas, le formulaire s'affiche
  quand même : le serveur refuse l'envoi de toute façon.
- ⚠️ L'adresse **inscriptions@oasisforest.be** doit exister (alias Workspace) : c'est le
  contact affiché quand le formulaire est fermé.
- **Vocabulaire inclusif** (demande du club) : « Personne de contact » / « Second contact »,
  jamais « parent » dans les textes visibles. Les identifiants techniques (`parentNom`…)
  et les colonnes Notion gardent leur nom.
- **Montant payé déclaré** : « Oui » = cotisation entière, « En partie » = montant saisi
  (champ `montantDeclare`, obligatoire, entre 1 € et la cotisation − 1), « Non » = 0 →
  écrit dans « Montant payé (€) ». La fiche arrive « À valider » : c'est le club qui
  confirme en la validant, et la recette Finances est créée à ce moment-là. Barème dupliqué
  côté page (`COTISATIONS`) : à garder aligné sur `CATEGORIES` du Worker.
- Paiement proposé dans l'ordre **Non, En partie, Oui** ; case newsletter **avant** le
  consentement. Sous les champs e-mail, boutons de **suggestion de messagerie** dès le
  « @ » (liste `DOMAINES` du script de la page), pas de `<datalist>` (mal rendu sur iPhone).
- **Relecture avant envoi** (`#relecture`, `confirmerEnvoi()`) : « Êtes-vous sûr de ne pas
  avoir fait d'erreur de frappe sur le mail ou les noms ? », récapitulatif en texte brut,
  boutons « Oui, valider » / « Corriger ». Demandé par le club côté **parent** — la
  validation d'une fiche dans l'outil admin n'a pas cette fenêtre.

## Formulaire de contact partenaires (`partenaires.html`, 16/09/2026)

Remplace le `mailto:` de la section « Recevoir le dossier » : sur mobile/desktop sans
client mail configuré (webmail uniquement), un lien `mailto:` peut n'ouvrir rien du tout.

- **Champs** : prénom, nom, e-mail, description (message libre), pièce jointe facultative
  (image ou PDF, 8 Mo max — logo ou présentation de l'entreprise).
- **Circuit volontairement plus léger que l'inscription** : pas de fiche Notion (volume
  attendu faible, quelques demandes/mois) — juste un mail transactionnel Brevo envoyé à
  `PARTENAIRES_EMAIL` (`sponsoring@oasisforest.be`, `wrangler.toml` de l'outil admin), avec
  le `reply-to` posé sur l'e-mail du visiteur pour que le club puisse juste faire
  « Répondre ». Si le volume augmente un jour, envisager une base Notion dédiée comme pour
  les Affiliés.
- ⚠️ **`sponsoring@oasisforest.be` doit exister comme alias Workspace** (voir
  `admin.google.com` → `union@oasisforest.be` → adresses e-mail secondaires) — sans lui les
  réponses au reply-to du club fonctionnent, mais rien ne reçoit les demandes entrantes.
- **Anti-abus** : mêmes garde-fous que l'inscription (origine, champ piège, délai minimal
  3 s, plafond 10 envois/heure/connexion), compteur KV séparé (`ratelimit:partenaires:…`).
- Endpoint : `POST /api/partenaires` (`src/routes/partenaires-publique.js` de l'outil
  admin). `sendEmail()` (`src/brevo.js`) accepte désormais un `attachment` (base64, encodé
  par blocs de 32 Ko — `String.fromCharCode(...gros tableau)` plante au-delà).

## Photo équipe première (`equipes.html`, 16/09/2026)

Photo affichée juste sous la fiche « Équipe première », **éditable via `/admin`**
(contrairement aux photos de la ligne du temps, codées en dur) : `data/equipe-premiere.json`
+ entrée `admin/config.yml`. Rendu par `renderEquipePremierePhoto()` dans
`assets/commun.js`, masqué proprement si le champ est vide.

## Pièges rencontrés

- **Pas de `localStorage`** dans les aperçus d'artefacts Claude.ai (fonctionne normalement sur GitHub Pages).
- L'effet **parallax sur les polaroids** provoquait des chevauchements de texte dans la ligne du temps. Il en a été retiré — ne pas le réintroduire là-bas. Les polaroids de la ligne du temps sont bien affichés sur mobile depuis, mais **en flux normal** (sous la carte, `mt-6`/`md:hidden` + instance desktop séparée `hidden md:flex`), jamais en position superposée/absolue hors du breakpoint `md` pour lequel elle a été prévue.
- Vérifier que les classes Tailwind utilisées **existent bien dans l'échelle par défaut** (`bottom-26` n'existe pas ; utiliser `bottom-[6.5rem]`).
- Les guillemets `«»` et le chevron de la ligne du temps utilisent `scale-x-[…]` pour resserrer leur angle.
- **Photos `img/*.webp` non redimensionnées** (jusqu'à 27 mégapixels, résolution native
  appareil photo, affichées à ~200px) : ralentissait sensiblement le site, surtout
  l'ouverture des modales (voir plus haut). Corrigé une fois via ImageMagick
  (`winget install ImageMagick.ImageMagick`, `magick photo.webp -auto-orient -resize
  "1600x1600>" -quality 85 photo.webp`) : dossier `img/` passé d'environ 34 Mo à ~1,3 Mo,
  qualité visuelle inchangée à l'écran. **Le CMS n'applique pas ce traitement** : toute
  nouvelle photo ajoutée par un bénévole via `/admin` doit être redimensionnée à la main
  avant upload (hint déjà présent sur les champs image de `admin/config.yml`), sous peine
  de réintroduire le même ralentissement.

## Chantiers ouverts

0. **Conformité Google for Nonprofits** — checklist reçue du support Workspace
   (case 75278170, 09/09/2026). Traitée le 09/09/2026 :
   - ✅ Site passé en **multi-pages** (5 pages en plus de l'accueil) : c'était le point
     bloquant, Google refuse explicitement les sites one-page.
   - ✅ **Mission** affichée sur l'accueil et développée sur `a-propos.html`.
   - ✅ **Identité juridique** expliquée (nom sportif vs ASBL), pied de page complet
     avec n° BCE, siège social, e-mail admin et domaine, sur les 6 pages.
   - ✅ **Placeholders assainis** : le bandeau sponsors garde ses 4 emplacements
     d'aperçu (logo du club) — c'est **voulu**, ça montre le rendu aux futurs sponsors,
     **ne jamais le masquer**. Ces entrées portent désormais `"demo": true` et un libellé
     honnête (« Emplacement partenaire disponible ») au lieu de « SPONSOR », et
     `partenaires.html` les exclut de la section « Ils nous soutiennent » : présenter le
     logo du club comme un partenaire serait trompeur. Décocher `demo` dans `/admin` dès
     qu'un vrai partenaire est encodé.
   - ✅ Lien mort corrigé (`logo_uof.svg` → `logo%20uof.svg` dans le JSON-LD).
   - ⏳ **Reste à faire côté club** : vérifier le domaine dans la console Admin Google,
     puis réactiver le compte Google for Nonprofits (ou formulaire « PRODUCT ACTIVATION »).
   - ⏳ **Reste à faire côté code** : Tailwind en production (chantier 2 ci-dessous),
     seul point « Fast Loading » encore imparfait.
   - 🧹 La modale galerie d'`index.html` (`openGallery()`) n'est plus appelée depuis que
     la galerie a sa page : code mort à supprimer lors d'un nettoyage.


1. **Galerie et sponsors éditables par un bénévole** — priorité n°1.
   Spécification : `SPEC-cms.md`.
   - ✅ **Étape 1 faite** : galerie, sponsors et polaroids du hero sortis en JSON
     (`data/*.json`), rendus par JS au chargement. Filtres galerie fonctionnels.
     Polaroids du hero : liste d'images tirée au hasard à chaque visite.
   - ✅ **Étape 2 faite** : `admin/` (Sveltia CMS) avec collections Accueil / Galerie / Sponsors.
   - ⏳ **Étape 3 à finir par le club (actions externes)** : créer une **OAuth App GitHub**
     et déployer le **Worker Cloudflare** `sveltia/sveltia-cms-auth`, puis renseigner son URL
     dans `admin/config.yml` (`base_url`, actuellement un placeholder). Détail : `admin/README.md`.
   - Reste aussi à fournir les **vrais logos de sponsors** (placeholders « Partenaire B »… en attendant).
   - ✅ **Aperçu galerie** (section avant « Nos Réseaux ») ajouté, même logique de rendu
     JS + JSON éditable.
   - ❌ **Bannière Actu Instagram** tentée puis retirée : le widget officiel Meta
     (`embed.js`) ne peut pas être restylé pour matcher la DA du site (carte blanche
     figée) et ne gère qu'un post à la fois. Un remplacement par des cartes stylées
     éditables via le CMS a été envisagé mais jugé trop contraignant à maintenir pour
     le club (upload photo + légende à chaque post plutôt qu'un simple lien). Ne pas
     réintroduire sans revalider ce compromis avec le club.
2. **Tailwind en production** — remplacer le CDN par un CSS compilé.
3. **Notification Actu (matchs/détections/événements)** — ✅ faite.
   `data/evenements.json` (éditable via `/admin` → « Actu (pop-up match / détection) »),
   rendu par `renderActuPopup()` dans `index.html`.
   - Notification **non bloquante** en coin d'écran (haut-droite), la landing reste
     utilisable en dessous. Ne jamais revenir à une modale plein écran qui bloque l'accès
     au site — c'est le retour explicite du club sur une première version trop intrusive.
   - Un événement devient éligible entre `date - joursAvant jours` et sa date (comparaison
     en jour civil, pas à l'heure près). Le plus proche dans le temps est affiché en priorité
     si plusieurs sont éligibles simultanément (un seul pop-up par visite).
   - Fermeture manuelle **ou** automatique après 10s sans interaction. **La fermeture
     n'est plus mémorisée** (demande du club, 09/2026) : la pop-up réapparaît à chaque
     arrivée sur l'accueil, rafraîchissement compris. L'ancienne mémorisation par jour
     (`localStorage`) a été retirée — ne pas la réintroduire sans revalider avec le club.
     `localDateKey()` reste utilisé pour construire l'identifiant d'événement : ne pas
     utiliser `toISOString()` pour une date locale, ça décale d'un jour avec un fuseau en
     avance sur UTC comme la Belgique en été.
   - Calendrier initial peuplé à la main depuis un export PDF RBFA (pas d'API disponible) :
     à mettre à jour en fin de saison ou en cas de changement d'horaire/forfait.
   - Titre des matchs au format `MATCH DOM/EXT VS ADVERSAIRE` (majuscules), sans description
     ni lieu pour les matchs à l'extérieur (adresse adverse inconnue).
   - Fenêtre **déplaçable** à la souris/au doigt (`makeActuPopupDraggable()`, configuré une
     fois au chargement) : bascule d'un positionnement Tailwind (`top-28`/`right-4`…) vers un
     positionnement libre en pixels au premier drag. Transition CSS coupée pendant le drag
     (`modal.style.transition = 'none'`) et `user-select: none` sur `<body>`, sinon
     respectivement rattrapage saccadé et sélection de texte parasite en arrière-plan.
   - **Position tirée au hasard sur ordinateur** (`placerActuPopupAuHasard()`, ≥ 1024px) :
     l'une des deux bandes latérales du hero, jamais sur le titre central, la navigation
     ni le bouton WhatsApp. Sur téléphone, place fixe sous le bandeau sponsors.
   - **Lien « + d'infos » vers un autre site** (RBFA, billetterie…) : boîte de confirmation
     `#confirm-sortie` (« Vous quittez le site »), puis ouverture dans un nouvel onglet.
   - Badge « Division 2 Nationale » du hero cliquable → `previewActuPopup()` : affiche
     immédiatement la notification actuellement éligible (même déjà fermée aujourd'hui),
     outil de vérification pour un modérateur. Logique d'éligibilité partagée via
     `getEligibleActuEvent()`.
   - Le champ optionnel `equipe` (`div2`/`u21`) d'un événement de type match réutilise ce
     même calendrier dans la **modale Horaires** de la fiche équipe correspondante (bouton
     « Horaires » désormais affiché en plus du bouton RBFA pour D2/U21, plus seulement pour
     l'académie). `getTeamMatchesFromEvenements(id)` filtre et formate les matchs pour
     `buildScheduleUI()`, combinés aux entraînements récurrents statiques de `teamsData`.
     Bandeau d'avertissement ajouté (horaires possiblement modifiés depuis l'encodage,
     lien vers `teamsData[id].rbfaUrl`). Taille de la modale volontairement inchangée
     (`max-h-[90vh] overflow-y-auto` déjà présent) : le calendrier complet y défile.
   - ⚠️ Uniquement des échéances **réelles** (matchs, détections, portes ouvertes, séance
     d'essai) : ces pratiques figurent sur la liste noire de la directive européenne
     2005/29/CE, jamais de fausse urgence/rareté. Le club est une ASBL qui s'adresse à des
     familles — le risque réputationnel local s'ajoute au risque légal.

## Contact du club (déjà dans le site)

- Complexe sportif : Bd. de la 2ème Armée Britannique 600, 1190 Forest
- Email : union@oasisforest.be — WhatsApp : +32 477 02 20 21
- Réseaux : `oasisforestfutsal` (Instagram, TikTok, Facebook)
