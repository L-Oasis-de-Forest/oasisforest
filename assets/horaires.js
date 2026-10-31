/* Modale « Horaires » de la page Équipes. Même rendu que la modale Horaires de l'accueil
   (index.html, openTeamModal) : les boutons [data-horaires="<équipe>"] l'ouvrent sur place.
   D2 et U21 y ajoutent les vrais matchs du calendrier RBFA (outil admin, avec
   data/evenements.json en secours). Dépend de esc() et loadJSON() de commun.js. */
(function () {
    const API = 'https://oasisforest-admin-tool.tristederk.workers.dev/api/evenements';

    // Mêmes horaires que `teamsData` dans index.html : à tenir alignés.
    const EQUIPES = {
        u3: {
            titre: 'Baby Futsal (U3-U7)',
            seances: [{ day: 'SAM', type: 'Entraînement', time: '14:00 - 15:00', location: 'Bempt' }]
        },
        u15_u17: {
            titre: 'Futsal (U15-U17)',
            seances: [
                { day: 'LUN', type: 'U15 · Entraînement', time: '18:00', location: 'Bempt' },
                { day: 'VEN', type: 'U17 · Entraînement', time: '18:00', location: 'Bempt' },
                { day: 'SAM', type: 'U17 · Match', time: '15:00', location: 'Selon calendrier', isMatch: true },
                { day: 'SAM', type: 'U15 · Match à domicile', time: '16:00', location: 'Bempt', isMatch: true }
            ]
        },
        u21: {
            titre: 'Espoirs (U21)',
            rbfa: 'https://www.rbfa.be/fr/club/9955/equipe/369102/calendrier',
            seances: [{ day: 'LUN', type: 'Entraînement', time: '19:30', location: 'Centre sportif des Primeurs' }]
        },
        div2: {
            titre: 'Équipe première',
            rbfa: 'https://www.rbfa.be/fr/club/9955/equipe/369103/calendrier',
            seances: []
        }
    };

    // Matchs à venir d'abord (le prochain mis en avant), puis l'historique, du plus récent au plus ancien.
    async function matchs(id) {
        const data = (await loadJSON(API)) || (await loadJSON('data/evenements.json'));
        const liste = (data && Array.isArray(data.evenements)) ? data.evenements : [];
        const jour = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const auj = jour(new Date());
        const tous = liste.filter((e) => e.type === 'match' && e.equipe === id).map((e) => {
            const d = new Date(e.date);
            const ok = !isNaN(d);
            return {
                day: ok ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` : '?',
                type: e.titre || 'Match',
                time: ok ? d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) : '',
                location: e.lieu || 'Extérieur',
                _d: d, _ok: ok
            };
        });
        const avenir = tous.filter((m) => m._ok && jour(m._d) >= auj).sort((a, b) => a._d - b._d);
        const passes = tous.filter((m) => !m._ok || jour(m._d) < auj).sort((a, b) => b._d - a._d);
        if (avenir.length) avenir[0].isNext = true;
        return [...avenir, ...passes];
    }

    function planning(items) {
        if (!items.length) return "<p class='text-slate-400 text-center py-4 font-light italic'>Horaires en cours de planification...</p>";
        const lignes = items.map((it) => {
            const fort = it.isMatch || it.isNext;
            const badge = it.isNext ? '<span class="px-2 py-0.5 bg-accent text-night text-[9px] font-black tracking-widest uppercase ml-2 shrink-0">Prochain match</span>' : (it.isMatch ? '<span class="px-2 py-0.5 bg-accent text-night text-[9px] font-black tracking-widest uppercase ml-2 shrink-0">Match</span>' : '');
            const icone = fort ? '<i class="fas fa-fire text-accent animate-pulse"></i>' : '<i class="fas fa-running text-slate-400"></i>';
            return `
                <div class="flex items-stretch overflow-hidden border ${fort ? 'border-accent/40 shadow-[0_0_15px_rgba(0,194,255,0.1)] bg-accent/5' : 'border-white/5 bg-white/[0.02]'} transition-colors hover:bg-white/10">
                    <div class="${fort ? 'bg-accent text-night' : 'bg-night/80 border-r border-white/5 text-slate-300'} flex flex-col items-center justify-center w-14 md:w-16 p-2 shrink-0">
                        <span class="text-xs font-black uppercase tracking-wider">${esc(it.day)}</span>
                    </div>
                    <div class="p-3 md:p-4 flex-1 min-w-0 flex flex-col justify-center">
                        <div class="flex flex-wrap justify-between items-start mb-1 gap-x-3 gap-y-1">
                            <span class="font-bold text-white text-sm md:text-base flex items-center flex-wrap gap-x-2">${icone} ${esc(it.type)} ${badge}</span>
                            <span class="text-accent font-black text-sm md:text-base whitespace-nowrap">${esc(it.time)}</span>
                        </div>
                        <span class="text-xs text-slate-400 flex items-center gap-1.5 mt-1"><i class="fas fa-map-marker-alt w-3 text-center opacity-70"></i> ${esc(it.location)}</span>
                    </div>
                </div>`;
        }).join('');
        return `<div class="space-y-3 w-full">${lignes}</div><p class="mt-6 text-[10px] text-slate-500 italic text-center uppercase tracking-widest">Sous réserve de modifications</p>`;
    }

    function init() {
        const declencheurs = document.querySelectorAll('[data-horaires]');
        if (!declencheurs.length) return;

        const fond = document.createElement('div');
        fond.className = 'fixed inset-0 bg-night/80 backdrop-blur-sm z-[90] hidden items-center justify-center px-4';
        fond.innerHTML = `
            <div role="dialog" aria-modal="true" aria-labelledby="horaires-titre" class="glass-panel border-accent/40 w-full max-w-lg p-6 md:p-10 relative flex flex-col shadow-[0_0_40px_rgba(0,194,255,0.2)] max-h-[90dvh] overflow-hidden">
                <button type="button" data-fermer class="absolute top-4 right-4 w-10 h-10 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Fermer" aria-label="Fermer"><i class="fas fa-times"></i></button>
                <div class="text-center mt-10 md:mt-6 mb-6 shrink-0"><h3 id="horaires-titre" class="text-xl md:text-2xl font-black text-white">Horaires</h3></div>
                <div class="bg-night/50 p-4 md:p-6 border border-white/5 w-full flex-1 min-h-0 overflow-y-auto no-scrollbar"><div data-contenu class="w-full"></div></div>
                <div data-avertissement class="shrink-0 w-full"></div>
                <a data-abonnement href="#" class="hidden shrink-0 w-full mt-5 bg-accent text-white font-black px-6 py-3.5 hover:bg-accentDark transition-colors items-center justify-center gap-2 text-[11px] uppercase tracking-[0.14em]">S'abonner à l'agenda</a>
            </div>`;
        document.body.append(fond);
        const titre = fond.querySelector('#horaires-titre');
        const contenu = fond.querySelector('[data-contenu]');
        const avert = fond.querySelector('[data-avertissement]');
        const abo = fond.querySelector('[data-abonnement]');
        let retour = null;

        function fermer() {
            fond.classList.add('hidden');
            fond.classList.remove('flex');
            document.body.classList.remove('modal-open');
            if (retour) retour.focus();
        }

        async function ouvrir(id, bouton) {
            const eq = EQUIPES[id];
            if (!eq) return;
            retour = bouton;
            titre.textContent = `Horaires ${eq.titre}`.replace(/-/g, '\u2011'); // tiret insécable : « (U3‑U7) » ne se coupe plus
            contenu.innerHTML = '<p class="text-slate-400 text-center py-4 font-light italic">Chargement…</p>';
            avert.innerHTML = '';
            abo.classList.add('hidden'); abo.classList.remove('flex');
            fond.classList.remove('hidden'); fond.classList.add('flex');
            document.body.classList.add('modal-open');
            fond.querySelector('[data-fermer]').focus();

            const liste = eq.rbfa ? [...eq.seances, ...(await matchs(id))] : eq.seances;
            contenu.innerHTML = planning(liste);
            if (contenu.parentElement) contenu.parentElement.scrollTop = 0;
            if (eq.rbfa) {
                avert.innerHTML = `
                    <a href="${esc(eq.rbfa)}" target="_blank" rel="noopener noreferrer" class="mt-4 w-full flex items-center justify-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 hover:text-white font-black px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] transition-colors"><i class="fas fa-triangle-exclamation"></i>Site RBFA</a>`;
                abo.href = `${API}/ics?equipe=${id}`.replace(/^https?:\/\//, 'webcal://');
                abo.classList.remove('hidden'); abo.classList.add('flex');
            }
        }

        declencheurs.forEach((b) => b.addEventListener('click', () => ouvrir(b.dataset.horaires, b)));
        fond.addEventListener('click', (e) => { if (e.target === fond || e.target.closest('[data-fermer]')) fermer(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !fond.classList.contains('hidden')) fermer(); });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
