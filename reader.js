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

const params = new URLSearchParams(window.location.search);
const requestedWeek = Number(params.get("week"));
const activeWeek = Number.isInteger(requestedWeek) && requestedWeek >= 1 && requestedWeek <= 16 ? requestedWeek : 1;
const weekSelect = document.querySelector("#weekSelect");

weekSelect.innerHTML = readingWeeks.map(([week, title]) => `<option value="${week}">W${String(week).padStart(2, "0")} · ${title}</option>`).join("");
weekSelect.value = String(activeWeek);

function readerUrl(week) { return `./reader.html?week=${week}`; }
function pdfUrl(week) { return `./books/week-${String(week).padStart(2, "0")}.pdf#page=1&view=FitH`; }

function renderReader(week) {
  const [, title, meta] = readingWeeks[week - 1];
  document.title = `W${String(week).padStart(2, "0")} · ${title} · AI Infra Learning`;
  document.querySelector("#readerWeek").textContent = `WEEK ${String(week).padStart(2, "0")} · WEEKLY READER`;
  document.querySelector("#readerTitle").textContent = title;
  document.querySelector("#readerMeta").textContent = `《AI 系统：原理与架构》 · ${meta}`;
  document.querySelector("#pdfFrame").src = pdfUrl(week);
  document.querySelector("#openPdf").href = pdfUrl(week);

  const previous = document.querySelector("#previousWeek");
  const next = document.querySelector("#nextWeek");
  previous.href = readerUrl(Math.max(1, week - 1));
  next.href = readerUrl(Math.min(16, week + 1));
  previous.setAttribute("aria-disabled", String(week === 1));
  next.setAttribute("aria-disabled", String(week === 16));
}

weekSelect.addEventListener("change", () => {
  window.location.href = readerUrl(Number(weekSelect.value));
});

renderReader(activeWeek);
