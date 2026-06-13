const API = "https://network-server-7kuc.onrender.com";

const SLIDES = [
    {
    title: "LCE Network",
    badge: "Official",
    desc: "Kowhaifan's Clubhouse is a legacy console edition server. We are proud to be the oldest running LCE server and the very first to successfully implement a proper, secure authentication system for our community.",
    bg: "linear-gradient(135deg, #58caff 0%, #0d1b6b 100%)",
    accent: "#0070d1",
    label: "Game",
    image: "/assets/images/ps3.png",
    logo: "/assets/images/LCE.png",
    buttons: [
      { text: '<i style="margin-right: 7px;" class="fa-solid fa-arrow-up-right-from-square"></i>Play Now!', type: "primary", href: "https://discord.com/invite/FzZ2AFnw6Z", target: "external" },
      {
        text: "Visit Website",
        type: "secondary",
        href: "https://kowhaifan.net",
        target: "external",
      },
    ],
  },
  {
    title: "Kowhaifan's Clubhouse",
    badge: "Partnered Server",
    desc: "Kowhaifan's Clubhouse is a legacy console edition server. We are proud to be the oldest running LCE server and the very first to successfully implement a proper, secure authentication system for our community.",
    bg: "linear-gradient(135deg, #ffe058 0%, #6b650d 100%)",
    accent: "#0070d1",
    label: "Game",
    image: "/assets/images/CroplicousQHD.png",
    logo: "/assets/images/kowhaifanclubhouse.png",
    buttons: [
      { text: '<i style="margin-right: 7px;" class="fa-solid fa-arrow-up-right-from-square"></i>Play Now!', type: "primary", href: "https://discord.com/invite/FzZ2AFnw6Z", target: "external" },
      {
        text: "Visit Website",
        type: "secondary",
        href: "https://kowhaifan.net",
        target: "external",
      },
    ],
  },
    {
    title: "Blue's SMP",
    badge: "Partnered Server",
    desc: "Second oldest LCE server! We have our own authentication system and a laid-back community of players who love Minecraft: Legacy Console Edition. Whether you're looking to build, survive, or just hang out with other LCE players, you're welcome to join us.",
    bg: "linear-gradient(135deg, #5871ff 0%, #0d656b 100%)",
    accent: "#0070d1",
    label: "Game",
    image: "/assets/images/bluessmp-bg.png",
    logo: "/assets/images/logoblue.png",
    buttons: [
      { text: '<i style="margin-right: 7px;" class="fa-solid fa-arrow-up-right-from-square"></i>Join Discord', type: "primary", href: "https://discord.gg/x4BuDfpgsE", target: "external" },
      {
        text: "Visit Website",
        type: "secondary",
        href: "https://blues-smp.github.io",
        target: "external",
      },
    ],
  },
  {
    title: "LCE Emerald Launcher",
    badge: "Launcher",
    desc: "Our partnered, and recommended launcher for everyone playing Minecraft: Legacy Console Edition. Adds useful features and custom DLC to your experience.",
    bg: "linear-gradient(135deg, #0d1a0d 0%, #0a3d0a 100%)",
    accent: "#22c55e",
    label: "Launcher",
    image: "/assets/images/emerald.png",
    buttons: [
      {
        text: "Get Launcher",
        type: "primary",
        href: "https://github.com/LCE-Hub/LCE-Emerald-Launcher/",
        target: "external",
      },
      { text: "Docs", type: "secondary", href: "/docs/launcher/" },
    ],
  },
];

const NEWS = [
  {
    tag: "Partnership",
    title: "Continuing partnership with LCE Emerald Launcher",
    date: "Jun 10, 2026",
    featured: false,
    image: "/assets/images/emerald.png",
  },
  {
    tag: "Partnership",
    title: "Partnering with Blue's SMP",
    date: "Jun 10, 2026",
    featured: false,
    image: "/assets/images/bluessmp-bg.png",
    desc: "",
  },
  {
    tag: "Partnership",
    title: "Partnering with Kowhaifan's Clubhouse",
    date: "Jun 8, 2026",
    featured: false,
    image: "/assets/images/CroplicousQHD.png",
  },
  
];

const VERSIONS = [];

let currentSlide = 0;
let slideTimer = null;

function getToken() {
  return localStorage.getItem("lcen_token");
}
function setToken(t) {
  localStorage.setItem("lcen_token", t);
}
function clearToken() {
  localStorage.removeItem("lcen_token");
  localStorage.removeItem("lcen_profile");
}
function getProfile() {
  const p = localStorage.getItem("lcen_profile");
  return p ? JSON.parse(p) : null;
}
function setProfile(p) {
  localStorage.setItem("lcen_profile", JSON.stringify(p));
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function showToast(msg, duration = 3000) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

function avatarUrlFor(profileLike) {
  if (profileLike?.avatar) return profileLike.avatar;
  if (profileLike?.xuid) return `${API}/avatar/${profileLike.xuid}`;
  const seed = profileLike?.gamertag || "player";
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
}

/* ===== Nav Search Dropdown ===== */
let searchDebounce = null;
let searchAbort = null;

function buildSearchDropdown(actionsEl) {
  const wrap = document.createElement("div");
  wrap.className = "nav-search-wrap";

  const search = document.createElement("div");
  search.className = "nav-search";
  search.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search players..." id="nav-search-input" autocomplete="off">`;

  const results = document.createElement("div");
  results.className = "search-results";
  results.id = "nav-search-results";

  wrap.appendChild(search);
  wrap.appendChild(results);
  actionsEl.appendChild(wrap);

  const input = search.querySelector("input");

  input.addEventListener("input", (e) => {
    const q = e.target.value.trim();
    clearTimeout(searchDebounce);
    if (!q) {
      results.classList.remove("show");
      results.innerHTML = "";
      return;
    }
    searchDebounce = setTimeout(() => runPlayerSearch(q, results), 250);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (q) window.location.href = `/profile/?q=${encodeURIComponent(q)}`;
    }
    if (e.key === "Escape") {
      results.classList.remove("show");
      input.blur();
    }
  });

  input.addEventListener("focus", () => {
    if (results.innerHTML.trim()) results.classList.add("show");
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) {
      results.classList.remove("show");
    }
  });
}

async function runPlayerSearch(query, resultsEl) {
  resultsEl.innerHTML = `<div class="search-results-loading">Searching...</div>`;
  resultsEl.classList.add("show");

  if (searchAbort) searchAbort.abort();
  searchAbort = new AbortController();

  try {
    let players = [];
    try {
      const data = await apiFetch(
        `/players/search?q=${encodeURIComponent(query)}&scope=all`,
        { signal: searchAbort.signal },
      );
      players = Array.isArray(data) ? data : data.results || [];
    } catch {
      players = [];
    }

    renderSearchResults(players, query, resultsEl);
  } catch (err) {
    if (err.name === "AbortError") return;
    resultsEl.innerHTML = `<div class="search-results-empty">No results found.</div>`;
  }
}

function renderSearchResults(players, query, resultsEl) {
  if (!players || players.length === 0) {
    resultsEl.innerHTML = `
      <div class="search-results-empty">No players found for "${query}".</div>
      <div class="search-results-footer" id="search-view-all">View full search</div>`;
  } else {
    resultsEl.innerHTML = players
      .slice(0, 6)
      .map((p) => {
        const avatar = avatarUrlFor(p);
        return `
        <div class="search-result-item" data-gamertag="${p.gamertag}">
          <img src="${avatar}" alt="${p.gamertag}" onerror="this.style.visibility='hidden'">
          <div class="search-result-info">
            <div class="search-result-name">${p.gamertag}</div>
            <div class="search-result-meta">${p.gamerscore ?? 0} G</div>
          </div>
        </div>`;
      })
      .join("") + `<div class="search-results-footer" id="search-view-all">View full search</div>`;

    resultsEl.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", () => {
        const tag = item.dataset.gamertag;
        window.location.href = `/profile/?q=${encodeURIComponent(tag)}`;
      });
    });
  }

  const viewAll = resultsEl.querySelector("#search-view-all");
  if (viewAll) {
    viewAll.addEventListener("click", () => {
      window.location.href = `/profile/?q=${encodeURIComponent(query)}`;
    });
  }
}

/* ===== Nav User Menu ===== */
function buildUserMenu(actionsEl, profile) {
  const wrap = document.createElement("div");
  wrap.className = "nav-user";

  const trigger = document.createElement("button");
  trigger.className = "nav-user-trigger";
  trigger.innerHTML = `
    <img src="${avatarUrlFor(profile)}" alt="${profile.gamertag}" onerror="this.style.visibility='hidden'">
    <span>${profile.gamertag}</span>
    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>`;

  const menu = document.createElement("div");
  menu.className = "nav-user-menu";
  menu.innerHTML = `
    <div class="nav-user-menu-header">
      <img src="${avatarUrlFor(profile)}" alt="${profile.gamertag}" onerror="this.style.visibility='hidden'">
      <div>
        <div class="nav-user-menu-name">${profile.gamertag}</div>
        <div class="nav-user-menu-sub">${profile.gamerscore ?? 0} G</div>
      </div>
    </div>
    <div class="nav-user-menu-links">
      <a href="/profile/" class="nav-user-menu-link">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        My Profile
      </a>
      <a href="/dashboard/" class="nav-user-menu-link">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
        Dashboard
      </a>
      <a href="/friends/" class="nav-user-menu-link">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        Friends
      </a>
      <a href="/messages/" class="nav-user-menu-link">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        Messages
      </a>
      <a href="/plugin/manage" class="nav-user-menu-link">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        Manage Plugins
      </a>
      <div class="nav-user-menu-divider"></div>
      <a href="#" class="nav-user-menu-link danger" id="nav-sign-out">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
        Sign Out
      </a>
    </div>`;

  wrap.appendChild(trigger);
  wrap.appendChild(menu);
  actionsEl.appendChild(wrap);

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    wrap.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove("open");
    }
  });

  menu.querySelector("#nav-sign-out").addEventListener("click", (e) => {
    e.preventDefault();
    clearToken();
    location.reload();
  });
}

function buildNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const profile = getProfile();
  const actionsEl = nav.querySelector(".nav-actions");
  if (!actionsEl) return;
  actionsEl.innerHTML = "";

  buildSearchDropdown(actionsEl);

  if (profile) {
    buildUserMenu(actionsEl, profile);
  } else {
    const loginBtn = document.createElement("a");
    loginBtn.href = "/login/";
    loginBtn.className = "btn btn-ghost";
    loginBtn.textContent = "Sign In";
    actionsEl.appendChild(loginBtn);
    const regBtn = document.createElement("a");
    regBtn.href = "/register/";
    regBtn.className = "btn btn-primary";
    regBtn.style.minWidth = "unset";
    regBtn.style.padding = "9px 20px";
    regBtn.textContent = "Register";
    actionsEl.appendChild(regBtn);
  }
}

function buildHero() {
  const heroEl = document.getElementById("hero");
  if (!heroEl) return;

  const slidesEl = document.createElement("div");
  slidesEl.className = "hero-slides";

  SLIDES.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide" + (i === 0 ? " active" : "");
    slide.innerHTML = `
      <div class="hero-bg" style="background:${s.bg}">
        ${s.image ? `<img src="${s.image}" alt="${s.title}" class="hero-bg-image">` : ""}
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-badge">${s.badge}</span>
        ${
  s.logo
    ? `<div class="hero-logo-wrap">
         <img src="${s.logo}" alt="${s.title}" class="hero-logo">
       </div>`
    : `<h1 class="hero-title">${s.title}</h1>`
}
        <p class="hero-desc">${s.desc}</p>
        <div class="hero-actions">
          ${s.buttons
            .map(
              (b) => `
            <a class="btn btn-${b.type}" href="${b.href}" ${b.target === "external" ? 'target="_blank" rel="noopener noreferrer"' : ""}>
              ${b.text}
            </a>
          `,
            )
            .join("")}
        </div>
      </div>`;
    slidesEl.appendChild(slide);
  });

  heroEl.appendChild(slidesEl);

  const arrows = document.createElement("div");
  arrows.className = "hero-arrows";
  arrows.innerHTML = `
    <button class="hero-arrow" id="hero-prev">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="hero-arrow" id="hero-next">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
    </button>`;
  heroEl.appendChild(arrows);

  const nav = document.createElement("div");
  nav.className = "hero-nav";
  SLIDES.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot" + (i === 0 ? " active" : "");
    dot.onclick = () => goToSlide(i);
    nav.appendChild(dot);
  });
  heroEl.appendChild(nav);

  document.getElementById("hero-prev").onclick = () =>
    goToSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);
  document.getElementById("hero-next").onclick = () =>
    goToSlide((currentSlide + 1) % SLIDES.length);

  startSlideTimer();
}

function goToSlide(idx) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const thumbs = document.querySelectorAll(".thumb");

  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  if (thumbs[currentSlide]) thumbs[currentSlide].classList.remove("active");

  currentSlide = idx;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
  if (thumbs[currentSlide]) thumbs[currentSlide].classList.add("active");

  document.querySelector(".hero-slides").style.transform =
    `translateX(-${currentSlide * 100}%)`;
  startSlideTimer();
}

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(
    () => goToSlide((currentSlide + 1) % SLIDES.length),
    5500,
  );
}

function buildThumbnails() {
  const el = document.getElementById("thumbnails");
  if (!el) return;
  SLIDES.forEach((s, i) => {
    const thumb = document.createElement("div");
    thumb.className = "thumb" + (i === 0 ? " active" : "");
    thumb.onclick = () => goToSlide(i);
    thumb.innerHTML = `
      <div class="thumb-bg" style="background:${s.bg}">
        ${s.image ? `<img src="${s.image}" alt="${s.title}" class="thumb-image">` : ""}
      </div>
      <span class="thumb-label">${s.title}</span>`;
    el.appendChild(thumb);
  });
}

function buildNews() {
  const grid = document.getElementById("news-grid");
  if (!grid) return;
  NEWS.forEach((n, i) => {
    const card = document.createElement("div");
    card.className = "news-card" + (n.featured ? " featured" : "");
    card.innerHTML = `
      <div class="news-img">
        ${n.image ? `<img src="${n.image}" alt="${n.title}" class="news-image">` : ""}
      </div>
      <div class="news-body">
        <div class="news-tag">${n.tag}</div>
        <div class="news-title">${n.title}</div>
        ${n.featured && n.desc ? `<div class="news-desc">${n.desc}</div>` : ""}
        <div class="news-date">${n.date}</div>
      </div>`;
    grid.appendChild(card);
  });
}

async function refreshToken() {
  if (!getToken()) return;
  try {
    const data = await apiFetch("/me");
    setProfile(data);
    buildNav();
  } catch {
    clearToken();
    buildNav();
  }
}

function initHome() {
  buildNav();
  buildHero();
  buildThumbnails();
  buildNews();
  refreshToken();
}

function initLogin() {
  buildNav();
  const form = document.getElementById("login-form");
  if (!form) return;

  if (getToken()) {
    window.location.href = "/profile/";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const btn = form.querySelector(".form-submit");
    const errEl = document.getElementById("login-error");
    btn.disabled = true;
    btn.textContent = "Signing in...";
    errEl.classList.remove("show");
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      setProfile(data.profile);
      window.location.href = "/profile/";
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.add("show");
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  });
}

function initRegister() {
  buildNav();
  const form = document.getElementById("register-form");
  if (!form) return;

  if (getToken()) {
    window.location.href = "/profile/";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const gamertag = form.gamertag.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const btn = form.querySelector(".form-submit");
    const errEl = document.getElementById("register-error");
    btn.disabled = true;
    btn.textContent = "Creating account...";
    errEl.classList.remove("show");
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ gamertag, email, password }),
      });
      setToken(data.token);
      setProfile(data.profile);
      window.location.href = "/profile/";
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.add("show");
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  });
}

function buildFriendButtonHTML(targetXuid, myProfile, myFriendData) {
  if (!myProfile || myProfile.xuid === targetXuid) return "";

  const isFriend =
    myFriendData?.friends?.includes(targetXuid) ??
    myProfile.friends?.includes(targetXuid);
  const isPending =
    myFriendData?.sent?.includes(targetXuid) ??
    myProfile.friendRequestsSent?.includes(targetXuid);

  if (isFriend) {
    return `<button
      class="btn btn-secondary friend-btn"
      data-xuid="${targetXuid}"
      data-state="friends"
      disabled
      style="cursor:default;opacity:1;pointer-events:none;"
    >Friends</button>`;
  }

  if (isPending) {
    return `<button
      class="btn btn-secondary friend-btn"
      data-xuid="${targetXuid}"
      data-state="pending"
      disabled
      style="opacity:0.5;cursor:not-allowed;pointer-events:none;"
    >Pending</button>`;
  }

  return `<button
    class="btn btn-primary friend-btn"
    data-xuid="${targetXuid}"
    data-state="none"
    style="min-width:unset;padding:9px 20px;"
  >Add Friend</button>`;
}

function attachFriendButton(container, targetXuid) {
  const btn = container.querySelector('.friend-btn[data-state="none"]');
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "...";
    try {
      await apiFetch(`/friends/request/${targetXuid}`, { method: "POST" });
      btn.textContent = "Pending";
      btn.className = "btn btn-secondary friend-btn";
      btn.dataset.state = "pending";
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
      btn.style.pointerEvents = "none";
      showToast("Friend request sent!");
    } catch (err) {
      showToast(err.message);
      btn.disabled = false;
      btn.textContent = "Add Friend";
    }
  });
}

function renderProfile(profile, isOwn, friendData) {
  const container = document.getElementById("profile-container");
  if (!container) return;

  const me = getProfile();
  const avatarSrc =
    profile.avatar ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(profile.gamertag)}`;
  const roleClass = `role-${profile.role}`;
  const friendBtnHTML = isOwn
    ? ""
    : buildFriendButtonHTML(profile.xuid, me, friendData);

  container.innerHTML = `
    <div class="profile-header">
      <div style="position:relative;flex-shrink:0;">
        <img class="profile-avatar" id="profile-avatar-img" src="${avatarSrc}" alt="${profile.gamertag}">
        ${
          isOwn
            ? `<label for="avatar-upload" style="position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #fff;font-size:0.75rem;" title="Change avatar">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </label>
        <input type="file" id="avatar-upload" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none;">`
            : ""
        }
      </div>
      <div class="profile-info">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <div class="profile-gamertag">${profile.gamertag}</div>
          <span class="role-badge ${roleClass}">${profile.role}</span>
          ${friendBtnHTML}
        </div>
        <div class="profile-xuid">XUID: ${profile.xuid}</div>
        <div id="bio-display" class="profile-bio" style="cursor:${isOwn ? "pointer" : "default"}" title="${isOwn ? "Click to edit bio" : ""}">${profile.bio || (isOwn ? '<span style="color:var(--text-light);font-style:italic;">Click to add a bio...</span>' : "No bio set.")}</div>
        ${
          isOwn
            ? `<div id="bio-edit" style="display:none;margin-bottom:10px;">
          <textarea id="bio-input" style="width:100%;border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;font-family:var(--font-body);font-size:0.88rem;color:var(--text);resize:vertical;min-height:70px;outline:none;transition:border-color var(--transition);" maxlength="200" placeholder="Write something about yourself...">${profile.bio || ""}</textarea>
          <div style="display:flex;gap:8px;margin-top:6px;align-items:center;">
            <button id="bio-save" class="btn btn-primary" style="min-width:unset;padding:8px 18px;font-size:0.85rem;">Save</button>
            <button id="bio-cancel" class="btn btn-ghost" style="padding:8px 14px;font-size:0.85rem;">Cancel</button>
            <span id="bio-chars" style="font-size:0.75rem;color:var(--text-light);margin-left:auto;">${(profile.bio || "").length}/200</span>
          </div>
        </div>`
            : ""
        }
        <div class="profile-meta">
          <div class="profile-stat">
            <div class="profile-stat-val">${profile.gamerscore}</div>
            <div class="profile-stat-label">Gamerscore</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-val">${profile.achievements.length}</div>
            <div class="profile-stat-label">Achievements</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-val">${(profile.friends || []).length}</div>
            <div class="profile-stat-label">Friends</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-val">${new Date(profile.createdAt).getFullYear()}</div>
            <div class="profile-stat-label">LCEN Join Year</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-title">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
        Achievements
      </div>
      ${
        profile.achievements.length === 0
          ? '<div class="empty-state"><p>No achievements unlocked yet.</p></div>'
          : `<div class="achievements-grid">${profile.achievements
              .map(
                (a) => `
          <div class="achievement-card">
            <div class="achievement-icon">${a.icon || "★"}</div>
            <div class="achievement-info">
              <div class="achievement-title">${a.title}</div>
              <div class="achievement-desc">${a.description || ""}</div>
              <div class="achievement-gs">${a.gamerscore}G</div>
            </div>
          </div>`,
              )
              .join("")}
        </div>`
      }
    </div>`;

  if (!isOwn) {
    attachFriendButton(container, profile.xuid);
    return;
  }

  const bioDisplay = document.getElementById("bio-display");
  const bioEdit = document.getElementById("bio-edit");
  const bioInput = document.getElementById("bio-input");
  const bioSave = document.getElementById("bio-save");
  const bioCancel = document.getElementById("bio-cancel");
  const bioChars = document.getElementById("bio-chars");

  bioDisplay.addEventListener("click", () => {
    bioDisplay.style.display = "none";
    bioEdit.style.display = "block";
    bioInput.focus();
    bioInput.setSelectionRange(bioInput.value.length, bioInput.value.length);
  });

  bioInput.addEventListener("input", () => {
    bioChars.textContent = `${bioInput.value.length}/200`;
  });

  bioInput.addEventListener("focus", () => {
    bioInput.style.borderColor = "var(--blue)";
    bioInput.style.boxShadow = "0 0 0 3px rgba(0,112,209,0.12)";
  });

  bioInput.addEventListener("blur", () => {
    bioInput.style.borderColor = "var(--border)";
    bioInput.style.boxShadow = "none";
  });

  bioCancel.addEventListener("click", () => {
    bioEdit.style.display = "none";
    bioDisplay.style.display = "";
    bioInput.value = profile.bio || "";
    bioChars.textContent = `${(profile.bio || "").length}/200`;
  });

  bioSave.addEventListener("click", async () => {
    const newBio = bioInput.value.trim();
    bioSave.disabled = true;
    bioSave.textContent = "Saving...";
    try {
      const updated = await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify({ bio: newBio }),
      });
      profile.bio = updated.bio;
      setProfile(updated);
      bioDisplay.innerHTML =
        updated.bio ||
        '<span style="color:var(--text-light);font-style:italic;">Click to add a bio...</span>';
      bioEdit.style.display = "none";
      bioDisplay.style.display = "";
      showToast("Bio updated");
    } catch (err) {
      showToast(err.message);
    }
    bioSave.disabled = false;
    bioSave.textContent = "Save";
  });

  const avatarUpload = document.getElementById("avatar-upload");
  if (avatarUpload) {
    avatarUpload.addEventListener("change", async () => {
      const file = avatarUpload.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("avatar", file);
      const token = getToken();
      try {
        const res = await fetch(`${API}/me/avatar`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        document.getElementById("profile-avatar-img").src = data.avatar;
        const cached = getProfile();
        if (cached) {
          cached.avatar = data.avatar;
          setProfile(cached);
        }
        showToast("Avatar updated");
      } catch (err) {
        showToast(err.message);
      }
      avatarUpload.value = "";
    });
  }
}

async function initProfile() {
  buildNav();
  const container = document.getElementById("profile-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const xuid = params.get("xuid");

  let profile = null;
  let isOwn = false;
  let friendData = null;

  try {
    if (query) {
      profile = await apiFetch(`/profile/${encodeURIComponent(query)}`);
      const me = getProfile();
      isOwn =
        !!getToken() &&
        !!me &&
        me.gamertag.toLowerCase() === profile.gamertag.toLowerCase();
    } else if (xuid) {
      profile = await apiFetch(`/profile/xuid/${encodeURIComponent(xuid)}`);
      const me = getProfile();
      isOwn = !!getToken() && !!me && me.xuid === profile.xuid;
    } else {
      if (!getToken()) {
        window.location.href = "/login/";
        return;
      }
      profile = await apiFetch("/me");
      setProfile(profile);
      buildNav();
      isOwn = true;
    }
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
    return;
  }

  if (!isOwn && getToken()) {
    try {
      friendData = await apiFetch("/friends/requests");
      const friendsList = await apiFetch("/friends");
      friendData.friends = friendsList.map((f) => f.xuid);
    } catch {
    }
  }

  renderProfile(profile, isOwn, friendData);
}

window.LCEN = {
  initHome,
  initLogin,
  initRegister,
  initProfile,
  showToast,
  buildNav,
  API,
  apiFetch,
  getToken,
  getProfile,
};
const BOARDS = [
  {
    name: "Travelling",
    columns: [
      { label: "Walked",   icon: "/assets/images/leaderboard/155_LeaderBoard_Icon_Walked.png",  dist: true },
      { label: "Fallen",   icon: "/assets/images/leaderboard/150_LeaderBoard_Icon_Fallen.png",  dist: true },
      { label: "Minecart", icon: "/assets/images/leaderboard/minecart.png",                     dist: true },
      { label: "Boat",     icon: "/assets/images/leaderboard/boat.png",                         dist: true },
    ],
  },
  {
    name: "Mining",
    columns: [
      { label: "Dirt",        icon: "/assets/images/leaderboard/dirt.png",        dist: false },
      { label: "Cobblestone", icon: "/assets/images/leaderboard/cobblestone.png", dist: false },
      { label: "Sand",        icon: "/assets/images/leaderboard/sand.png",        dist: false },
      { label: "Stone",       icon: "/assets/images/leaderboard/stone.png",       dist: false },
      { label: "Gravel",      icon: "/assets/images/leaderboard/gravel.png",      dist: false },
      { label: "Clay",        icon: "/assets/images/leaderboard/clay.png",        dist: false },
      { label: "Obsidian",    icon: "/assets/images/leaderboard/obsidian.png",    dist: false },
    ],
  },
  {
    name: "Farming",
    columns: [
      { label: "Eggs",      icon: "/assets/images/leaderboard/egg.png",       dist: false },
      { label: "Wheat",     icon: "/assets/images/leaderboard/wheat.png",     dist: false },
      { label: "Mushroom",  icon: "/assets/images/leaderboard/mushroom.png",  dist: false },
      { label: "Sugarcane", icon: "/assets/images/leaderboard/sugarcane.png", dist: false },
      { label: "Milk",      icon: "/assets/images/leaderboard/milk.png",      dist: false },
      { label: "Pumpkin",   icon: "/assets/images/leaderboard/pumpkin.png",   dist: false },
    ],
  },
  {
    name: "Kills",
    columns: [
      { label: "Zombie",      icon: "/assets/images/leaderboard/154_LeaderBoard_Icon_Zombie.png",       dist: false },
      { label: "Skeleton",    icon: "/assets/images/leaderboard/160_LeaderBoard_Icon_Skeleton.png",     dist: false },
      { label: "Creeper",     icon: "/assets/images/leaderboard/151_LeaderBoard_Icon_Creeper.png",      dist: false },
      { label: "Spider",      icon: "/assets/images/leaderboard/158_LeaderBoard_Icon_Spider.png",       dist: false },
      { label: "Spider Jock", icon: "/assets/images/leaderboard/157_LeaderBoard_Icon_SpiderJockey.png", dist: false },
      { label: "Pigman",      icon: "/assets/images/leaderboard/153_LeaderBoard_Icon_ZombiePigman.png", dist: false },
      { label: "Slime",       icon: "/assets/images/leaderboard/159_LeaderBoard_Icon_Slime.png",        dist: false },
    ],
  },
];

const DIFF_NAMES = ["Peaceful", "Easy", "Normal", "Hard"];

let lbState = {
  type:    0,
  diff:    2,
  filter:  "top",
  loading: false,
};

function lbTok()  { return localStorage.getItem("lcen_token"); }
function lbProf() { try { return JSON.parse(localStorage.getItem("lcen_profile")); } catch { return null; } }
function lbAvUrl(xuid) { return `${API}/avatar/${xuid}`; }

function lbToast(msg) {
  const t = document.getElementById("lcenToast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

async function lbApi(path) {
  const headers = { "Content-Type": "application/json" };
  if (lbTok()) headers["Authorization"] = `Bearer ${lbTok()}`;
  const res = await fetch(`${API}${path}`, { headers });
  return res.json();
}

function fmtDist(v) {
  if (v === undefined || v === null) return "–";
  const n = parseInt(v, 10);
  if (isNaN(n)) return "–";
  if (n === 0) return "0m";
  const digits = Math.floor(Math.log10(n)) + 1;
  if (digits < 4) return `${n}m`;
  if (digits < 8) return `${(n / 1000).toFixed(1)}km`;
  return `${Math.round(n / 1000)}km`;
}

function fmtCount(v) {
  if (v === undefined || v === null) return "–";
  const n = parseInt(v, 10);
  if (isNaN(n)) return "–";
  if (n > 99999) return "99999";
  return n.toLocaleString();
}

function clampDiff(type, diff) {
  if (type === 3 && diff === 0) return 1;
  return diff;
}

function updateDiffButtons() {
  document.querySelectorAll('#diffGroup .seg-btn').forEach(btn => {
    const d = parseInt(btn.dataset.diff);
    if (lbState.type === 3 && d === 0) {
      btn.disabled = true;
      btn.style.opacity = "0.35";
      btn.style.cursor = "not-allowed";
    } else {
      btn.disabled = false;
      btn.style.opacity = "";
      btn.style.cursor = "";
    }
  });
  if (lbState.type === 3 && lbState.diff === 0) {
    lbState.diff = 1;
    document.querySelectorAll('#diffGroup .seg-btn').forEach(btn => {
      btn.classList.toggle("active", parseInt(btn.dataset.diff) === lbState.diff);
    });
  }
}

async function lbFetchEntries() {
  const { type, filter } = lbState;
  const diff = clampDiff(type, lbState.diff);
  const me = lbProf();

  if (filter === "friends") {
    if (!lbTok() || !me) return lbFetchGlobal(type, diff);
    try {
      const friends = await lbApi("/friends");
      const xuids = [me.xuid, ...friends.map(f => f.xuid)].join(",");
      const data = await lbApi(`/leaderboard/friends?type=${type}&difficulty=${diff}&xuids=${encodeURIComponent(xuids)}`);
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }

  if (filter === "me") {
    if (!lbTok() || !me) return [];
    try {
      const rankData = await lbApi(`/leaderboard/rank?uid=${me.xuid}&type=${type}&difficulty=${diff}`);
      if (!rankData || rankData.rank < 0) return [];
      const offset = Math.max(0, rankData.rank - 6);
      const data = await lbApi(`/leaderboard?type=${type}&difficulty=${diff}&limit=11&offset=${offset}`);
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }

  return lbFetchGlobal(type, diff);
}

async function lbFetchGlobal(type, diff) {
  try {
    const data = await lbApi(`/leaderboard?type=${type}&difficulty=${diff}&limit=64&offset=0`);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

function lbRenderTable(entries) {
  const panel = document.getElementById("tablePanel");
  const board = BOARDS[lbState.type];
  const diff  = clampDiff(lbState.type, lbState.diff);
  const me    = lbProf();
  const myXuid = me?.xuid || null;
  const isDistBoard = board.columns[0]?.dist === true;

  if (!entries || entries.length === 0) {
    panel.innerHTML = `
      <div class="lb-header-panel">
        <div class="lb-title-group">
          <div class="lb-title">${board.name}</div>
          <div class="lb-subtitle">${DIFF_NAMES[diff]}</div>
        </div>
        <span class="lb-entries-badge">Entries: 0</span>
      </div>
      <div class="empty-state">No entries found for this leaderboard.</div>`;
    return;
  }

  const colHeaders = board.columns.map(col => `
    <th class="col-icon" title="${col.label}">
      <img class="col-icon-img" src="${col.icon}" alt="${col.label}">
    </th>
  `).join("");

  const rows = entries.map((entry, idx) => {
    const rank     = entry.rank ?? (idx + 1);
    const isPlayer = myXuid && entry.uid && entry.uid.toUpperCase() === myXuid.toUpperCase();
    const stats    = entry.stats || [];

    let rankCell;
    if (rank === 1)      rankCell = `<span class="rank-medal m1">1</span>`;
    else if (rank === 2) rankCell = `<span class="rank-medal m2">2</span>`;
    else if (rank === 3) rankCell = `<span class="rank-medal m3">3</span>`;
    else                 rankCell = `<span style="color:var(--muted);font-family:'Rajdhani',sans-serif;font-weight:700;">${rank}</span>`;

    const rowClass = [
      rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "",
      isPlayer ? "is-player" : ""
    ].filter(Boolean).join(" ");

    const statCells = board.columns.map((col, i) => {
      const val = stats[i] ?? 0;
      const fmt = col.dist ? fmtDist(val) : fmtCount(val);
      return `<td class="td-stat${col.dist ? " dist" : ""}">${fmt}</td>`;
    }).join("");

    const totalFmt = isDistBoard ? fmtDist(entry.totalScore) : fmtCount(entry.totalScore);

    return `
      <tr class="${rowClass}">
        <td class="td-rank td-rank-cell">${rankCell}</td>
        <td class="td-name-cell">
          <div class="td-name">
            <img class="td-name-avatar" src="${lbAvUrl(entry.uid)}" alt="" onerror="this.style.display='none'">
            <span class="td-name-tag${isPlayer ? " is-player" : ""}">${entry.gamertag || "Unknown"}</span>
            ${isPlayer ? `<span class="player-badge">You</span>` : ""}
          </div>
        </td>
        ${statCells}
        <td class="td-total td-total-cell${isDistBoard ? " dist" : ""}">${totalFmt}</td>
      </tr>`;
  }).join("");

  panel.innerHTML = `
    <div class="lb-header-panel">
      <div class="lb-title-group">
        <div class="lb-title">${board.name}</div>
        <div class="lb-subtitle">${DIFF_NAMES[diff]}</div>
      </div>
      <span class="lb-entries-badge">Entries: ${entries.length}</span>
    </div>
    <table class="lb-table">
      <thead>
        <tr>
          <th class="col-rank">Rank</th>
          <th class="col-name">Gamertag</th>
          ${colHeaders}
          <th class="col-total">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

async function lbLoad() {
  if (lbState.loading) return;
  lbState.loading = true;
  document.getElementById("tablePanel").innerHTML =
    `<div class="spinner-wrap"><div class="spinner"></div></div>`;
  try {
    const entries = await lbFetchEntries();
    lbRenderTable(entries);
  } catch {
    document.getElementById("tablePanel").innerHTML =
      `<div class="empty-state">Failed to load leaderboard. Please try again.</div>`;
  }
  lbState.loading = false;
}

function lbWireControls() {
  document.querySelectorAll('#typeGroup .seg-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      if (lbState.loading) return;
      lbState.type = parseInt(btn.dataset.type);
      document.querySelectorAll('#typeGroup .seg-btn').forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateDiffButtons();
      lbLoad();
    });
  });

  document.querySelectorAll('#diffGroup .seg-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      if (lbState.loading || btn.disabled) return;
      lbState.diff = parseInt(btn.dataset.diff);
      document.querySelectorAll('#diffGroup .seg-btn').forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      lbLoad();
    });
  });

  document.querySelectorAll('#filterGroup .seg-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      if (lbState.loading) return;
      const f = btn.dataset.filter;
      if ((f === "friends" || f === "me") && !lbTok()) {
        lbToast("Sign in to use this filter");
        return;
      }
      lbState.filter = f;
      document.querySelectorAll('#filterGroup .seg-btn').forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      lbLoad();
    });
  });
}

function lbBuildNavBar() {
  const me = lbProf();
  const nu = document.getElementById("navUser");
  if (!nu) return;
  if (!me) { nu.style.display = "none"; return; }
  nu.style.display = "";
  document.getElementById("navAvatarImg").src = lbAvUrl(me.xuid);
  document.getElementById("navGamertag").textContent = me.gamertag;
  document.getElementById("navGs").textContent = `${me.gamerscore || 0} G`;
  nu.onclick = () => { window.location.href = "/profile/"; };
}

function initLeaderboards() {
  lbBuildNavBar();
  lbWireControls();
  updateDiffButtons();
  lbLoad();

  (function setupPanorama() {
    const track = document.getElementById("panoramaTrack");
    const img1  = document.getElementById("panoImg1");
    if (!track || !img1) return;
    function onLoad() {
      const w = img1.naturalWidth;
      const h = img1.naturalHeight;
      const scale = (window.innerHeight * 1.04) / h;
      const displayW = w * scale;
      img1.style.width = `${displayW}px`;
      img1.style.minWidth = "unset";
      const img2 = document.getElementById("panoImg2");
      if (img2) { img2.style.width = `${displayW}px`; img2.style.minWidth = "unset"; }
      const dur = displayW / 40;
      const style = document.createElement("style");
      style.textContent = `@keyframes panBg { 0% { transform: translateX(0); } 100% { transform: translateX(-${displayW}px); } }`;
      document.head.appendChild(style);
      track.style.animation = "none";
      track.offsetHeight;
      track.style.animation = `panBg ${dur}s linear infinite`;
    }
    if (img1.complete) onLoad();
    else img1.addEventListener("load", onLoad);
  })();
}

window.LCEN = window.LCEN || {};
window.LCEN.initLeaderboards = initLeaderboards;