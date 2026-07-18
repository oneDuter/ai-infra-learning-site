const forkBase = "https://github.com/oneDuter/AIInfra";
const weeks = [
  {
    week: 1, stage: "建立全景", group: "foundation", title: "AI 系统全栈", book: "书籍第 1 章", bookPage: 12, bookPages: "PDF 12–46 页", reading: "AIInfra 00Summary", outcome: "画出芯片、编译器、框架、训练与推理的全栈关系。",
    infra: [["训练系统全栈", "00Summary/04TrainingStack.md"], ["推理系统全栈", "00Summary/05InferStack.md"], ["AI Infra 未来趋势", "00Summary/06Future.md"]],
    experiment: "画一张从芯片、互联、编译器、框架到训练、推理和应用的系统全栈图，并标出每层输入、输出与性能指标。",
    deliverable: "30 项术语表 + 1 页系统边界说明 + 1 张全栈图。",
    quiz: ["AI 系统为什么不能只从模型算法理解？", "训练系统和推理系统的核心目标分别是什么？", "编译器、框架和运行时的边界在哪里？", "算力、存储、通信如何共同限制性能？", "AIInfra 相比书籍新增了哪些大模型工程层？"]
  },
  {
    week: 2, stage: "建立全景", group: "foundation", title: "计算模式与性能", book: "书籍第 2 章", bookPage: 47, bookPages: "PDF 47–81 页", reading: "MFU 与性能建模", outcome: "估算 Transformer Block 的参数量、FLOPs、显存与算术强度。",
    infra: [["集群性能专题", "01AICluster/04Performance"]],
    experiment: "选择一个 Transformer 配置，估算单层参数量、前向 FLOPs、训练 FLOPs、激活显存和 KV Cache，并解释瓶颈。",
    deliverable: "一份可复算的性能估算表，注明公式、单位、假设和误差来源。",
    quiz: ["FLOPS 与 FLOPs 有什么区别？", "MFU 为什么比设备利用率更能说明训练效率？", "什么情况下模型受内存带宽限制？", "算术强度如何联系计算量与访存量？", "Batch 和序列长度分别怎样影响吞吐与显存？"]
  },
  {
    week: 3, stage: "硬件与集群", group: "foundation", title: "CPU、GPU 与 AI 芯片", book: "书籍第 3 章", bookPage: 82, bookPages: "PDF 82–139 页", reading: "AICluster Roadmap", outcome: "比较四类芯片的执行模型、存储层次和适用负载。",
    infra: [["AI 集群路线图", "01AICluster/01Roadmap"], ["芯片与节点基础", "01AICluster/02L0L1Base"]],
    experiment: "以矩阵乘、Embedding 查表和控制流为例，对比 CPU、GPU、TPU、NPU 的执行方式与数据移动成本。",
    deliverable: "四类芯片对照表：执行模型、存储层次、互联、工具链、优势和限制。",
    quiz: ["SIMD、SIMT 和数据流架构有何差异？", "Tensor Core 为什么适合矩阵乘？", "片上存储为什么比峰值算力更关键？", "CPU 在 AI 系统中仍承担哪些任务？", "选择 AI 芯片时应比较哪些系统指标？"]
  },
  {
    week: 4, stage: "硬件与集群", group: "foundation", title: "GPU、互联与通信", book: "书籍第 4 章", bookPage: 140, bookPages: "PDF 140–211 页", reading: "StorComm", outcome: "推导 Ring AllReduce 通信量，厘清 NVLink、PCIe 与 RDMA。",
    infra: [["存储与通信路线图", "02StorComm/01Roadmap"], ["集合通信", "02StorComm/03CollectComm"], ["通信库", "02StorComm/04CommLibrary"]],
    experiment: "推导 N 卡 Ring AllReduce 的通信量与阶段数，再画出 GPU—NVLink—PCIe—NIC—交换机的路径。",
    deliverable: "通信量推导 + 拓扑图 + 20 题阶段自测记录。",
    quiz: ["AllReduce 由哪些基本操作组成？", "Ring 与 Tree 算法分别适合什么规模？", "NVLink、PCIe、RoCE 的作用边界是什么？", "带宽和时延分别主导哪类消息？", "拥塞为什么会放大同步训练的尾延迟？"]
  },
  {
    week: 5, stage: "硬件与集群", group: "foundation", title: "TPU、NPU 与异构计算", book: "书籍第 5–7 章", bookPage: 212, bookPages: "PDF 212–318 页", reading: "SuperPod", outcome: "解释脉动阵列、数据流、布局转换和集群扩展。",
    infra: [["超节点与 SuperPod", "01AICluster/03SuperPod"]],
    experiment: "用一个小型矩阵乘示意脉动阵列的数据流，并分析从单芯片扩展到 SuperPod 时新增的通信与可靠性问题。",
    deliverable: "脉动阵列时序图 + 异构执行流程 + 单芯片到超节点扩展清单。",
    quiz: ["脉动阵列如何复用数据？", "数据布局为什么会影响 NPU 性能？", "异构计算的调度难点是什么？", "超节点和普通多机集群有何差异？", "芯片扩展后哪些单机假设会失效？"]
  },
  {
    week: 6, stage: "编译与算子", group: "compiler", title: "传统编译器与 IR", book: "书籍第 8–9 章", bookPage: 320, bookPages: "PDF 320–396 页", reading: "编译器基础", outcome: "追踪一个简单函数从前端到 IR 再到目标代码的路径。",
    infra: [["训练加速入口", "04Train/03TrainAcceler"]],
    experiment: "选择一个简单函数，观察其高级表示、IR、优化后 IR 与目标代码，标记每一层丢失和新增的信息。",
    deliverable: "一张编译流水线图 + 一份 IR 前后对比注释。",
    quiz: ["为什么需要多层 IR？", "前端优化与后端优化的边界是什么？", "SSA 形式解决什么问题？", "目标无关优化有哪些典型例子？", "AI 编译器与传统编译器最大的新增约束是什么？"]
  },
  {
    week: 7, stage: "编译与算子", group: "compiler", title: "图优化与后端优化", book: "书籍第 10–11 章", bookPage: 397, bookPages: "PDF 397–462 页", reading: "TrainAcceler", outcome: "手工完成融合、常量折叠、CSE 与死代码消除示例。",
    infra: [["训练加速专题", "04Train/03TrainAcceler"]],
    experiment: "构造一个包含冗余计算的小计算图，依次执行常量折叠、CSE、死代码消除和算子融合，并记录代价变化。",
    deliverable: "优化前后计算图 + 每项优化的适用条件与反例。",
    quiz: ["算子融合为什么可能降低显存流量？", "融合何时反而降低性能？", "CSE 依赖哪些等价性假设？", "图级优化如何影响自动微分？", "Flash Attention 属于算法、图还是 Kernel 优化？"]
  },
  {
    week: 8, stage: "编译与算子", group: "compiler", title: "CUDA、CANN 与 Ascend C", book: "书籍第 12–13 章", bookPage: 463, bookPages: "PDF 463–517 页", reading: "算子开发", outcome: "实现或分析向量加法 Kernel，记录线程与内存映射。",
    infra: [["训练加速与算子", "04Train/03TrainAcceler"]],
    experiment: "实现或完整分析一个向量加法/矩阵乘 Kernel，记录线程块、内存层次、合并访问和同步位置。",
    deliverable: "可运行 Kernel 或逐行分析 + 性能测量 + 模型算子到芯片指令路径图。",
    quiz: ["线程块如何映射到硬件执行单元？", "合并访存为什么重要？", "共享内存的主要用途是什么？", "Occupancy 高是否一定更快？", "CUDA 与 Ascend C 的抽象层次有哪些共性？"]
  },
  {
    week: 9, stage: "推理系统", group: "inference", title: "推理系统与大模型推理", book: "书籍第 14 章", bookPage: 520, bookPages: "PDF 520–569 页", reading: "05Infer", outcome: "比较 prefill/decode，计算 KV Cache 的增长与瓶颈。",
    infra: [["推理基础", "05Infer/01Foundation"], ["推理加速", "05Infer/02InferSpeedUp"], ["调度加速", "05Infer/03SchedSpeedUp"]],
    experiment: "计算给定模型在不同 batch、层数和序列长度下的 KV Cache，占用，并画出 prefill/decode 的计算与带宽特征。",
    deliverable: "KV Cache 计算表 + prefill/decode 对照图 + 推理瓶颈诊断。",
    quiz: ["Prefill 与 decode 为什么具有不同瓶颈？", "KV Cache 的大小由哪些参数决定？", "连续批处理解决什么问题？", "首 Token 延迟和每 Token 延迟如何权衡？", "吞吐优先和时延优先需要怎样的调度策略？"]
  },
  {
    week: 10, stage: "推理系统", group: "inference", title: "压缩、量化与转换", book: "书籍第 15–17 章", bookPage: 570, bookPages: "PDF 570–655 页", reading: "CompDistill", outcome: "比较 FP32 与 INT8/INT4 的模型大小、精度和延迟。",
    infra: [["压缩与蒸馏", "05Infer/06CompDistill"]],
    experiment: "选择一个小模型，比较 FP32、INT8 和可行时的 INT4 版本在模型大小、精度、吞吐和时延上的变化。",
    deliverable: "量化实验表 + 校准方法说明 + 精度下降案例分析。",
    quiz: ["PTQ 与 QAT 的区别是什么？", "权重量化和激活量化难点有何不同？", "Per-channel 为什么通常更准确？", "量化为何不一定带来等比例加速？", "蒸馏与剪枝解决的是同一问题吗？"]
  },
  {
    week: 11, stage: "推理系统", group: "inference", title: "图优化与 Kernel 优化", book: "书籍第 18–19 章", bookPage: 656, bookPages: "PDF 656–727 页", reading: "推理与训练加速", outcome: "比较直接卷积、Im2Col 与 Winograd 的数据流。",
    infra: [["推理加速", "05Infer/02InferSpeedUp"], ["训练加速", "04Train/03TrainAcceler"]],
    experiment: "比较直接卷积、Im2Col 和 Winograd 的计算量、额外内存与数据布局，选一个算子记录端到端优化过程。",
    deliverable: "三种卷积数据流对照 + Kernel 性能记录 + 优化决策树。",
    quiz: ["Im2Col 为什么增加内存占用？", "Winograd 的数值误差来自哪里？", "图优化与 Kernel 优化怎样协同？", "布局转换为什么可能吞噬优化收益？", "端到端速度为何不能只看单算子峰值？"]
  },
  {
    week: 12, stage: "框架与分布式", group: "framework", title: "框架与自动微分", book: "书籍第 20–21 章", bookPage: 728, bookPages: "PDF 728–796 页", reading: "Mini Transformer 基础", outcome: "从零实现标量级反向模式自动微分并验证梯度。",
    infra: [["算法与模型基础", "06AlgoData/01Basic"]],
    experiment: "从零实现标量级反向模式自动微分，支持基础运算、拓扑排序、反向传播和数值梯度检查。",
    deliverable: "自动微分最小实现 + 单元测试 + 梯度检查报告。",
    quiz: ["前向模式与反向模式分别适合什么维度？", "计算图为什么需要拓扑排序？", "梯度累加何时发生？", "原地操作为何可能破坏自动微分？", "数值梯度检查有哪些误差来源？"]
  },
  {
    week: 13, stage: "框架与分布式", group: "framework", title: "计算图", book: "书籍第 22 章", bookPage: 797, bookPages: "PDF 797–829 页", reading: "Mini Transformer", outcome: "追踪模型的前向图、反向图、调度和控制流限制。",
    infra: [["Mini Transformer 与基础", "06AlgoData/01Basic"]],
    experiment: "追踪一个 PyTorch 小模型的前向图和反向图，比较动态图、静态图以及编译捕获对控制流的限制。",
    deliverable: "前向/反向图注释 + 动静态图比较 + 一次图捕获失败复盘。",
    quiz: ["动态图与静态图各自优化空间在哪里？", "反向图如何由前向图产生？", "数据相关控制流为什么难以捕获？", "图断裂会造成什么性能影响？", "框架运行时负责哪些调度工作？"]
  },
  {
    week: 14, stage: "框架与分布式", group: "framework", title: "分布式并行", book: "书籍第 23 章", bookPage: 830, bookPages: "PDF 830–873 页", reading: "ParallelBegin / ParallelAdv", outcome: "选择 DP、TP、PP、SP、EP 与 ZeRO，并解释权衡。",
    infra: [["并行训练入门", "04Train/01ParallelBegin"], ["高级并行训练", "04Train/02ParallelAdv"]],
    experiment: "针对一个给定模型与集群，设计 DP/TP/PP/SP/EP/ZeRO 组合，估算每卡显存、通信量和流水线气泡。",
    deliverable: "并行策略设计书 + 通信/显存估算 + 至少一个最小分布式实验。",
    quiz: ["数据并行的主要通信是什么？", "张量并行为何依赖高速互联？", "流水并行气泡如何产生？", "ZeRO 各阶段分别切分什么？", "MoE 的专家并行增加了什么通信？"]
  },
  {
    week: 15, stage: "综合项目", group: "framework", title: "大模型专项补全", book: "回顾书籍薄弱覆盖部分", bookPage: 1, bookPages: "全书目录索引（3 页）", reading: "存储、云平台、MoE", outcome: "整理至少 20 个书籍之外的大模型工程知识点。",
    infra: [["AI 集群存储", "02StorComm/05StorforAI"], ["容器与云平台", "03DockCloud"], ["训练加速", "04Train/03TrainAcceler"], ["MoE", "06AlgoData/02MoE"]],
    experiment: "从存储、容器调度、可观测性、MoE 和长序列中选择两项，画出工程链路并解释故障与性能风险。",
    deliverable: "不少于 20 项的书籍 × AIInfra 差异清单 + 两张工程链路图。",
    quiz: ["Checkpoint 为什么会形成存储突发流量？", "Kubernetes 调度 AI 任务面临哪些拓扑约束？", "MoE 为什么需要 All-to-All？", "长序列训练怎样改变显存和通信？", "可观测性应覆盖哪些训练系统信号？"]
  },
  {
    week: 16, stage: "综合项目", group: "framework", title: "综合项目", book: "全书与知识地图复盘", bookPage: 1, bookPages: "全书目录索引（3 页）", reading: "选择相关 AIInfra 模块", outcome: "交付可运行代码、实验数据、图表与 2000 字复盘。",
    infra: [["AIInfra 总览", "00Summary"], ["训练系统", "04Train"], ["推理系统", "05Infer"]],
    experiment: "从 Transformer 性能模型、推理优化报告、分布式策略设计中选择一个，完成可复现的端到端项目。",
    deliverable: "代码、环境说明、原始数据、图表、结论、失败记录和不少于 2000 字复盘。",
    quiz: ["项目的核心假设是什么？", "哪些指标能够证明改进有效？", "实验是否能被另一台机器复现？", "结论在哪些边界条件下失效？", "下一轮最值得验证的系统问题是什么？"]
  }
];

const taskLabels = ["读", "看", "做", "写", "测"];
const storageKey = "ai-infra-learning-progress-v1";
const themeKey = "ai-infra-learning-theme";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let storageAvailable = true;
let progress = loadProgress();
let activeTask = null;
let toastTimer;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    storageAvailable = false;
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    storageAvailable = true;
    return true;
  } catch {
    storageAvailable = false;
    showToast("浏览器阻止了本地保存，本次进度仅在当前页面有效。");
    return false;
  }
}

function taskId(week, taskIndex) { return `w${week}-t${taskIndex}`; }
function isTaskDone(week, taskIndex) { return Boolean(progress[taskId(week, taskIndex)]); }
function isWeekDone(week) { return taskLabels.every((_, index) => isTaskDone(week, index)); }
function infraUrl(path) {
  const route = path.toLowerCase().endsWith(".md") ? "blob" : "tree";
  return `${forkBase}/${route}/main/${path.split("/").map(encodeURIComponent).join("/")}`;
}

function bookUrl(week) {
  return `./reader.html?week=${week}`;
}

function renderRoadmap() {
  const list = $("#roadmapList");
  list.innerHTML = weeks.map((item) => {
    const checks = taskLabels.map((label, index) => {
      const done = isTaskDone(item.week, index);
      return `<button class="task-check${done ? " is-done" : ""}" type="button" data-week="${item.week}" data-task="${index}" aria-pressed="${done}" aria-label="打开第 ${item.week} 周${label}任务详情"><span>${label}</span>${done ? "<i aria-hidden='true'>✓</i>" : ""}</button>`;
    }).join("");
    return `
      <article class="week-card ${isWeekDone(item.week) ? "is-complete" : ""}" data-group="${item.group}" data-week-card="${item.week}">
        <div class="week-number">W${String(item.week).padStart(2, "0")}</div>
        <div class="week-title"><strong>${item.title}</strong><span>${item.stage} · ${item.book} · ${item.bookPages}</span></div>
        <div class="week-outcome">${item.outcome}</div><div class="week-tasks">${checks}</div>
      </article>`;
  }).join("");
}

function getTaskDetail(item, taskIndex) {
  const common = { label: taskLabels[taskIndex], context: `第 ${item.week} 周 · ${item.stage} · ${item.title}` };
  if (taskIndex === 0) return { ...common, title: `精读：${item.book}`, description: `阅读范围：${item.bookPages}。围绕“${item.outcome}”精读本周书籍内容。`, links: [{ label: "站内在线预览本周 PDF", meta: `${item.book} · ${item.bookPages}`, url: bookUrl(item.week) }], items: ["在站内阅读器中完成本周 PDF", "标记至少 3 个核心概念", "记录 2 个关键权衡", "写下 1 个仍需验证的问题"], deliverable: "在笔记中留下章节摘要、概念关系、页码引用与疑问。" };
  if (taskIndex === 1) return { ...common, title: `研读 AIInfra：${item.reading}`, description: "从个人 Fork 阅读对应工程材料，把书中的稳定原理映射到大模型系统实践。", links: item.infra, items: ["先看目录和学习目标", "记录书籍没有覆盖的工程细节", "比较两份材料的假设和适用边界"], deliverable: "至少补充 5 条 AIInfra 工程知识点。" };
  if (taskIndex === 2) return { ...common, title: "完成最小可复现实验", description: item.experiment, items: ["记录软硬件环境与版本", "保存输入、命令、输出和原始指标", "记录失败尝试，不只保留成功结果"], deliverable: item.deliverable };
  if (taskIndex === 3) return { ...common, title: "沉淀结构化学习笔记", description: `围绕“${item.title}”把原理、工程实践和实验结果组织成可复查的笔记。`, items: ["核心概念：至少 3 项", "关键权衡：至少 2 项", "实验结论与证据", "失败记录与下一步问题"], deliverable: `建议交付：${item.deliverable}` };
  return { ...common, title: "五问闭环自测", description: "先关闭资料独立回答，再回到书籍与 AIInfra 校正答案。", quiz: item.quiz, deliverable: "记录每题的信心等级；低于 3/5 的问题进入下周复习清单。" };
}

function setupRoadmapInteractions() {
  $("#roadmapList").addEventListener("click", (event) => {
    const button = event.target.closest(".task-check");
    if (!button) return;
    openTaskDetails(Number(button.dataset.week), Number(button.dataset.task));
  });
}

function openTaskDetails(weekNumber, taskIndex) {
  const item = weeks.find((week) => week.week === weekNumber);
  if (!item) return;
  activeTask = { weekNumber, taskIndex };
  const detail = getTaskDetail(item, taskIndex);
  $("#taskEyebrow").textContent = `${detail.context} · ${detail.label}`;
  $("#taskTitle").textContent = detail.title;
  $("#taskDescription").textContent = detail.description;
  $("#taskChecklist").innerHTML = (detail.items || []).map((text) => `<li>${text}</li>`).join("");
  $("#taskChecklist").hidden = !detail.items?.length;
  $("#taskLinks").innerHTML = (detail.links || []).map((link) => {
    const [label, path] = Array.isArray(link) ? link : [link.label, null];
    const url = path ? infraUrl(path) : link.url;
    const meta = path || link.meta;
    return `<a href="${url}" target="_blank" rel="noreferrer"><span>${label}</span><small>${meta}</small><b aria-hidden="true">↗</b></a>`;
  }).join("");
  $("#taskLinks").hidden = !detail.links?.length;
  $("#taskQuiz").innerHTML = (detail.quiz || []).map((question, index) => `<li><span>Q${index + 1}</span><p>${question}</p></li>`).join("");
  $("#taskQuiz").hidden = !detail.quiz?.length;
  $("#taskDeliverable").textContent = detail.deliverable;
  updateTaskCompleteButton();
  const drawer = $("#taskDrawer");
  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  $("#closeTaskDrawer").focus();
}

function closeTaskDetails() {
  const drawer = $("#taskDrawer");
  drawer.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  if (activeTask) $(`.task-check[data-week='${activeTask.weekNumber}'][data-task='${activeTask.taskIndex}']`)?.focus();
}

function updateTaskCompleteButton() {
  if (!activeTask) return;
  const done = isTaskDone(activeTask.weekNumber, activeTask.taskIndex);
  const button = $("#toggleTaskComplete");
  button.textContent = done ? "已完成 · 点击撤销" : "标记为已完成";
  button.classList.toggle("is-complete", done);
  button.setAttribute("aria-pressed", String(done));
}

function setupTaskDrawer() {
  $("#closeTaskDrawer").addEventListener("click", closeTaskDetails);
  $("#taskBackdrop").addEventListener("click", closeTaskDetails);
  $("#toggleTaskComplete").addEventListener("click", () => {
    if (!activeTask) return;
    const id = taskId(activeTask.weekNumber, activeTask.taskIndex);
    const nextDone = !isTaskDone(activeTask.weekNumber, activeTask.taskIndex);
    if (nextDone) progress[id] = true;
    else delete progress[id];
    saveProgress();
    renderRoadmap();
    updateMetrics();
    updateTaskCompleteButton();
    showToast(nextDone ? "任务已完成，进度已更新。" : "已撤销任务完成状态。");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#taskDrawer").hidden) closeTaskDetails();
  });
}

function updateMetrics() {
  const totalTasks = weeks.length * taskLabels.length;
  const completedTasks = Object.values(progress).filter(Boolean).length;
  const completedWeeks = weeks.filter((item) => isWeekDone(item.week)).length;
  const percent = Math.round((completedTasks / totalTasks) * 100);
  const next = weeks.find((item) => !isWeekDone(item.week)) || weeks[weeks.length - 1];
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
  $("#progressSummary").textContent = completedTasks === 0 ? "点击任意任务查看材料，完成后进度自动保存在当前浏览器。" : `已经完成 ${completedTasks} 项任务。下一步：${next.title}。`;
  $("#storageStatus").textContent = storageAvailable ? "交互已就绪 · 本地保存可用" : "交互已就绪 · 仅当前页面有效";
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
  let saved = null;
  try { saved = localStorage.getItem(themeKey); } catch { storageAvailable = false; }
  const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.dataset.theme = saved || preferred;
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(themeKey, next); } catch { storageAvailable = false; }
    updateMetrics();
  });
}

function setupDataActions() {
  $("#exportProgress").addEventListener("click", () => {
    const payload = { version: 2, exportedAt: new Date().toISOString(), progress };
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
setupRoadmapInteractions();
setupTaskDrawer();
setupFilters();
setupDataActions();
updateMetrics();
