const API = "https://network-server-7kuc.onrender.com";

const SLIDES = [
  {
    title: "OpenLCE",
    badge: "Recommend Console Version",
    desc: "The in progress stabilizing build of Minecraft: Legacy Console Edition. Fully connected to LCEN Authentication and secure.",
    bg: "linear-gradient(135deg, #0a1628 0%, #0d2d6b 100%)",
    accent: "#0070d1",
    label: "Game",
    image: "/assets/images/ps3.png",
    buttons: [
      { text: "Download", type: "primary", href: "/download/" },
      {
        text: "Learn More",
        type: "secondary",
        href: "/about/openlce/",
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
  {
    title: "ByteBukkit",
    badge: "Hosting Platform",
    desc: "Host FourKit Plugins, download DLC directly online, and view active servers instantly in your browser!",
    bg: "linear-gradient(135deg, #574bff 0%, #0077ff 100%)",
    accent: "#ffffff",
    label: "Host",
    image: "/assets/images/panorama.png",
    buttons: [
      { text: "Open Platform", type: "primary", href: "/bytebukkit/" },
      { text: "API Docs", type: "secondary", href: "/docs/bytebukkit" },
    ],
  },
];

const NEWS = [
  {
    tag: "Launch",
    title: "LCE Network Development Started",
    date: "May 25, 2026",
    featured: true,
    image: "/assets/images/network.png",
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

function buildNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const profile = getProfile();
  const actionsEl = nav.querySelector(".nav-actions");
  if (!actionsEl) return;
  actionsEl.innerHTML = "";

  const search = document.createElement("div");
  search.className = "nav-search";
  search.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search players..." id="nav-search-input">`;
  actionsEl.appendChild(search);

  search.querySelector("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (q) window.location.href = `/profile/?q=${encodeURIComponent(q)}`;
    }
  });

  if (profile) {
    const a = document.createElement("a");
    a.href = "/dashboard/";
    a.className = "btn btn-ghost";
    a.textContent = profile.gamertag;
    actionsEl.appendChild(a);
    const out = document.createElement("button");
    out.className = "btn btn-secondary";
    out.style.cssText =
      "background:var(--surface2);color:var(--text);border:1.5px solid var(--border);min-width:unset;padding:10px 18px;";
    out.textContent = "Sign Out";
    out.onclick = () => {
      clearToken();
      location.reload();
    };
    actionsEl.appendChild(out);
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
        <h1 class="hero-title">${s.title}</h1>
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
    card.className = "news-card" + (i === 0 ? " featured" : "");
    card.innerHTML = `
      <div class="news-img" style="height:${i === 0 ? "180px" : "110px"}">
        ${n.image ? `<img src="${n.image}" alt="${n.title}" class="news-image">` : ""}
      </div>
      <div class="news-body">
        <div class="news-tag">${n.tag}</div>
        <div class="news-title">${n.title}</div>
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
