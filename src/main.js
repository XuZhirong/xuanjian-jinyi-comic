const pagesEl = document.querySelector("#pages");
const thumbsEl = document.querySelector("#thumbs");
const viewer = document.querySelector("#viewer");
const viewerImg = viewer.querySelector("img");
const closeViewer = viewer.querySelector(".viewer__close");

const response = await fetch("/data/comic.json");
const comic = await response.json();

const pageNodes = [];

for (const page of comic.pages) {
  const imageSrc = `/${page.image}`;
  const thumbSrc = `/${page.thumb ?? page.image}`;

  const article = document.createElement("article");
  article.className = "page";
  article.id = `page-${String(page.n).padStart(2, "0")}`;

  const button = document.createElement("button");
  button.className = "page__frame";
  button.type = "button";
  button.setAttribute("aria-label", `查看第 ${page.n} 页：${page.title}`);

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = `${page.n}. ${page.title}`;
  img.loading = page.n <= 2 ? "eager" : "lazy";
  img.decoding = "async";

  button.append(img);
  button.addEventListener("click", () => {
    viewerImg.src = img.src;
    viewerImg.alt = img.alt;
    viewer.showModal();
  });

  const meta = document.createElement("div");
  meta.className = "page__meta";
  meta.innerHTML = `<span>${String(page.n).padStart(2, "0")}</span><span>${page.title}</span>`;

  article.append(button, meta);
  pagesEl.append(article);
  pageNodes.push(article);

  const thumb = document.createElement("button");
  thumb.className = "thumb";
  thumb.type = "button";
  thumb.setAttribute("aria-label", `跳转到第 ${page.n} 页`);
  thumb.innerHTML = `<img src="${thumbSrc}" alt="" loading="eager" decoding="async" />`;
  thumb.addEventListener("click", () => article.scrollIntoView({ behavior: "smooth", block: "start" }));
  thumbsEl.append(thumb);
}

const thumbButtons = [...thumbsEl.querySelectorAll(".thumb")];
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = pageNodes.indexOf(visible.target);
    thumbButtons.forEach((button, i) => button.classList.toggle("is-active", i === index));
  },
  { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.35, 0.55] },
);

pageNodes.forEach((node) => observer.observe(node));

closeViewer.addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
