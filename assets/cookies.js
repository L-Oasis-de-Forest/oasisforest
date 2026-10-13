/* Choix des cookies + carte Google Maps.
   Le site lui-même ne dépose aucun cookie : le seul contenu qui en dépose est la carte
   Google. « Essentiels uniquement » (défaut) = la carte reste derrière son bouton ;
   « Tout accepter » = la carte se charge d'elle-même. Le choix est gardé dans le
   navigateur (localStorage, sans cookie) et modifiable via « Gérer les cookies » du pied. */
(function () {
    const CLE = 'cookies-choix';
    const lire = () => { try { return localStorage.getItem(CLE); } catch (e) { return null; } };
    const ecrire = (v) => { try { localStorage.setItem(CLE, v); } catch (e) { /* navigation privée */ } };

    function chargerCarte() {
        const cadre = document.querySelector('#map iframe[data-src]');
        if (!cadre) return;
        cadre.src = cadre.dataset.src;
        cadre.removeAttribute('data-src');
        const voile = document.querySelector('[data-carte-voile]');
        if (voile) voile.remove();
    }

    // Carte : chargée au clic, ou directement si « tout » a été accepté.
    document.querySelectorAll('[data-carte-charger]').forEach((b) => b.addEventListener('click', chargerCarte));
    if (lire() === 'tous') chargerCarte();

    function fermer() { const b = document.getElementById('bandeau-cookies'); if (b) b.remove(); }

    function choisir(valeur) {
        ecrire(valeur);
        fermer();
        if (valeur === 'tous') chargerCarte();
    }

    function afficher() {
        if (document.getElementById('bandeau-cookies')) return;
        const b = document.createElement('div');
        b.id = 'bandeau-cookies';
        b.setAttribute('role', 'dialog');
        b.setAttribute('aria-label', 'Choix des cookies');
        b.className = 'fixed bottom-4 left-4 right-24 sm:right-auto sm:max-w-md z-[80] bg-night border border-white/20 p-5 shadow-2xl';
        b.innerHTML =
            '<p class="text-white font-black text-[11px] tracking-[0.2em] uppercase mb-2">Cookies</p>' +
            '<p class="text-slate-300 text-sm leading-relaxed mb-4">Ce site n’utilise aucun cookie de suivi. « Tout accepter » sert uniquement à afficher la carte Google Maps sans clic. ' +
            '<a href="confidentialite.html" class="underline hover:text-white">En savoir plus</a></p>' +
            '<div class="flex flex-wrap gap-3">' +
            '<button type="button" data-choix="essentiels" class="bouton-vide">Essentiels uniquement</button>' +
            '<button type="button" data-choix="tous" class="bouton-plein">Tout accepter</button></div>';
        b.querySelectorAll('[data-choix]').forEach((x) => x.addEventListener('click', () => choisir(x.dataset.choix)));
        document.body.appendChild(b);
    }

    document.querySelectorAll('[data-gerer-cookies]').forEach((l) => l.addEventListener('click', (e) => { e.preventDefault(); afficher(); }));
    if (!lire()) afficher();
})();
