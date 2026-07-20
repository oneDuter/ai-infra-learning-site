import { getDocument, GlobalWorkerOptions } from "./vendor/pdfjs/pdf.min.mjs";

GlobalWorkerOptions.workerSrc = new URL("./vendor/pdfjs/pdf.worker.min.mjs", import.meta.url).href;

const readingWeeks = [
  [1, "AI 系统全栈", "第 1 章 · 原 PDF 12–46 页"],
  [2, "计算模式与性能", "第 2 章 · 原 PDF 47–81 页"],
  [3, "CPU、GPU 与 AI 芯片", "第 3 章 · 原 PDF 82–139 页"],
  [4, "GPU、互联与通信", "第 4 章 · 原 PDF 140–211 页"],
  [5, "TPU、NPU 与异构计算", "第 5–7 章 · 原 PDF 212–318 页"],
  [6, "传统编译器与 IR", "第 8–9 章 · 原 PDF 320–396 页"],
  [7, "图优化与后端优化", "第 10–11 章 · 原 PDF 397–462 页"],
  [8, "CUDA、CANN 与 Ascend C", "第 12–13 章 · 原 PDF 463–517 页"],
  [9, "推理系统与大模型推理", "第 14 章 · 原 PDF 520–569 页"],
  [10, "压缩、量化与转换", "第 15–17 章 · 原 PDF 570–655 页"],
  [11, "图优化与 Kernel 优化", "第 18–19 章 · 原 PDF 656–727 页"],
  [12, "框架与自动微分", "第 20–21 章 · 原 PDF 728–796 页"],
  [13, "计算图", "第 22 章 · 原 PDF 797–829 页"],
  [14, "分布式并行", "第 23 章 · 原 PDF 830–873 页"],
  [15, "大模型专项补全", "全书目录索引 · 3 页"],
  [16, "综合项目", "全书目录索引 · 3 页"],
];

const forkBase = "https://github.com/oneDuter/AIInfra";
const weeklyInfra = [
  [["训练系统全栈", "00Summary/04TrainingStack.md"], ["推理系统全栈", "00Summary/05InferStack.md"], ["AI Infra 未来趋势", "00Summary/06Future.md"]],
  [["集群性能专题", "01AICluster/04Performance"]],
  [["AI 集群路线图", "01AICluster/01Roadmap"], ["芯片与节点基础", "01AICluster/02L0L1Base"]],
  [["存储与通信路线图", "02StorComm/01Roadmap"], ["集合通信", "02StorComm/03CollectComm"], ["通信库", "02StorComm/04CommLibrary"]],
  [["超节点与 SuperPod", "01AICluster/03SuperPod"]],
  [["训练加速入口", "04Train/03TrainAcceler"]],
  [["训练加速专题", "04Train/03TrainAcceler"]],
  [["训练加速与算子", "04Train/03TrainAcceler"]],
  [["推理基础", "05Infer/01Foundation"], ["推理加速", "05Infer/02InferSpeedUp"], ["调度加速", "05Infer/03SchedSpeedUp"]],
  [["压缩与蒸馏", "05Infer/06CompDistill"]],
  [["推理加速", "05Infer/02InferSpeedUp"], ["训练加速", "04Train/03TrainAcceler"]],
  [["算法与模型基础", "06AlgoData/01Basic"]],
  [["Mini Transformer 与基础", "06AlgoData/01Basic"]],
  [["并行训练入门", "04Train/01ParallelBegin"], ["高级并行训练", "04Train/02ParallelAdv"]],
  [["AI 集群存储", "02StorComm/05StorforAI"], ["容器与云平台", "03DockCloud"], ["训练加速", "04Train/03TrainAcceler"], ["MoE", "06AlgoData/02MoE"]],
  [["AIInfra 总览", "00Summary"], ["训练系统", "04Train"], ["推理系统", "05Infer"]],
];

const commentStorageKey = "ai-infra-reader-comments-v1";
const params = new URLSearchParams(window.location.search);
const requestedWeek = Number(params.get("week"));
const activeWeek = Number.isInteger(requestedWeek) && requestedWeek >= 1 && requestedWeek <= 16 ? requestedWeek : 1;
const $ = (selector) => document.querySelector(selector);

let pdfDocument = null;
let renderTask = null;
let renderSequence = 0;
let currentPage = 1;
let zoom = 1;
let resizeTimer = null;
let commentsStorageAvailable = true;
let comments = loadComments();

function readerUrl(week) { return `./reader.html?week=${week}`; }
function pdfUrl(week) { return `./books/week-${String(week).padStart(2, "0")}.pdf`; }
function assetUrl(path) { return new URL(path, import.meta.url).href; }
function infraUrl(path) {
  const route = path.endsWith(".md") ? "blob" : "tree";
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${forkBase}/${route}/main/${encodedPath}`;
}

function setupInfraLinks() {
  const links = weeklyInfra[activeWeek - 1] || [];
  const container = $("#infraLinks");
  $("#infraCount").textContent = `${links.length} 项`;
  container.replaceChildren();

  links.forEach(([label, path], index) => {
    const anchor = document.createElement("a");
    anchor.className = "reader-infra-link";
    anchor.href = infraUrl(path);
    anchor.target = "_blank";
    anchor.rel = "noreferrer";

    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = label;
    const location = document.createElement("small");
    location.textContent = path;
    copy.append(title, location);
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    anchor.append(number, copy, arrow);
    container.append(anchor);
  });
}

function setupReaderHeader() {
  const [, title, meta] = readingWeeks[activeWeek - 1];
  document.title = `W${String(activeWeek).padStart(2, "0")} · ${title} · AI Infra Learning`;
  $("#readerWeek").textContent = `WEEK ${String(activeWeek).padStart(2, "0")} · PDF.JS READER`;
  $("#readerTitle").textContent = title;
  $("#readerMeta").textContent = `《AI 系统：原理与架构》 · ${meta}`;

  $("#weekSelect").innerHTML = readingWeeks.map(([week, weekTitle]) => `<option value="${week}">W${String(week).padStart(2, "0")} · ${weekTitle}</option>`).join("");
  $("#weekSelect").value = String(activeWeek);
  $("#openPdf").href = pdfUrl(activeWeek);

  const previous = $("#previousWeek");
  const next = $("#nextWeek");
  previous.href = readerUrl(Math.max(1, activeWeek - 1));
  next.href = readerUrl(Math.min(16, activeWeek + 1));
  previous.setAttribute("aria-disabled", String(activeWeek === 1));
  next.setAttribute("aria-disabled", String(activeWeek === 16));
}

async function loadPdf() {
  setPdfStatus("正在读取本周 PDF…", true);
  try {
    const loadingTask = getDocument({
      url: pdfUrl(activeWeek),
      cMapUrl: assetUrl("./vendor/pdfjs/cmaps/"),
      cMapPacked: true,
      standardFontDataUrl: assetUrl("./vendor/pdfjs/standard_fonts/"),
      wasmUrl: assetUrl("./vendor/pdfjs/wasm/"),
      iccUrl: assetUrl("./vendor/pdfjs/iccs/"),
    });
    loadingTask.onProgress = ({ loaded, total }) => {
      if (total) setPdfStatus(`正在解析 ${Math.round((loaded / total) * 100)}%…`, true);
    };
    pdfDocument = await loadingTask.promise;
    $("#pageInput").max = String(pdfDocument.numPages);
    $("#pageTotal").textContent = `/ ${pdfDocument.numPages}`;
    await renderPage(1);
  } catch (error) {
    console.error(error);
    $("#pdfLoading").classList.add("is-error");
    $("#pdfLoading").innerHTML = "<p>PDF 解析失败。请刷新页面，或使用下方“单独打开本周 PDF”。</p>";
    setPdfStatus("解析失败", false);
  }
}

async function renderPage(pageNumber) {
  if (!pdfDocument) return;
  const targetPage = Math.min(pdfDocument.numPages, Math.max(1, Number(pageNumber) || 1));
  const sequence = ++renderSequence;
  currentPage = targetPage;
  let activeRenderTask = null;
  syncPageControls();
  setPdfStatus(`正在渲染第 ${currentPage} 页…`, true);

  if (renderTask) {
    renderTask.cancel();
    renderTask = null;
  }

  try {
    const page = await pdfDocument.getPage(currentPage);
    if (sequence !== renderSequence) return;

    const stage = $("#pdfStage");
    const canvas = $("#pdfCanvas");
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(280, stage.clientWidth - (window.innerWidth <= 680 ? 24 : 56));
    const fittedScale = availableWidth / baseViewport.width;
    const viewport = page.getViewport({ scale: fittedScale * zoom });
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const context = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    canvas.setAttribute("aria-label", `本周 PDF 第 ${currentPage} 页，共 ${pdfDocument.numPages} 页`);

    activeRenderTask = page.render({
      canvasContext: context,
      viewport,
      transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
      background: "white",
    });
    renderTask = activeRenderTask;
    await activeRenderTask.promise;
    if (sequence !== renderSequence) return;
    $("#pdfLoading").hidden = true;
    setPdfStatus(`第 ${currentPage} / ${pdfDocument.numPages} 页 · ${Math.round(zoom * 100)}%`, false);
  } catch (error) {
    if (error?.name !== "RenderingCancelledException") {
      console.error(error);
      setPdfStatus("页面渲染失败", false);
    }
  } finally {
    if (renderTask === activeRenderTask) renderTask = null;
  }
}

function syncPageControls() {
  $("#pageInput").value = String(currentPage);
  $("#previousPage").disabled = currentPage <= 1;
  $("#nextPage").disabled = !pdfDocument || currentPage >= pdfDocument.numPages;
  $("#commentPage").textContent = String(currentPage);
}

function setPdfStatus(message, busy) {
  $("#pdfStatus").textContent = message;
  $(".pdf-status-wrap").classList.toggle("is-busy", busy);
}

function changeZoom(delta) {
  zoom = Math.min(2, Math.max(0.7, Math.round((zoom + delta) * 10) / 10));
  renderPage(currentPage);
}

function setupPdfControls() {
  $("#previousPage").addEventListener("click", () => renderPage(currentPage - 1));
  $("#nextPage").addEventListener("click", () => renderPage(currentPage + 1));
  $("#pageInput").addEventListener("change", (event) => renderPage(event.target.value));
  $("#zoomOut").addEventListener("click", () => changeZoom(-0.1));
  $("#zoomIn").addEventListener("click", () => changeZoom(0.1));
  $("#resetZoom").addEventListener("click", () => { zoom = 1; renderPage(currentPage); });
  $("#weekSelect").addEventListener("change", () => { window.location.href = readerUrl(Number($("#weekSelect").value)); });

  $("#pdfStage").addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "PageUp") renderPage(currentPage - 1);
    if (event.key === "ArrowRight" || event.key === "PageDown") renderPage(currentPage + 1);
  });

  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (pdfDocument) renderPage(currentPage); }, 180);
  }).observe($("#pdfStage"));
}

function loadComments() {
  try {
    const stored = JSON.parse(localStorage.getItem(commentStorageKey));
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    commentsStorageAvailable = false;
    return {};
  }
}

function saveComments() {
  try {
    localStorage.setItem(commentStorageKey, JSON.stringify(comments));
    commentsStorageAvailable = true;
  } catch {
    commentsStorageAvailable = false;
  }
  updateStorageMessage();
}

function weekComments() {
  return Array.isArray(comments[String(activeWeek)]) ? comments[String(activeWeek)] : [];
}

function renderComments() {
  const list = $("#commentList");
  const items = [...weekComments()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  $("#commentCount").textContent = `${items.length} 条`;
  list.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "comment-empty";
    empty.textContent = "本周还没有批注。读到关键处时，留下一条可复查的想法。";
    list.append(empty);
    return;
  }

  items.forEach((comment) => {
    const article = document.createElement("article");
    article.className = "comment-item";

    const meta = document.createElement("div");
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = `第 ${comment.page} 页`;
    pageButton.addEventListener("click", () => renderPage(comment.page));
    const time = document.createElement("time");
    time.dateTime = comment.createdAt;
    time.textContent = new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(comment.createdAt));
    meta.append(pageButton, time);

    const text = document.createElement("p");
    text.textContent = comment.text;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "comment-delete";
    remove.textContent = "删除";
    remove.addEventListener("click", () => deleteComment(comment.id));
    article.append(meta, text, remove);
    list.append(article);
  });
}

function addComment(text) {
  const key = String(activeWeek);
  if (!Array.isArray(comments[key])) comments[key] = [];
  comments[key].push({
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    page: currentPage,
    text,
    createdAt: new Date().toISOString(),
  });
  saveComments();
  renderComments();
}

function deleteComment(id) {
  const key = String(activeWeek);
  comments[key] = weekComments().filter((comment) => comment.id !== id);
  saveComments();
  renderComments();
}

function updateStorageMessage() {
  $("#commentStorageNote").textContent = commentsStorageAvailable
    ? "批注仅保存在当前浏览器，不会公开。"
    : "当前浏览器无法保存批注；刷新后内容可能丢失。";
}

function setupComments() {
  $("#commentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#commentInput");
    const text = input.value.trim();
    if (!text) return;
    addComment(text);
    input.value = "";
    input.focus();
  });
  renderComments();
  updateStorageMessage();
}

setupReaderHeader();
setupInfraLinks();
setupPdfControls();
setupComments();
loadPdf();
