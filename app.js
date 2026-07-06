const assetTypes = [
  {
    key: "items",
    labels: { zh_cn: "物品", zh_tw: "物品", en_us: "Items" },
    hints: {
      zh_cn: "生成 configuration/items 与 item 贴图",
      zh_tw: "生成 configuration/items 與 item 貼圖",
      en_us: "Generate configuration/items and item textures",
    },
    textureRoot: "item/generated",
  },
  {
    key: "blocks",
    labels: { zh_cn: "方块", zh_tw: "方塊", en_us: "Blocks" },
    hints: {
      zh_cn: "生成 block_item、blocks 与 block 贴图",
      zh_tw: "生成 block_item、blocks 與 block 貼圖",
      en_us: "Generate block_item, blocks, and block textures",
    },
    textureRoot: "block/generated",
  },
  {
    key: "furniture",
    labels: { zh_cn: "家具", zh_tw: "家具", en_us: "Furniture" },
    hints: {
      zh_cn: "生成 furniture_item 与基础家具变体",
      zh_tw: "生成 furniture_item 與基礎家具變體",
      en_us: "Generate furniture_item and basic furniture variants",
    },
    textureRoot: "item/generated",
  },
  {
    key: "emoji",
    labels: { zh_cn: "表情", zh_tw: "表情", en_us: "Emoji" },
    hints: {
      zh_cn: "生成 images、emoji 与字体贴图",
      zh_tw: "生成 images、emoji 與字型貼圖",
      en_us: "Generate images, emoji, and font textures",
    },
    textureRoot: "font/image/generated",
  },
];

const languageProfiles = [
  { file: "zh_cn.yml", locale: "zh_cn", label: "简体中文", nameHeader: "简体中文名称", targetLang: "ZH-HANS", chinese: true },
  { file: "zh_tw.yml", locale: "zh_tw", label: "繁體中文", nameHeader: "繁體中文名稱", targetLang: "ZH-HANT", chinese: true },
  { file: "en_us.yml", locale: "en_us", label: "English", nameHeader: "English Name", targetLang: "EN-US", chinese: false },
];

const state = {
  assets: [],
  filterType: "all",
  language: "zh_cn",
  theme: localStorage.getItem("ceTheme") || "light",
  clearConfirmUntil: 0,
};

let clearConfirmTimer = null;

const uiText = {
  zh_cn: {
    appTitle: "资产包生成器",
    appSubtitle: "CraftEngine 本地打包工具",
    packInfo: "包信息",
    namespace: "命名空间",
    author: "作者",
    version: "版本",
    description: "描述",
    endpoint: "接口",
    translateMissing: "翻译三种语言",
    display: "显示",
    export: "导出",
    fileName: "文件名",
    downloadPack: "下载资产包",
    frontendNoticeTitle: "前端自动化处理",
    frontendNoticeBody: "图片解析、名称整理、配置生成、PNG 转换和 zip 打包都在当前浏览器前端完成。这个工具不写数据库，也不会把你的图片保存到服务器。",
    deeplNoticeTitle: "DeepL 说明",
    deeplNoticeBody: "只有点击翻译时，待翻译的文件名才会发送到 DeepL。通过本地服务转发时不会写数据库，也不会保存 API Key。",
    imageTypesTitle: "图片分类",
    imageTypesHint: "把图片放进对应类型，名称留空时使用文件名或 DeepL 译名。",
    clear: "清空",
    clearConfirm: "确认清空",
    clearTooltip: "清空当前已导入的所有图片条目和名称，已下载的文件不受影响。",
    clearConfirmTooltip: "再次点击会清空当前列表。",
    cleared: "已清空",
    stepsTitle: "操作步骤",
    step1: "在左侧填写命名空间、作者、版本和描述，这些内容会写入导出的 `pack.yml`。",
    step2: "把图片拖入“物品、方块、家具、表情”对应区域，也可以点击区域选择多个图片。",
    step3: "检查表格里的 ID。ID 会作为 CraftEngine 物品、方块、家具或表情的配置名，建议只用小写英文、数字和下划线。",
    step4: "点击语言按钮切换当前编辑语言，再填写或翻译对应语言的名称。",
    step5: "表情触发词会自动跟随 ID，例如 ID 是 `smile` 时触发词就是 `:smile:`。",
    step6: "确认无误后点击下载资产包，得到的 zip 可解压后放入 CraftEngine 资产目录测试。",
    entries: "条目",
    preview: "预览",
    all: "全部",
    files: "个文件",
    remove: "移除",
    waiting: "等待图片",
    noImages: "没有可用图片",
    added: "已添加",
    noNames: "没有需要翻译的名称",
    noKey: "未填写 DeepL Key，已使用文件名",
    translatingAll: "正在翻译三种语言",
    translatedAll: "已翻译三种语言名称",
    translateFailed: "DeepL 请求失败",
    zipBuilding: "正在生成 zip",
    namespaceRequired: "命名空间不能为空",
    addImagesFirst: "请先添加图片",
    generated: "已生成",
    generationFailed: "生成失败",
  },
  zh_tw: {
    appTitle: "資產包生成器",
    appSubtitle: "CraftEngine 本機打包工具",
    packInfo: "包資訊",
    namespace: "命名空間",
    author: "作者",
    version: "版本",
    description: "描述",
    endpoint: "介面",
    translateMissing: "翻譯三種語言",
    display: "顯示",
    export: "匯出",
    fileName: "檔案名稱",
    downloadPack: "下載資產包",
    frontendNoticeTitle: "前端自動化處理",
    frontendNoticeBody: "圖片解析、名稱整理、配置生成、PNG 轉換和 zip 打包都在目前瀏覽器前端完成。這個工具不寫資料庫，也不會把你的圖片儲存到伺服器。",
    deeplNoticeTitle: "DeepL 說明",
    deeplNoticeBody: "只有點擊翻譯時，待翻譯的檔名才會送到 DeepL。透過本機服務轉發時不會寫資料庫，也不會保存 API Key。",
    imageTypesTitle: "圖片分類",
    imageTypesHint: "把圖片放進對應類型，名稱留空時使用檔名或 DeepL 譯名。",
    clear: "清空",
    clearConfirm: "確認清空",
    clearTooltip: "清空目前已匯入的所有圖片條目和名稱，已下載的檔案不受影響。",
    clearConfirmTooltip: "再次點擊會清空目前列表。",
    cleared: "已清空",
    stepsTitle: "操作步驟",
    step1: "在左側填寫命名空間、作者、版本和描述，這些內容會寫入匯出的 `pack.yml`。",
    step2: "把圖片拖入「物品、方塊、家具、表情」對應區域，也可以點擊區域選擇多張圖片。",
    step3: "檢查表格裡的 ID。ID 會作為 CraftEngine 物品、方塊、家具或表情的配置名，建議只用小寫英文、數字和底線。",
    step4: "點擊語言按鈕切換目前編輯語言，再填寫或翻譯對應語言的名稱。",
    step5: "表情觸發詞會自動跟隨 ID，例如 ID 是 `smile` 時觸發詞就是 `:smile:`。",
    step6: "確認無誤後點擊下載資產包，得到的 zip 可解壓後放入 CraftEngine 資產目錄測試。",
    entries: "條目",
    preview: "預覽",
    all: "全部",
    files: "個檔案",
    remove: "移除",
    waiting: "等待圖片",
    noImages: "沒有可用圖片",
    added: "已新增",
    noNames: "沒有需要翻譯的名稱",
    noKey: "未填寫 DeepL Key，已使用檔名",
    translatingAll: "正在翻譯三種語言",
    translatedAll: "已翻譯三種語言名稱",
    translateFailed: "DeepL 請求失敗",
    zipBuilding: "正在生成 zip",
    namespaceRequired: "命名空間不能為空",
    addImagesFirst: "請先新增圖片",
    generated: "已生成",
    generationFailed: "生成失敗",
  },
  en_us: {
    appTitle: "Asset Pack Generator",
    appSubtitle: "CraftEngine local packing tool",
    packInfo: "Pack Info",
    namespace: "Namespace",
    author: "Author",
    version: "Version",
    description: "Description",
    endpoint: "Endpoint",
    translateMissing: "Translate all languages",
    display: "Display",
    export: "Export",
    fileName: "File name",
    downloadPack: "Download pack",
    frontendNoticeTitle: "Frontend-only automation",
    frontendNoticeBody: "Image parsing, name editing, config generation, PNG conversion, and zip packaging all run in this browser. This tool does not write a database or save your images to a server.",
    deeplNoticeTitle: "DeepL Notes",
    deeplNoticeBody: "Filenames are sent to DeepL only when you click translate. The local proxy does not write a database or save your API key.",
    imageTypesTitle: "Image Types",
    imageTypesHint: "Drop images into the matching type. Empty names use the filename or DeepL translation.",
    clear: "Clear",
    clearConfirm: "Confirm clear",
    clearTooltip: "Clear all imported image entries and names. Downloaded files are not affected.",
    clearConfirmTooltip: "Click again to clear the current list.",
    cleared: "Cleared",
    stepsTitle: "Steps",
    step1: "Fill namespace, author, version, and description on the left. These are written to `pack.yml`.",
    step2: "Drop images into Items, Blocks, Furniture, or Emoji, or click a zone to select multiple images.",
    step3: "Check each ID. The ID becomes the CraftEngine config name, so lowercase letters, numbers, and underscores are recommended.",
    step4: "Click the language button to switch the current editing language, then edit or translate that language's names.",
    step5: "Emoji keywords follow the ID automatically. If the ID is `smile`, the keyword is `:smile:`.",
    step6: "Click download when ready, then unzip the pack into your CraftEngine assets directory for testing.",
    entries: "Entries",
    preview: "Preview",
    all: "All",
    files: "files",
    remove: "Remove",
    waiting: "Waiting for images",
    noImages: "No valid images",
    added: "Added",
    noNames: "No names need translation",
    noKey: "No DeepL key; filenames were used",
    translatingAll: "Translating three languages",
    translatedAll: "Translated names for three languages",
    translateFailed: "DeepL request failed",
    zipBuilding: "Building zip",
    namespaceRequired: "Namespace is required",
    addImagesFirst: "Add images first",
    generated: "Generated",
    generationFailed: "Generation failed",
  },
};

const els = {
  dropGrid: document.getElementById("dropGrid"),
  filterBar: document.getElementById("filterBar"),
  rows: document.getElementById("assetRows"),
  countBadge: document.getElementById("countBadge"),
  status: document.getElementById("statusText"),
  namespace: document.getElementById("namespaceInput"),
  author: document.getElementById("authorInput"),
  version: document.getElementById("versionInput"),
  description: document.getElementById("descriptionInput"),
  languageToggle: document.getElementById("languageToggleBtn"),
  themeToggle: document.getElementById("themeToggleBtn"),
  deeplKey: document.getElementById("deeplKeyInput"),
  deeplHost: document.getElementById("deeplHostInput"),
  zipName: document.getElementById("zipNameInput"),
  translate: document.getElementById("translateBtn"),
  download: document.getElementById("downloadBtn"),
  clear: document.getElementById("clearBtn"),
  notice: document.getElementById("privacyNotice"),
  noticeClose: document.getElementById("noticeCloseBtn"),
  backToTop: document.getElementById("backToTopBtn"),
};

function init() {
  applyTheme();
  applyUIText();
  renderDropZones();
  renderFilters();
  render();
  els.translate.addEventListener("click", translateEmptyNames);
  els.download.addEventListener("click", downloadPack);
  els.clear.addEventListener("click", clearAll);
  els.languageToggle.addEventListener("click", cycleLanguage);
  els.themeToggle.addEventListener("click", toggleTheme);
  els.noticeClose.addEventListener("click", () => {
    els.notice.hidden = true;
    updateBackToTop();
  });
  els.backToTop.addEventListener("click", smoothScrollToTop);
  window.addEventListener("scroll", updateBackToTop);
  window.addEventListener("resize", updateBackToTop);
  updateBackToTop();
}

function renderFilters() {
  const text = currentUIText();
  const filters = [{ key: "all", label: text.all }, ...assetTypes.map((type) => ({
    key: type.key,
    label: localizedTypeLabel(type),
  }))];
  els.filterBar.innerHTML = "";
  for (const filter of filters) {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.type = "button";
    button.textContent = filter.label;
    button.dataset.filter = filter.key;
    button.addEventListener("click", () => {
      state.filterType = filter.key;
      render();
    });
    els.filterBar.appendChild(button);
  }
}

function renderDropZones() {
  els.dropGrid.innerHTML = "";
  for (const type of assetTypes) {
    const zone = document.createElement("section");
    zone.className = "drop-zone";
    zone.dataset.type = type.key;
    zone.innerHTML = `
      <h3>${localizedTypeLabel(type)}</h3>
      <p>${localizedTypeHint(type)}</p>
      <span class="type-count" data-count="${type.key}">0</span>
      <input type="file" accept="image/png,image/jpeg,image/webp" multiple aria-label="${localizedTypeLabel(type)}" />
    `;

    const input = zone.querySelector("input");
    input.addEventListener("change", () => addFiles(type.key, input.files));

    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("dragging");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragging"));
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("dragging");
      addFiles(type.key, event.dataTransfer.files);
    });

    els.dropGrid.appendChild(zone);
  }
}

function addFiles(type, fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  const existingIds = new Set(state.assets.map((asset) => asset.id));
  for (const file of files) {
    const base = file.name.replace(/\.[^.]+$/, "");
    const id = uniqueId(normalizeId(base), existingIds);
    existingIds.add(id);
    state.assets.push({
      uid: crypto.randomUUID(),
      type,
      file,
      url: URL.createObjectURL(file),
      id,
      fallbackName: humanizeName(base),
      names: createNames(humanizeName(base)),
      status: "待处理",
    });
  }
  const text = currentUIText();
  setStatus(files.length ? `${text.added} ${files.length} ${text.files}` : text.noImages);
  render();
}

function render() {
  els.rows.innerHTML = "";
  const currentProfile = currentLanguageProfile();
  const visibleAssets = state.filterType === "all"
    ? state.assets
    : state.assets.filter((asset) => asset.type === state.filterType);

  for (const asset of visibleAssets) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img class="preview" src="${asset.url}" alt="" /></td>
      <td><input class="id-input" data-field="id" value="${escapeAttr(asset.id)}" spellcheck="false" /></td>
      <td><input class="cell-input" data-field="name" value="${escapeAttr(nameForEdit(asset))}" placeholder="${escapeAttr(asset.fallbackName)}" /></td>
      <td><button class="danger remove-btn" type="button">${currentUIText().remove}</button></td>
    `;

    tr.querySelectorAll("input[data-field]").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        if (field === "id") asset.id = normalizeId(input.value);
        if (field === "name") asset.names[state.language] = input.value;
      });
      input.addEventListener("blur", render);
    });

    tr.querySelector(".remove-btn").addEventListener("click", () => {
      URL.revokeObjectURL(asset.url);
      state.assets = state.assets.filter((item) => item.uid !== asset.uid);
      render();
    });

    els.rows.appendChild(tr);
  }

  const text = currentUIText();
  els.countBadge.textContent = state.filterType === "all"
    ? `${state.assets.length} ${text.files}`
    : `${visibleAssets.length} / ${state.assets.length} ${text.files}`;

  els.filterBar.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filterType);
  });

  for (const type of assetTypes) {
    const count = state.assets.filter((asset) => asset.type === type.key).length;
    const badge = document.querySelector(`[data-count="${type.key}"]`);
    if (badge) badge.textContent = count;
  }
  els.languageToggle.textContent = languageIcon();
  els.languageToggle.title = currentProfile.label;
  els.languageToggle.setAttribute("aria-label", currentProfile.label);
  els.themeToggle.textContent = state.theme === "dark" ? "☾" : "☼";
  els.themeToggle.title = state.theme === "dark" ? "Dark" : "Light";
  els.themeToggle.setAttribute("aria-label", els.themeToggle.title);
  document.getElementById("nameColumnHeader").textContent = currentProfile.nameHeader;
  updateClearButton();
  updateBackToTop();
}

async function translateEmptyNames() {
  const missingByLanguage = languageProfiles.map((profile) => ({
    profile,
    assets: state.assets.filter((asset) => !asset.names?.[profile.locale]?.trim()),
  })).filter((entry) => entry.assets.length);

  if (!missingByLanguage.length) {
    setStatus(currentUIText().noNames);
    return;
  }

  const key = els.deeplKey.value.trim();
  if (!key) {
    for (const { profile, assets } of missingByLanguage) {
      for (const asset of assets) {
        asset.names[profile.locale] = asset.fallbackName;
        asset.status = currentUIText().noKey;
      }
    }
    setStatus(currentUIText().noKey);
    render();
    return;
  }

  els.translate.disabled = true;
  setStatus(currentUIText().translatingAll);
  try {
    for (const { profile, assets } of missingByLanguage) {
      const translations = await deeplTranslate(
        assets.map((asset) => asset.fallbackName),
        key,
        els.deeplHost.value,
        profile.targetLang
      );
      assets.forEach((asset, index) => {
        asset.names[profile.locale] = translations[index] || asset.fallbackName;
        asset.status = translations[index] ? currentUIText().translatedAll : currentUIText().noKey;
      });
    }
    setStatus(currentUIText().translatedAll);
  } catch (error) {
    state.assets.forEach((asset) => {
      asset.status = currentUIText().translateFailed;
    });
    setStatus(`${currentUIText().translateFailed}：${error.message}`);
  } finally {
    els.translate.disabled = false;
    render();
  }
}

async function deeplTranslate(texts, authKey, endpoint, targetLang) {
  const errors = [];

  try {
    return await deeplTranslateViaLocalProxy(texts, authKey, endpoint, targetLang);
  } catch (error) {
    errors.push(`本地转发失败：${error.message}`);
  }

  try {
    return await deeplTranslateDirect(texts, authKey, endpoint, targetLang);
  } catch (error) {
    errors.push(`浏览器直连失败：${error.message}`);
  }

  throw new Error(errors.join("；"));
}

async function deeplTranslateViaLocalProxy(texts, authKey, endpoint, targetLang) {
  const proxyUrl = location.protocol === "http:" || location.protocol === "https:"
    ? "/api/deepl"
    : "http://127.0.0.1:5173/api/deepl";
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texts, authKey, endpoint, targetLang }),
  });

  if (!response.ok) {
    const message = await response.text();
    if (response.status === 404 || message.trim() === "Not found") {
      throw new Error("当前本地服务不是最新版，请关闭旧的 node server.js 窗口后重新双击“启动网站.bat”");
    }
    throw new Error(message || `${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.translations || [];
}

async function deeplTranslateDirect(texts, authKey, endpoint, targetLang) {
  const body = new URLSearchParams();
  for (const text of texts) body.append("text", text);
  body.set("target_lang", targetLang);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${authKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.translations || []).map((item) => item.text);
}

async function downloadPack() {
  const namespace = normalizeNamespace(els.namespace.value);
  if (!namespace) {
    setStatus(currentUIText().namespaceRequired);
    return;
  }
  if (!state.assets.length) {
    setStatus(currentUIText().addImagesFirst);
    return;
  }

  els.download.disabled = true;
  setStatus(currentUIText().zipBuilding);
  try {
    const files = await buildPackFiles(namespace);
    const blob = makeZip(files);
    const name = ensureZipName(els.zipName.value || `${namespace}_assets.zip`);
    downloadBlob(blob, name);
    setStatus(`${currentUIText().generated} ${name}`);
  } catch (error) {
    setStatus(`${currentUIText().generationFailed}：${error.message}`);
  } finally {
    els.download.disabled = false;
  }
}

async function buildPackFiles(namespace) {
  const files = new Map();
  const cleanAssets = dedupeAssets(state.assets);
  const byType = Object.fromEntries(assetTypes.map((type) => [type.key, []]));
  cleanAssets.forEach((asset) => byType[asset.type].push(asset));

  files.set("pack.yml", textFile([
    `author: ${yamlScalar(els.author.value || "Generated")}`,
    `version: ${yamlScalar(els.version.value || "1.0")}`,
    `description: ${yamlScalar(els.description.value || "Generated assets for CraftEngine")}`,
    `namespace: ${namespace}`,
    "",
  ]));

  files.set("configuration/categories.yml", textFile(buildCategories(namespace, cleanAssets)));
  for (const profile of languageProfiles) {
    files.set(
      `configuration/langs/${profile.file}`,
      textFile(buildTranslationFile(namespace, cleanAssets, profile))
    );
  }

  if (byType.items.length) {
    files.set("configuration/items/generated_items.yml", textFile(buildItems(namespace, byType.items)));
  }
  if (byType.blocks.length) {
    files.set("configuration/blocks/generated_blocks.yml", textFile(buildBlocks(namespace, byType.blocks)));
  }
  if (byType.furniture.length) {
    files.set("configuration/furniture/generated_furniture.yml", textFile(buildFurniture(namespace, byType.furniture)));
  }
  if (byType.emoji.length) {
    files.set("configuration/emoji.yml", textFile(buildEmoji(namespace, byType.emoji)));
  }

  for (const asset of cleanAssets) {
    const type = assetTypes.find((item) => item.key === asset.type);
    const texturePath = `resourcepack/assets/minecraft/textures/${type.textureRoot}/${asset.id}.png`;
    files.set(texturePath, await imageToPngBytes(asset.file));
  }

  return files;
}

function buildCategories(namespace, assets) {
  const categoryTypes = assetTypes.filter((type) => type.key !== "emoji");
  const assetsByType = Object.fromEntries(categoryTypes.map((type) => [
    type.key,
    assets.filter((asset) => asset.type === type.key),
  ]));
  const nonEmojiAssets = assets.filter((item) => item.type !== "emoji");
  const icon = nonEmojiAssets[0] ? `${namespace}:${nonEmojiAssets[0].id}` : "minecraft:paper";
  const lines = [
    "categories:",
    `  ${namespace}:generated:`,
    "    priority: 1",
    "    name: <!i><white><l10n:category.generated.name></white>",
    "    lore:",
    "      - <!i><gray><l10n:category.generated.lore>",
    `    icon: ${icon}`,
    "    list:",
  ];
  for (const type of categoryTypes) {
    if (assetsByType[type.key].length) {
      lines.push(`      - '#${namespace}:${type.key}'`);
    }
  }
  if (!nonEmojiAssets.length) lines.push("      - minecraft:paper");

  for (const type of categoryTypes) {
    const typedAssets = assetsByType[type.key];
    if (!typedAssets.length) continue;
    lines.push(
      `  ${namespace}:${type.key}:`,
      `    name: <!i><white><l10n:category.${type.key}></white>`,
      "    hidden: true",
      `    icon: ${namespace}:${typedAssets[0].id}`,
      "    list:"
    );
    for (const asset of typedAssets) {
      lines.push(`      - ${namespace}:${asset.id}`);
    }
  }

  return lines.join("\n") + "\n";
}

function buildTranslationFile(namespace, assets, profile) {
  const lines = [
    "# Generated by CraftEngine asset generator.",
    "# Item names use <l10n:item.id> in item configuration files.",
    "translations:",
    `  ${profile.locale}:`,
  ];
  for (const asset of assets.filter((item) => item.type !== "emoji")) {
    lines.push(`    item.${asset.id}: ${yamlScalar(displayName(asset, profile.locale))}`);
  }
  for (const asset of assets.filter((item) => item.type === "blocks")) {
    lines.push(`    block_name:${namespace}:${asset.id}: ${yamlScalar(displayName(asset, profile.locale))}`);
  }
  for (const asset of assets.filter((item) => item.type === "furniture")) {
    lines.push(`    furniture.${namespace}.${asset.id}: ${yamlScalar(displayName(asset, profile.locale))}`);
  }
  lines.push(
    `    category.generated.name: ${yamlScalar(localizedCategory(profile.locale, "generatedName"))}`,
    `    category.generated.lore: ${yamlScalar(localizedCategory(profile.locale, "generatedLore"))}`,
    `    category.items: ${yamlScalar(localizedCategory(profile.locale, "items"))}`,
    `    category.blocks: ${yamlScalar(localizedCategory(profile.locale, "blocks"))}`,
    `    category.furniture: ${yamlScalar(localizedCategory(profile.locale, "furniture"))}`
  );
  return lines.join("\n") + "\n";
}

function buildItems(namespace, assets) {
  const lines = ["items:"];
  for (const asset of assets) {
    lines.push(
      `  ${namespace}:${asset.id}:`,
      "    data:",
      `      item_name: ${l10nItemName(asset.id)}`,
      `    texture: minecraft:item/generated/${asset.id}`
    );
  }
  return lines.join("\n") + "\n";
}

function buildBlocks(namespace, assets) {
  const lines = ["items:"];
  for (const asset of assets) {
    lines.push(
      `  ${namespace}:${asset.id}:`,
      "    data:",
      `      item_name: ${l10nItemName(asset.id)}`,
      `    model: minecraft:block/generated/${asset.id}`,
      "    behavior:",
      "      type: block_item",
      `      block: ${namespace}:${asset.id}`
    );
  }

  lines.push("blocks:");
  for (const asset of assets) {
    lines.push(
      `  ${namespace}:${asset.id}:`,
      "    loot:",
      "      template: default:loot_table/self",
      ...blockSettingsLines(asset),
      "    state:",
      "      auto_state: solid",
      `      texture: minecraft:block/generated/${asset.id}`
    );
  }
  return lines.join("\n") + "\n";
}

function blockSettingsLines(asset) {
  const isDeepslate = asset.id.includes("deepslate");
  const stoneType = isDeepslate ? "deepslate" : "stone";
  const hardnessTemplate = isDeepslate ? "default:hardness/deepslate" : "default:hardness/stone";
  const soundTemplate = isDeepslate ? "default:sound/deepslate" : "default:sound/stone";
  return [
    "    settings:",
    "      template:",
    `        - ${soundTemplate}`,
    `        - ${hardnessTemplate}`,
    "        - default:settings/solid_1x1x1",
    "      overrides:",
    "        instrument: basedrum",
    `        map_color: ${stoneType}`,
    "        tags:",
    "          - minecraft:mineable/pickaxe",
  ];
}

function buildFurniture(namespace, assets) {
  const lines = ["items:"];
  for (const asset of assets) {
    lines.push(
      `  ${namespace}:${asset.id}:`,
      "    data:",
      `      item_name: ${l10nItemName(asset.id)}`,
      `    texture: minecraft:item/generated/${asset.id}`,
      "    behavior:",
      "      type: furniture_item",
      "      rules:",
      "        ground:",
      "          rotation: four",
      "          alignment: center",
      "      furniture:",
      "        settings:",
      `          item: ${namespace}:${asset.id}`,
      "          hit_times: 3",
      "          sounds:",
      "            break: minecraft:block.wood.break",
      "            place: minecraft:block.wood.place",
      "            hit: minecraft:block.wood.hit",
      "        variants:",
      "          ground:",
      "            loot_spawn_offset: 0.5,0.5,0",
      "            elements:",
      `              - item: ${namespace}:${asset.id}`,
      "                display_transform: none",
      "                billboard: fixed",
      "                position: 0.5,0,0",
      "                translation: 0,0.5,0",
      "                shadow_radius: 0.6",
      "                shadow_strength: 0.2",
      "            hitboxes:",
      "              - type: interaction",
      "                position: 0,0,0",
      "                width: 0.8",
      "                height: 0.8",
      "                interactive: true",
      "                blocks_building: true",
      "        loot:",
      "          template: default:loot_table/furniture",
      "          arguments:",
      `            item: ${namespace}:${asset.id}`
    );
  }
  return lines.join("\n") + "\n";
}

function buildEmoji(namespace, assets) {
  const lines = [
    "images:",
  ];
  for (const asset of assets) {
    lines.push(
      `  ${namespace}:${asset.id}:`,
      "    height: 11",
      "    ascent: 9",
      "    font: minecraft:default",
      `    file: minecraft:font/image/generated/${asset.id}.png`
    );
  }

  lines.push(
    "templates:",
    `  ${namespace}:emoji/basic:`,
    "    content: <!shadow><white><arg:emoji></white></!shadow>",
    "    content_overrides:",
    "      chat: <hover:show_text:'<arg:keyword>'><!shadow><white><arg:emoji></white></!shadow></hover>",
    "      book: <hover:show_text:'<arg:keyword>'><!shadow><white><arg:emoji></white></!shadow></hover>",
    "      anvil: <!i><!shadow><white><arg:emoji></white></!shadow></!i>",
    "emoji:"
  );

  for (const asset of assets) {
    lines.push(
      `  ${namespace}:emoji_${asset.id}:`,
      `    template: ${namespace}:emoji/basic`,
      "    overrides:",
      `      image: ${namespace}:${asset.id}`,
      `      permission: emoji.${asset.id}`,
      "      keywords:"
    );
    lines.push(`        - ${yamlScalar(keywordForId(asset.id))}`);
  }
  return lines.join("\n") + "\n";
}

function dedupeAssets(assets) {
  const seen = new Set();
  return assets.map((asset) => {
    let id = normalizeId(asset.id || asset.fallbackName);
    if (!id) id = "asset";
    const original = id;
    let index = 2;
    while (seen.has(id)) {
      id = `${original}_${index}`;
      index += 1;
    }
    seen.add(id);
    return { ...asset, id };
  });
}

function clearAll() {
  if (!state.assets.length) {
    resetClearConfirm();
    setStatus(currentUIText().noImages);
    return;
  }

  if (Date.now() < state.clearConfirmUntil) {
    for (const asset of state.assets) URL.revokeObjectURL(asset.url);
    state.assets = [];
    resetClearConfirm();
    setStatus(currentUIText().cleared);
    render();
    return;
  }

  state.clearConfirmUntil = Date.now() + 3200;
  updateClearButton();
  setStatus(currentUIText().clearConfirmTooltip);
  if (clearConfirmTimer) clearTimeout(clearConfirmTimer);
  clearConfirmTimer = setTimeout(() => {
    resetClearConfirm();
    render();
  }, 3200);
}

function resetClearConfirm() {
  state.clearConfirmUntil = 0;
  if (clearConfirmTimer) clearTimeout(clearConfirmTimer);
  clearConfirmTimer = null;
  updateClearButton();
}

function updateClearButton() {
  const text = currentUIText();
  const confirming = Date.now() < state.clearConfirmUntil;
  els.clear.textContent = confirming ? text.clearConfirm : text.clear;
  els.clear.title = confirming ? text.clearConfirmTooltip : text.clearTooltip;
  els.clear.setAttribute("aria-label", els.clear.title);
  els.clear.classList.toggle("confirming", confirming);
}

function typeLabel(type) {
  return assetTypes.find((item) => item.key === type)?.label || type;
}

function normalizeNamespace(value) {
  return normalizeId(value).replace(/^_+|_+$/g, "");
}

function normalizeId(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
  if (!normalized) return "";
  return /^[0-9]/.test(normalized) ? `asset_${normalized}` : normalized;
}

function uniqueId(base, existing) {
  let id = base || "asset";
  const original = id;
  let index = 2;
  while (existing.has(id)) {
    id = `${original}_${index}`;
    index += 1;
  }
  return id;
}

function humanizeName(value) {
  const trimmed = String(value || "").trim();
  if (/[\u4e00-\u9fff]/.test(trimmed)) return trimmed.replace(/[_-]+/g, " ");
  return trimmed
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function createNames(fallbackName) {
  return {
    en_us: "",
    zh_cn: "",
    zh_tw: "",
  };
}

function currentLanguageProfile() {
  return languageProfiles.find((profile) => profile.locale === state.language) || languageProfiles[0];
}

function cycleLanguage() {
  const index = languageProfiles.findIndex((profile) => profile.locale === state.language);
  state.language = languageProfiles[(index + 1) % languageProfiles.length].locale;
  applyUIText();
  renderDropZones();
  renderFilters();
  render();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("ceTheme", state.theme);
  applyTheme();
  render();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
}

function currentUIText() {
  return uiText[state.language] || uiText.zh_cn;
}

function applyUIText() {
  const text = currentUIText();
  document.documentElement.lang = state.language.replace("_", "-");
  document.title = text.appTitle;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (text[key]) element.textContent = text[key];
  });
  els.status.textContent = text.waiting;
  updateClearButton();
}

function localizedTypeLabel(type) {
  return type.labels?.[state.language] || type.labels?.zh_cn || type.key;
}

function localizedTypeHint(type) {
  return type.hints?.[state.language] || type.hints?.zh_cn || "";
}

function languageIcon() {
  if (state.language === "en_us") return "A";
  if (state.language === "zh_tw") return "繁";
  return "简";
}

function updateBackToTop() {
  const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
  const showThreshold = Math.max(426, window.innerHeight * 0.57);
  const visible = scrollableDistance > 520 && window.scrollY > showThreshold;
  els.backToTop.hidden = false;
  els.backToTop.classList.toggle("visible", visible);
  els.backToTop.classList.toggle("above-notice", visible && !els.notice.hidden);
}

function smoothScrollToTop() {
  const start = window.scrollY;
  const duration = Math.min(720, Math.max(320, start * 0.45));
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, Math.round(start * (1 - eased)));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function nameForEdit(asset) {
  return asset.names?.[state.language] || "";
}

function displayName(asset, locale) {
  if (locale === "zh_tw") return asset.names?.zh_tw?.trim() || asset.names?.zh_cn?.trim() || asset.fallbackName || asset.id;
  if (locale === "zh_cn") return asset.names?.zh_cn?.trim() || asset.fallbackName || asset.id;
  return asset.names?.en_us?.trim() || asset.fallbackName || asset.id;
}

function localizedCategory(locale, key) {
  const values = {
    en_us: {
      generatedName: "Generated Assets",
      generatedLore: "Created by local generator",
      items: "Items",
      blocks: "Blocks",
      furniture: "Furniture",
    },
    zh_cn: {
      generatedName: "生成资产",
      generatedLore: "由本地生成器创建",
      items: "物品",
      blocks: "方块",
      furniture: "家具",
    },
    zh_tw: {
      generatedName: "生成資產",
      generatedLore: "由本地生成器建立",
      items: "物品",
      blocks: "方塊",
      furniture: "家具",
    },
  };
  return values[locale]?.[key] || values.en_us[key];
}

function l10nItemName(id) {
  return JSON.stringify(`<l10n:item.${id}>`);
}

function keywordForId(id) {
  return `:${id}:`;
}

async function imageToPngBytes(file) {
  if (file.type === "image/png") return new Uint8Array(await file.arrayBuffer());

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0);
  if (typeof bitmap.close === "function") bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("图片转换 PNG 失败"));
    }, "image/png");
  });

  return new Uint8Array(await blob.arrayBuffer());
}

function yamlScalar(value) {
  const text = String(value ?? "");
  if (!text) return "''";
  if (/^[A-Za-z0-9_./:#<>\-]+$/.test(text) && !text.includes(": ")) return text;
  return JSON.stringify(text);
}

function textFile(text) {
  return new TextEncoder().encode(text);
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setStatus(message) {
  els.status.textContent = message;
}

function ensureZipName(name) {
  return name.toLowerCase().endsWith(".zip") ? name : `${name}.zip`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function makeZip(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const [path, data] of files) {
    const name = encoder.encode(path.replace(/\\/g, "/"));
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const crc = crc32(bytes);
    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    writeHeader(localView, 0x04034b50);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime(), true);
    localView.setUint16(12, dosDate(), true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, bytes.length, true);
    localView.setUint32(22, bytes.length, true);
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    chunks.push(local, bytes);

    const centralHeader = new Uint8Array(46 + name.length);
    const centralView = new DataView(centralHeader.buffer);
    writeHeader(centralView, 0x02014b50);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime(), true);
    centralView.setUint16(14, dosDate(), true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, bytes.length, true);
    centralView.setUint32(24, bytes.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(name, 46);
    central.push(centralHeader);
    offset += local.length + bytes.length;
  }

  const centralOffset = offset;
  let centralSize = 0;
  for (const entry of central) {
    chunks.push(entry);
    centralSize += entry.length;
  }

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  writeHeader(endView, 0x06054b50);
  endView.setUint16(8, central.length, true);
  endView.setUint16(10, central.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);
  chunks.push(end);

  return new Blob(chunks, { type: "application/zip" });
}

function writeHeader(view, value) {
  view.setUint32(0, value, true);
}

function dosTime(date = new Date()) {
  return (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
}

function dosDate(date = new Date()) {
  return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

init();
