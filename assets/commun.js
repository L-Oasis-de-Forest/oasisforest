/* Comportements communs à toutes les pages du site (hors index.html, qui garde
   son propre script pour les modales d'équipe, l'agenda et la pop-up Actu).

   Contenu : menu mobile, apparitions au scroll (.reveal), année du footer,
   protection légère des photos, bandeau sponsors, et les helpers de chargement
   des JSON éditables via /admin. */

// --- Helpers partagés (mêmes règles que dans index.html) ---

// Le CMS écrit des chemins absolus (/img/...). On les repasse en relatif pour que
// le site fonctionne aussi hors racine de domaine.
const toRel = (p) => (p || '').replace(/^\//, '');

// Échappement HTML des textes venant du CMS : ils sont injectés en innerHTML et
// dans des attributs, où un guillemet ou un chevron casserait le balisage.
function esc(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Charge un JSON en tolérant l'absence de fichier (retourne null sans casser la page).
async function loadJSON(url) {
    try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) return null;
        return await res.json();
    } catch (_) {
        return null;
    }
}

// --- Menu mobile ---
function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    const menuIcon = btn.querySelector('i');

    function toggleMenu() {
        menu.classList.toggle('opacity-0');
        menu.classList.toggle('invisible');
        const ferme = menu.classList.contains('opacity-0');
        menuIcon.classList.toggle('fa-times', !ferme);
        menuIcon.classList.toggle('fa-bars', ferme);
        document.body.classList.toggle('modal-open', !ferme);
    }

    btn.addEventListener('click', toggleMenu);
    menu.querySelectorAll('.mobile-link').forEach((lien) => {
        lien.addEventListener('click', () => {
            if (!menu.classList.contains('opacity-0')) toggleMenu();
        });
    });
}

// --- Apparitions au scroll ---
function setupReveal() {
    const options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, options);
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    // Filet de sécurité : les blocs déjà visibles au chargement doivent apparaître
    // même si l'observer n'a pas encore déclenché.
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('active');
        });
    }, 100);
}

// --- Bandeau sponsors (data/sponsors.json, éditable via /admin) ---
// Même rendu que sur la page d'accueil. Si la liste est vide, le bandeau est
// masqué proprement plutôt que d'afficher un cadre vide.
function buildSponsor(s) {
    let inner;
    if (s.logo && s.logo.trim() !== '') {
        inner = document.createElement('img');
        inner.src = toRel(s.logo);
        inner.alt = s.nom || '';
        inner.loading = 'lazy';
        inner.className = 'h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity';
    } else if (s.principal) {
        inner = document.createElement('div');
        inner.className = 'flex items-center gap-2';
        inner.innerHTML = '<i class="fas fa-crown text-accent text-sm"></i>';
        const span = document.createElement('span');
        span.className = 'text-sm font-black text-white tracking-widest uppercase';
        span.textContent = s.nom || '';
        inner.append(span);
    } else {
        inner = document.createElement('div');
        inner.className = 'text-xs font-bold text-slate-300 uppercase tracking-widest';
        inner.textContent = s.nom || '';
    }
    if (s.url && s.url.trim() !== '') {
        const a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'flex items-center';
        a.setAttribute('aria-label', s.nom || 'Sponsor');
        a.append(inner);
        return a;
    }
    return inner;
}

async function renderSponsors() {
    const marquee = document.getElementById('sponsors-marquee');
    const pistes = [document.getElementById('sponsors-track-1'), document.getElementById('sponsors-track-2')];
    if (!marquee) return;
    const data = await loadJSON('data/sponsors.json');
    const list = (data && Array.isArray(data.sponsors)) ? data.sponsors : [];
    if (!list.length) {
        marquee.classList.add('hidden');
        return;
    }
    pistes.forEach((piste) => {
        if (!piste) return;
        piste.innerHTML = '';
        list.forEach((s) => piste.append(buildSponsor(s)));
    });
}

// --- Photo de l'équipe première (data/equipe-premiere.json, éditable via /admin) ---
// Uniquement présent sur equipes.html : sur les autres pages, le conteneur n'existe
// pas et la fonction ne fait rien. Masquée si le champ est vide (pas de photo encore
// renseignée), plutôt que d'afficher un cadre cassé.
async function renderEquipePremierePhoto() {
    const bloc = document.getElementById('photo-equipe-premiere');
    if (!bloc) return;
    const img = document.getElementById('photo-equipe-premiere-img');
    const data = await loadJSON('data/equipe-premiere.json');
    const photo = data && data.photo && data.photo.trim();
    if (!photo) return;
    // Photo masquée depuis la galerie (/admin, case « Masquer cette photo ») : le bloc reste caché.
    const galerie = await loadJSON('data/gallery.json');
    const masquee = ((galerie && Array.isArray(galerie.photos)) ? galerie.photos : [])
        .some((p) => p.masquee === true && toRel(p.image) === toRel(photo));
    if (masquee) return;
    img.src = toRel(photo);
    bloc.classList.remove('hidden');
}

// --- Protection légère des photos ---
// Bloque le clic droit ("Enregistrer l'image sous...") et le glisser-déposer, en
// complément du CSS. Ne bloque pas les captures d'écran : c'est une gêne, pas
// une vraie protection.
function setupImageProtection() {
    document.addEventListener('contextmenu', (e) => { if (e.target.tagName === 'IMG') e.preventDefault(); });
    document.addEventListener('dragstart', (e) => { if (e.target.tagName === 'IMG') e.preventDefault(); });
}

// --- Année du footer ---
function setupYear() {
    document.querySelectorAll('#year').forEach((el) => { el.textContent = new Date().getFullYear(); });
}


// --- Effet d'inclinaison au survol (.hover-tilt) ---
// Même comportement que sur l'accueil. La rotation de base d'un polaroid est
// conservée dans data-rotation et recomposée avec l'inclinaison, sinon le survol
// remettrait la photo droite d'un coup.
function activerTilt(racine = document) {
    racine.querySelectorAll('.hover-tilt').forEach((el) => {
        if (el.dataset.tiltActif) return;
        el.dataset.tiltActif = '1';
        const base = el.dataset.rotation || '';
        const max = parseInt(el.getAttribute('data-tilt-max') || '15', 10);

        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -max;
            const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * max;
            el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02) ${base}`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = base; });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupReveal();
    setupImageProtection();
    setupYear();
    renderSponsors();
    renderEquipePremierePhoto();
    activerTilt();
});
