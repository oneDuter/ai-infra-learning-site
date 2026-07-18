const weeks = [
  { week: 1, stage: "建立全景", group: "foundation", title: "AI 系统全栈", reading: "书籍第 1 章 · AIInfra 00Summary", outcome: "画出芯片、编译器、框架、训练与推理的全栈关系。" },
  { week: 2, stage: "建立全景", group: "foundation", title: "计算模式与性能", reading: "书籍第 2 章 · MFU 性能实践", outcome: "估算 Transformer Block 的参数量、FLOPs、显存与算术强度。" },
  { week: 3, stage: "硬件与集群", group: "foundation", title: "CPU、GPU 与 AI 芯片", reading: "书籍第 3 章 · AICluster Roadmap", outcome: "比较四类芯片的执行模型、存储层次和适用负载。" },
  { week: 4, stage: "硬件与集群", group: "foundation", title: "GPU、互联与通信", reading: "书籍第 4 章 · StorComm", outcome: "推导 Ring AllReduce 通信量，厘清 NVLink、PCIe 与 RDMA。" },
  { week: 5, stage: "硬件与集群", group: "foundation", title: "TPU、NPU 与异构计算", reading: "书籍第 5–7 章 · SuperPod", outcome: "解释脉动阵列、数据流、布局转换和集群扩展。" },
  { week: 6, stage: "编译与算子", group: "compiler", title: "传统编译器与 IR", reading: "书籍第 8–9 章", outcome: "追踪一个简单函数从前端到 IR 再到目标代码的路径。" },
  { week: 7, stage: "编译与算子", group: "compiler", title: "图优化与后端优化", reading: "书籍第 10–11 章 · TrainAcceler", outcome: "手工完成融合、常量折叠、CSE 与死代码消除示例。" },
  { week: 8, stage: "编译与算子", group: "compiler", title: "CUDA、CANN 与 Ascend C", reading: "书籍第 12–13 章", outcome: "实现或分析向量加法 Kernel，记录线程与内存映射。" },
  { week: 9, stage: "推理系统", group: "inference", title: "推理系统与大模型推理", reading: "书籍第 14 章 · 05Infer", outcome: "比较 prefill/decode，计算 KV Cache 的增长与瓶颈。" },
  { week: 10, stage: "推理系统", group: "inference", title: "压缩、量化与转换", reading: "书籍第 15–17 章 · CompDistill", outcome: "比较 FP32 与 INT8/INT4 的模型大小、精度和延迟。" },
  { week: 11, stage: "推理系统", group: "inference", title: "图优化与 Kernel 优化", reading: "书籍第 18–19 章", outcome: "比较直接卷积、Im2Col 与 Winograd 的数据流。" },
  { week: 12, stage: "框架与分布式", group: "framework", title: "框架与自动微分", reading: "书籍第 20–21 章", outcome: "从零实现标量级反向模式自动微分并验证梯度。" },
  { week: 13, stage: "框架与分布式", group: "framework", title: "计算图", reading: "书籍第 22 章 · Mini Transformer", outcome: "追踪模型的前向图、反向图、调度和控制流限制。" },
  { week: 14, stage: "框架与分布式", group: "framework", title: "分布式并行", reading: "书籍第 23 章 · ParallelBegin/Adv", outcome: "选择 DP、TP、PP、SP、EP 与 ZeRO，并解释权衡。" },
  { week: 15, stage: "综合项目", group: "framework", title: "大模型专项补全", reading: "StorforAI · DockCloud · MoE", outcome: "整理至少 20 个书籍之外的大模型工程知识点。" },
  { week: 16, stage: "综合项目", group: "framework", title: "综合项目", reading: "性能模型 / 推理优化 / 分布式设计", outcome: "交付可运行代码、实验数据、图表与 2000 字复盘。" },
];

const taskLabels = ["读", "看", "做", "写", "测"];
const storageKey = "ai-infra-learning-progress-v1";
const themeKey = "ai-infra-learning-theme";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let progress = loadProgress();
let toastTimer;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved && typeof saved === "object" ? saved : {};
  } catch { return {}; }
}

function saveProgress() { localStorage.setItem(storageKey, JSON.stringify(progress)); }
function taskId(week, taskIndex) { return `w${week}-t${taskIndex}`; }
function isTaskDone(week, taskIndex) { return Boolean(progress[taskId(week, taskIndex)]); }
function isWeekDone(week) { return taskLabels.every((_, index) => isTaskDone(week, index)); }

function renderRoadmap() {
  const list = $("#roadmapList");
  list.innerHTML = weeks.map((item) => {
    const checks = taskLabels.map((label, index) => `
      <label class="task-check" title="${label}" aria-label="第 ${item.week} 周：${label}">
        <input type="checkbox" data-week="${item.week}" data-task="${index}" ${isTaskDone(item.week, index) ? "checked" : ""} />
        <span aria-hidden="true">${label}</span>
      </label>`).join("");
    return `
      <article class="week-card ${isWeekDone(item.week) ? "is-complete" : ""}" data-group="${item.group}" data-week-card="${item.week}">
        <div class="week-number">W${String(item.week).padStart(2, "0")}</div>
        <div class="week-title"><strong>${item.title}</strong><span>${item.stage} · ${item.reading}</span></div>
        <div class="week-outcome">${item.outcome}</div><div class="week-tasks">${checks}</div>
      </article>`;
  }).join("");
  $$("input[type='checkbox']", list).forEach((input) => input.addEventListener("change", handleTaskChange));
}

function handleTaskChange(event) {
  const input = event.currentTarget;
  const id = taskId(input.dataset.week, input.dataset.task);
  if (input.checked) progress[id] = true;
  else delete progress[id];
  saveProgress();
  renderRoadmap();
  updateMetrics();
}

function updateMetrics() {
  const totalTasks = weeks.length * taskLabels.length;
  const completedTasks = Object.values(progress).filter(Boolean).length;
  const completedWeeks = weeks.filter((item) => isWeekDone(item.week)).length;
  const percent = Math.round((completedTasks / totalTasks) * 100);
  const next = weeks.find((item) => !isWeekDone(item.week)) || weeks.at(-1);
  $("#progressOrbit").style.setProperty("--progress", percent);
  $("#progressPercent").textContent = `${percent}%`;
  $("#miniBar").style.width = `${percent}%`;
  $("#completedTasks").textContent = `${completedTasks} / ${totalTasks}`;
  $("#completedWeeks").textContent = `${completedWeeks} / ${weeks.length}`;
  $("#currentStage").textContent = completedWeeks === weeks.length ? "全部完成" : next.stage;
  $("#currentFocus").textContent = completedWeeks === weeks.length ? "计划完成 · 开始下一次迭代" : `第 ${next.week} 周 · ${next.title}`;
  $("#nextWeekBadge").textContent = `WEEK ${String(next.week).padStart(2, "0")}`;
  $("#nextWeekTitle").textContent = next.title;
  $("#nextWeekOutcome").textContent = next.outcome;
  $("#progressSummary").textContent = completedTasks === 0 ? "完成任意一项任务，进度会自动保存在当前浏览器。" : `已经完成 ${completedTasks} 项任务。下一步：${next.title}。`;
  $("#jumpToCurrent").onclick = () => $(`[data-week-card='${next.week}']`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setupFilters() {
  $$(".filter").forEach((button) => button.addEventListener("click", () => {
    const group = button.dataset.filter;
    $$(".filter").forEach((item) => item.classList.toggle("is-active", item === button));
    $$(".week-card").forEach((card) => { card.hidden = group !== "all" && card.dataset.group !== group; });
  }));
}

function setupTheme() {
  const saved = localStorage.getItem(themeKey);
  const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.dataset.theme = saved || preferred;
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(themeKey, next);
  });
}

function setupDataActions() {
  $("#exportProgress").addEventListener("click", () => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), progress };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ai-infra-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("进度已导出。");
  });
  $("#importProgress").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      const nextProgress = imported.progress ?? imported;
      if (!nextProgress || typeof nextProgress !== "object") throw new Error("invalid");
      progress = nextProgress;
      saveProgress();
      renderRoadmap();
      updateMetrics();
      showToast("进度已导入。");
    } catch { showToast("无法读取这个进度文件。"); }
    finally { event.target.value = ""; }
  });
  $("#resetProgress").addEventListener("click", () => {
    if (!window.confirm("确定清空全部学习进度吗？此操作无法撤销。")) return;
    progress = {};
    saveProgress();
    renderRoadmap();
    updateMetrics();
    showToast("进度已清空。");
  });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

setupTheme();
renderRoadmap();
setupFilters();
setupDataActions();
updateMetrics();
