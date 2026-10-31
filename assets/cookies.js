/* Choix des cookies et contenus externes.
   Le site lui-même ne dépose aucun cookie. Un réglage, mémorisé dans le navigateur
   (localStorage, sans cookie) et modifiables via « Gérer les cookies » du pied de page :
   - la carte Google Maps (accueil et Contact) s'affiche directement : Google peut y déposer
     des cookies, ce que le bandeau et la page de confidentialité indiquent ;
   - stats : mesure d'audience anonyme (assets/mesure.js : sans cookie, sans IP conservée) —
     active par défaut, désactivable. Pas besoin de consentement pour elle, mais autant
     laisser le choix.
   Refuser doit rester aussi simple qu'accepter : trois boutons de même taille. */
(function () {
    const CLE = 'cookies-choix';

    // Ancien format (« tous » / « essentiels ») converti à la lecture.
    function lire() {
        try {
            const brut = localStorage.getItem(CLE);
            if (!brut) return null;
            if (brut === 'tous') return { carte: 1, stats: 1 };
            if (brut === 'essentiels') return { carte: 0, stats: 1 };
            const v = JSON.parse(brut);
            return { carte: v.carte ? 1 : 0, stats: v.stats ? 1 : 0 };
        } catch (e) { return null; }
    }
    const ecrire = (v) => { try { localStorage.setItem(CLE, JSON.stringify(v)); } catch (e) { /* navigation privée */ } };

    function chargerCarte() {
        const cadre = document.querySelector('#map iframe[data-src]');
        if (!cadre) return;
        cadre.src = cadre.dataset.src;
        cadre.removeAttribute('data-src');
        const voile = document.querySelector('[data-carte-voile]');
        if (voile) voile.remove();
    }

    // Carte : au clic, ou directement si elle a été acceptée.
    document.querySelectorAll('[data-carte-charger]').forEach((b) => b.addEventListener('click', chargerCarte));
    const actuel = lire();
    if (actuel && actuel.carte) chargerCarte();

    function fermer() {
        const b = document.getElementById('bandeau-cookies');
        if (b) b.remove();
        document.body.style.overflow = '';
    }

    function choisir(valeur) {
        ecrire(valeur);
        fermer();
        if (valeur.carte) chargerCarte();
    }

    const interrupteur = (nom, titre, detail, coche, verrouille) =>
        '<label class="flex items-start gap-4 py-4 border-t border-white/10 ' + (verrouille ? 'opacity-60' : 'cursor-pointer') + '">' +
        '<input type="checkbox" data-reglage="' + nom + '" class="mt-1 w-4 h-4 accent-[#00c2ff] shrink-0"' + (coche ? ' checked' : '') + (verrouille ? ' disabled' : '') + '>' +
        '<span><span class="block text-white font-bold text-sm">' + titre + '</span>' +
        '<span class="block text-slate-400 text-xs leading-relaxed mt-1">' + detail + '</span></span></label>';

    // Fenêtre centrée, fond flouté. Pas de fermeture en cliquant à côté ni par Échap : refuser
    // reste un vrai bouton, aussi simple qu'accepter.
    function afficher(vue) {
        let b = document.getElementById('bandeau-cookies');
        if (!b) {
            b = document.createElement('div');
            b.id = 'bandeau-cookies';
            b.setAttribute('role', 'dialog');
            b.setAttribute('aria-modal', 'true');
            b.setAttribute('aria-labelledby', 'cookies-titre');
            b.className = 'fixed inset-0 z-[200] flex items-center justify-center px-5 bg-night/70 backdrop-blur-md overflow-y-auto py-6';
            document.body.appendChild(b);
            document.body.style.overflow = 'hidden';
        }
        const courant = lire() || { carte: 0, stats: 1 };

        if (vue === 'detail') {
            b.innerHTML =
                '<div class="w-full max-w-md bg-night border border-white/20 p-6 sm:p-8 shadow-2xl my-auto">' +
                '<p id="cookies-titre" class="text-white font-black text-[11px] tracking-[0.2em] uppercase mb-2">Choisir mes cookies</p>' +
                '<p class="text-slate-300 text-sm leading-relaxed mb-4">Cochez ce que vous acceptez. <a href="confidentialite.html" class="underline hover:text-white">En savoir plus</a></p>' +
                interrupteur('essentiels', 'Essentiels', 'Fonctionnement du site et mémorisation de ce choix. Toujours actifs, aucun cookie.', true, true) +
                interrupteur('stats', 'Mesure d’audience anonyme', 'Pages vues et clics comptés par jour. Sans cookie, sans adresse IP conservée.', !!courant.stats, false) +
                '<div class="flex flex-col sm:flex-row gap-3 mt-4">' +
                '<button type="button" data-action="retour" class="bouton-vide flex-1 justify-center">Retour</button>' +
                '<button type="button" data-action="enregistrer" class="bouton-plein flex-1 justify-center">Enregistrer</button></div></div>';
            b.querySelector('[data-action=retour]').addEventListener('click', () => afficher('principal'));
            b.querySelector('[data-action=enregistrer]').addEventListener('click', () => choisir({
                carte: 1,
                stats: b.querySelector('[data-reglage=stats]').checked ? 1 : 0,
            }));
            return;
        }

        b.innerHTML =
            '<div class="w-full max-w-md bg-night border border-white/20 p-6 sm:p-8 shadow-2xl my-auto">' +
            '<p id="cookies-titre" class="text-white font-black text-[11px] tracking-[0.2em] uppercase mb-3">Cookies</p>' +
            '<p class="text-slate-300 text-sm leading-relaxed mb-6">Ce site ne dépose aucun cookie de suivi. La carte Google Maps peut en déposer elle-même. Vous choisissez seulement de compter votre visite de façon anonyme. ' +
            '<a href="confidentialite.html" class="underline hover:text-white">En savoir plus</a></p>' +
            '<div class="flex flex-col gap-3">' +
            '<button type="button" data-action="refuser" class="bouton-vide justify-center">Tout refuser</button>' +
            '<button type="button" data-action="detail" class="bouton-vide justify-center">Personnaliser</button>' +
            '<button type="button" data-action="accepter" class="bouton-plein justify-center">Tout accepter</button></div></div>';
        b.querySelector('[data-action=refuser]').addEventListener('click', () => choisir({ carte: 1, stats: 0 }));
        b.querySelector('[data-action=detail]').addEventListener('click', () => afficher('detail'));
        b.querySelector('[data-action=accepter]').addEventListener('click', () => choisir({ carte: 1, stats: 1 }));
        b.querySelector('[data-action=refuser]').focus();
    }

    // « Gérer les cookies » : ouvre directement le détail, avec le choix actuel coché.
    document.querySelectorAll('[data-gerer-cookies]').forEach((l) => l.addEventListener('click', (e) => { e.preventDefault(); afficher('detail'); }));
    if (!lire()) afficher('principal');
})();
