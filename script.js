// Exhibition data. `titleFa` / `yearFa` are optional Persian renderings; when a
// Jalali year (`yearFa`) is not supplied, the Gregorian year is shown in Persian digits.
const exhibitionData = {
 solo: {
  Tehran: [{title:"Jhaleh Gallery",titleFa:"گالری Jhaleh",year:"2024"},{title:"Hoor Gallery",titleFa:"گالری حور",year:"2011"}],
  Ardabil: [{title:"Fadak Gallery",titleFa:"گالری فدک",year:"2016"},{title:"Fadak Gallery",titleFa:"گالری فدک",year:"2006"}]
 },
 group: {
  Tehran: [{title:"Modern Artists — Avae Honar Gallery",titleFa:"هنرمندان مدرن — گالری آوای هنر",year:"2021"},{title:"To Save Children — Goharan Gallery",titleFa:"برای نجات کودکان — گالری گوهران",year:"2017"},{title:"Booklet Exhibition — Tarahane Azad Gallery",titleFa:"نمایشگاه بوکلت — گالری طراحان آزاد",year:"2011"}],
  Kish: [{title:"Night — Mika Gallery",titleFa:"شب — گالری میکا",year:"2021"}],
  Milan: [{title:"Secret Art Show",titleFa:"نمایش هنر مخفی",year:"2019"}],
  "Hormuz Island": [{title:"Art Expo Hormuz",titleFa:"اکسپوی هنر هرمز",year:"2019"}],
  Other: [{title:"Fajr Festival",titleFa:"جشنواره فجر",year:"2010–2011"},{title:"Damonfar Festival",titleFa:"جشنواره Damonfar",year:"2007–2010"},{title:"Young Art Festival — Selected Design",titleFa:"جشنواره هنر جوان — طرح منتخب",year:"2008"},{title:"Dr. Sondozi Design Festival",titleFa:"جشنواره طراحی دکتر Sondozi",year:"2007"}]
 }
};
const cityLabels = {
 Tehran: {en:"Tehran", fa:"تهران"},
 Ardabil: {en:"Ardabil", fa:"اردبیل"},
 Kish: {en:"Kish", fa:"کیش"},
 Milan: {en:"Milan", fa:"میلان"},
 "Hormuz Island": {en:"Hormuz Island", fa:"جزیره هرمز"},
 Other: {en:"Other / Various", fa:"سایر موارد"}
};
const kindLabels = {
 solo: {en:"SOLO EXHIBITIONS", fa:"نمایشگاه‌های انفرادی"},
 group: {en:"GROUP EXHIBITIONS", fa:"نمایشگاه‌های گروهی"}
};
const pageMeta = {
 en: {
  title: "B. K. A. — Artist & Art Researcher",
  description: "B. K. A. — Artist and Art Researcher. Painting, art research and independent creative projects.",
  locale: "en_US", alternate: "fa_IR"
 },
 fa: {
  title: "B. K. A. — هنرمند و پژوهشگر هنر",
  description: "B. K. A. — هنرمند و پژوهشگر هنر. نقاشی، پژوهش هنر و پروژه‌های خلاق مستقل.",
  locale: "fa_IR", alternate: "en_US"
 }
};
// Set to the real CV PDF address when the file is published (for example "cv.pdf").
// While empty, the button only shows the "coming soon" notice.
const CV_URL = "";
const STORAGE_KEY = "bka-language";

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const switcher = $("#languageSwitch");
const modal = $("#exhibitionModal");
const modalTitle = $("#modalTitle");
const modalKicker = $("#modalKicker");
const modalEntries = $("#modalEntries");
const modalClose = $("#modalClose");
let language = "en";
let activeKind = null;
let activeCity = null;
let lastFocused = null;

const toFa = value => String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
const pad2 = number => String(number).padStart(2, "0");

function readStoredLanguage() {
 try {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "fa" || value === "en" ? value : null;
 } catch (error) { return null; }
}
function storeLanguage(value) {
 try { localStorage.setItem(STORAGE_KEY, value); } catch (error) { /* storage unavailable */ }
}
function yearLabel(next) {
 const now = new Date();
 if (next !== "fa") return String(now.getFullYear());
 try { return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {year: "numeric"}).format(now); }
 catch (error) { return toFa(now.getFullYear()); }
}
function setMeta(selector, attribute, value) {
 const el = $(selector);
 if (el) el.setAttribute(attribute, value);
}
function applyMeta(next) {
 const meta = pageMeta[next];
 document.title = meta.title;
 setMeta('meta[name="description"]', "content", meta.description);
 setMeta('meta[property="og:title"]', "content", meta.title);
 setMeta('meta[property="og:description"]', "content", meta.description);
 setMeta('meta[property="og:locale"]', "content", meta.locale);
 setMeta('meta[property="og:locale:alternate"]', "content", meta.alternate);
 setMeta('meta[name="twitter:title"]', "content", meta.title);
 setMeta('meta[name="twitter:description"]', "content", meta.description);
}
function renderCityButtons(next) {
 $$(".city-button").forEach(button => {
  const city = button.dataset.city;
  const count = (exhibitionData[button.dataset.kind][city] || []).length;
  $(".city-label", button).textContent = cityLabels[city][next];
  $(".city-count", button).textContent = next === "fa"
   ? toFa(pad2(count)) + " " + (city === "Other" ? "مورد" : "نمایشگاه")
   : pad2(count) + " " + (city === "Other" ? "entries" : (count === 1 ? "exhibition" : "exhibitions"));
 });
}
function renderModal() {
 const entries = (exhibitionData[activeKind] || {})[activeCity] || [];
 modalTitle.textContent = cityLabels[activeCity][language];
 modalKicker.textContent = kindLabels[activeKind][language];
 modalEntries.replaceChildren(...entries.map(item => {
  const article = document.createElement("article");
  article.className = "modal-entry";
  const title = document.createElement("h3");
  const year = document.createElement("p");
  if (language === "fa") {
   title.textContent = item.titleFa || item.title;
   year.textContent = item.yearFa || toFa(item.year);
  } else {
   title.textContent = item.title;
   year.textContent = item.year;
  }
  article.append(title, year);
  return article;
 }));
}
function setLanguage(next, persist = true) {
 language = next;
 const root = document.documentElement;
 root.lang = next;
 root.dir = next === "fa" ? "rtl" : "ltr";
 document.body.dir = root.dir;
 $$("[data-en][data-fa]").forEach(el => {
  const value = el.dataset[next];
  if (value !== undefined) el.innerHTML = value;
 });
 $$("[data-aria-en][data-aria-fa]").forEach(el => el.setAttribute("aria-label", next === "fa" ? el.dataset.ariaFa : el.dataset.ariaEn));
 $$("[data-num]").forEach(el => {
  if (el.dataset.src === undefined) el.dataset.src = el.textContent;
  el.textContent = next === "fa" ? toFa(el.dataset.src) : el.dataset.src;
 });
 // The button names the language it switches to, in that language.
 const label = $(".lang-name", switcher);
 label.textContent = next === "en" ? "فارسی" : "English";
 label.lang = next === "en" ? "fa" : "en";
 $("#year").textContent = yearLabel(next);
 renderCityButtons(next);
 if (activeKind) renderModal();
 applyMeta(next);
 if (persist) storeLanguage(next);
}
switcher.addEventListener("click", () => setLanguage(language === "en" ? "fa" : "en"));
setLanguage(readStoredLanguage() || "en", false);

// Exhibition dialog: focus is moved in, kept inside, and returned on close.
const inertTargets = () => $$(".skip-link, .site-header, main, .site-footer");
function openExhibitions(kind, city, trigger) {
 activeKind = kind;
 activeCity = city;
 lastFocused = trigger || document.activeElement;
 renderModal();
 modal.classList.add("open");
 modal.setAttribute("aria-hidden", "false");
 document.body.classList.add("modal-open");
 inertTargets().forEach(el => el.setAttribute("inert", ""));
 modalClose.focus();
}
function closeModal() {
 if (!modal.classList.contains("open")) return;
 modal.classList.remove("open");
 modal.setAttribute("aria-hidden", "true");
 document.body.classList.remove("modal-open");
 inertTargets().forEach(el => el.removeAttribute("inert"));
 activeKind = null;
 activeCity = null;
 if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
 lastFocused = null;
}
$$(".city-button").forEach(button => button.addEventListener("click", () => openExhibitions(button.dataset.kind, button.dataset.city, button)));
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => {
 if (!modal.classList.contains("open")) return;
 if (event.key === "Escape") { closeModal(); return; }
 if (event.key !== "Tab") return;
 const focusable = $$("button, [href], [tabindex]:not([tabindex='-1'])", modal).filter(el => !el.disabled);
 if (!focusable.length) return;
 const first = focusable[0];
 const last = focusable[focusable.length - 1];
 if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
 else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

const toast = $("#toast");
const cvButton = $("#cvButton");
let toastTimeout;
if (!CV_URL) cvButton.setAttribute("aria-disabled", "true");
cvButton.addEventListener("click", () => {
 if (CV_URL) {
  const link = document.createElement("a");
  link.href = CV_URL;
  link.download = "";
  link.target = "_blank";
  link.rel = "noopener";
  link.click();
  return;
 }
 toast.textContent = language === "en" ? "The CV PDF will be added here soon." : "فایل PDF رزومه در آینده در این بخش قرار می‌گیرد.";
 toast.classList.add("show");
 clearTimeout(toastTimeout);
 toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000);
});

// Subtle entrance reveal (styles in styles.css), with reduced-motion support.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
 const observer = new IntersectionObserver(items => items.forEach(item => {
  if (item.isIntersecting) { item.target.classList.add("is-visible"); observer.unobserve(item.target); }
 }), {threshold: .12});
 $$(".section-label,.about-content,.education-item,.section-heading-row,.exhibition-group,.research-card,.project-row,.portfolio-cta").forEach(el => { el.classList.add("reveal"); observer.observe(el); });
}
