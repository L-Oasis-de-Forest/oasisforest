/* Mesure d'audience minimale, chargée sur toutes les pages. Lue depuis l'onglet « Stats web »
   de l'outil admin du club. Agrégats par jour uniquement côté serveur : pas d'IP stockée,
   pas de cookie, pas d'identifiant visiteur. Si le navigateur bloque la requête
   (ad-blocker, hors ligne…), rien ne casse. */
(function () {
    const TRACK_ENDPOINT = 'https://oasisforest-admin-tool.tristederk.workers.dev/api/track';
    // Mesure refusée dans le bandeau cookies (assets/cookies.js) : rien n'est envoyé.
    try {
        const choix = localStorage.getItem('cookies-choix');
        if (choix && choix !== 'tous' && choix !== 'essentiels' && !JSON.parse(choix).stats) return;
    } catch (e) { /* pas de stockage : mesure active par défaut */ }

    const device = window.innerWidth < 768 ? 'Mobile' : 'Desktop';

    // Origine du visiteur : ?utm_source=… s'il existe (liens des bios réseaux), sinon le
    // domaine de la page précédente, sinon « direct ». Jamais l'URL complète du référent.
    function source() {
        try {
            const utm = new URLSearchParams(location.search).get('utm_source');
            if (utm) return utm.toLowerCase().slice(0, 40);
            if (document.referrer) {
                const hote = new URL(document.referrer).hostname.replace(/^www\./, '');
                if (hote && hote !== location.hostname.replace(/^www\./, '')) return hote.slice(0, 60);
            }
        } catch (e) { /* référent illisible : on retombe sur « direct » */ }
        return 'direct';
    }

    // fetch (et non sendBeacon) : un beacon JSON inter-domaine passe par un contrôle CORS
    // préalable que Chrome fait échouer (cookies « include » imposés) — la requête n'était
    // alors jamais envoyée. Corps en texte brut + sans cookies = requête simple, sans
    // préflight ; « keepalive » lui permet de partir pendant la fermeture de l'onglet.
    function send(body) {
        try {
            fetch(TRACK_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({ device, ...body }),
                keepalive: true,
                credentials: 'omit'
            }).catch(() => {});
        } catch (e) { /* silencieux : la mesure ne doit jamais impacter le site */ }
    }

    send({ type: 'pageview', path: location.pathname, source: source() });

    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-track]');
        if (el) send({ type: 'click', element: el.getAttribute('data-track') });
    });

    // Temps passé sur la page, envoyé une seule fois à la sortie. « pagehide » plutôt que
    // « beforeunload » : plus fiable sur mobile (Safari, cache arrière/avant).
    const loadedAt = performance.now();
    let durationSent = false;
    window.addEventListener('pagehide', () => {
        if (durationSent) return;
        durationSent = true;
        send({ type: 'duration', seconds: Math.round((performance.now() - loadedAt) / 1000) });
    });
})();
