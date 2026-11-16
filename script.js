const exhibitionData = {
 solo: {
  Tehran: [{title:"Jhaleh Gallery",year:"2024"},{title:"Hoor Gallery",year:"2011"}],
  Ardabil: [{title:"Fadak Gallery",year:"2016"},{title:"Fadak Gallery",year:"2006"}]
 },
 group: {
  Tehran: [{title:"Modern Artists — Avae Honar Gallery",year:"2021"},{title:"To Save Children — Goharan Gallery",year:"2017"},{title:"Booklet Exhibition — Tarahane Azad Gallery",year:"2011"}],
  Kish: [{title:"Night — Mika Gallery",year:"2021"}],
  Milan: [{title:"Secret Art Show",year:"2019"}],
  "Hormuz Island": [{title:"Art Expo Hormuz",year:"2019"}],
  Other: [{title:"Fajr Festival",year:"2010–2011"},{title:"Damonfar Festival",year:"2007–2010"},{title:"Young Art Festival — Selected Design",year:"2008"},{title:"Dr. Sondozi Design Festival",year:"2007"}]
 }
};
let language = "en";
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const switcher = $("#languageSwitch");
function setLanguage(next) {
 language = next;
 document.documentElement.lang = next;
 document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
 document.body.dir = document.documentElement.dir;
 $$("[data-en][data-fa]").forEach(el => {
   const value = el.dataset[next];
   if (value !== undefined) el.innerHTML = value;
 });
 switcher.innerHTML = next.toUpperCase() + ' <span>⌄</span>';
 switcher.setAttribute("aria-label", next === "en" ? "Change language to Persian" : "تغییر زبان به انگلیسی");
}
switcher.addEventListener("click", () => setLanguage(language === "en" ? "fa" : "en"));
$("#year").textContent = new Date().getFullYear();

const modal = $("#exhibitionModal");
const modalTitle = $("#modalTitle");
const modalKicker = $("#modalKicker");
const modalEntries = $("#modalEntries");
function openExhibitions(kind, city) {
 const entries = exhibitionData[kind][city] || [];
 modalTitle.textContent = city;
 modalKicker.textContent = kind === "solo" ? (language === "en" ? "SOLO EXHIBITIONS" : "نمایشگاه‌های انفرادی") : (language === "en" ? "GROUP EXHIBITIONS" : "نمایشگاه‌های گروهی");
 modalEntries.innerHTML = entries.map(item => '<article class="modal-entry"><h3>' + item.title + '</h3><p>' + item.year + '</p></article>').join("");
 modal.classList.add("open");
 modal.setAttribute("aria-hidden","false");
 $("#modalClose").focus();
}
$$(".city-button").forEach(button => button.addEventListener("click", () => openExhibitions(button.dataset.kind,button.dataset.city)));
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
$("#modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",event=>{if(event.target===modal)closeModal()});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeModal()});

const toast = $("#toast");
let toastTimeout;
$("#cvButton").addEventListener("click",()=>{
 toast.textContent = language === "en" ? "The CV PDF will be added here soon." : "فایل PDF رزومه در آینده در این بخش قرار می‌گیرد.";
 toast.classList.add("show");
 clearTimeout(toastTimeout);
 toastTimeout = setTimeout(()=>toast.classList.remove("show"),3000);
});

// Subtle entrance reveal, with reduced-motion support.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
 const observer = new IntersectionObserver(items => items.forEach(item => {
  if(item.isIntersecting){item.target.classList.add("is-visible");observer.unobserve(item.target)}
 }),{threshold:.12});
 $$(".section-label,.about-content,.education-item,.section-heading-row,.exhibition-group,.research-card,.project-row,.portfolio-cta").forEach(el=>{el.classList.add("reveal");observer.observe(el)});
}