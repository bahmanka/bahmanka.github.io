// Set to the real CV PDF address when the file is published (for example "cv.pdf").
// While empty, the button only shows the "coming soon" notice.
const CV_URL = "";
const STORAGE_KEY = "bka-language";

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const switcher = $("#languageSwitch");
let language = "en";

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
 const d = document.body.dataset;
 const title = d["title" + (next === "fa" ? "Fa" : "En")], desc = d["desc" + (next === "fa" ? "Fa" : "En")];
 const locale = next === "fa" ? "fa_IR" : "en_US", alt = next === "fa" ? "en_US" : "fa_IR";
 document.title = title;
 setMeta('meta[name="description"]', "content", desc);
 setMeta('meta[property="og:title"]', "content", title);
 setMeta('meta[property="og:description"]', "content", desc);
 setMeta('meta[property="og:locale"]', "content", locale);
 setMeta('meta[property="og:locale:alternate"]', "content", alt);
 setMeta('meta[name="twitter:title"]', "content", title);
 setMeta('meta[name="twitter:description"]', "content", desc);
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
 applyMeta(next);
 if (persist) storeLanguage(next);
}
switcher.addEventListener("click", () => setLanguage(language === "en" ? "fa" : "en"));
setLanguage(readStoredLanguage() || "en", false);

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
 $$(".section-label,.about-content,.direction,.page-head,.exhibition-entry,.research-card,.empty-note").forEach(el => { el.classList.add("reveal"); observer.observe(el); });
}
