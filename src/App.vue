<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Site, CategoryKey, Command } from './types/site';
import { CATEGORIES, SITE_NAMES, SITE_EMOJIS, SITE_CATS } from './data/config';
import SiteCard from './components/SiteCard.vue';
import SiteDetail from './components/SiteDetail.vue';

const sites = ref<Site[]>([]);
const searchQuery = ref('');
const selectedCategory = ref<CategoryKey | 'all'>('all');
const selectedSite = ref<Site | null>(null);
const loading = ref(true);
const error = ref('');

const lastUpdated = __BUILD_TIME__;
const copied = ref(false);

function copyWechat() {
  navigator.clipboard.writeText('a158566566').then(() => {
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  });
}

onMounted(async () => {
  try {
    const res = await fetch('./data.json');
    if (!res.ok) throw new Error('Failed to load data');
    const data: Command[] = await res.json();

    // Group by site
    const grouped = new Map<string, Site>();
    data.forEach(cmd => {
      const s = cmd.site;
      if (!grouped.has(s)) {
        grouped.set(s, {
          site: s,
          name: SITE_NAMES[s] || s,
          emoji: SITE_EMOJIS[s] || '🔹',
          category: (SITE_CATS[s] || 'other') as CategoryKey,
          commands: [],
          strategies: [],
          commandCount: 0,
          desc: '',
        });
      }
      const site = grouped.get(s)!;
      site.commands.push(cmd);
      if (!site.strategies.includes(cmd.strategy)) {
        site.strategies.push(cmd.strategy);
      }
    });

    sites.value = Array.from(grouped.values()).map(s => ({
      ...s,
      commandCount: s.commands.length,
      desc: s.commands[0]?.description?.substring(0, 120) || '',
      strategies: s.strategies,
    })).sort((a, b) => b.commandCount - a.commandCount);

    loading.value = false;
  } catch (e) {
    error.value = String(e);
    loading.value = false;
  }
});

const filteredSites = computed(() => {
  return sites.value.filter(site => {
    if (selectedCategory.value !== 'all' && site.category !== selectedCategory.value) {
      return false;
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return site.name.toLowerCase().includes(q) ||
             site.site.toLowerCase().includes(q) ||
             site.commands.some(c =>
               c.name.toLowerCase().includes(q) ||
               (c.description && c.description.toLowerCase().includes(q))
             );
    }
    return true;
  });
});

const categoryStats = computed(() => {
  return CATEGORIES.map(cat => ({
    ...cat,
    count: sites.value.filter(s => s.category === cat.key).length,
  }));
});

const totalPublic = computed(() =>
  sites.value.reduce((sum, s) => sum + s.commands.filter(c => c.strategy === 'public').length, 0)
);

function selectCategory(cat: CategoryKey | 'all') {
  selectedCategory.value = cat;
}

function openDetail(site: Site) {
  selectedSite.value = site;
}

function closeDetail() {
  selectedSite.value = null;
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-icon">⚡</div>
          <div>
            <h1>OpenCLI Gallery</h1>
            <p class="subtitle">162 站点 · 1050 命令 · 按场景分类浏览</p>
          </div>
        </div>
        <div class="stats">
          <div class="stat">
            <div class="stat-value">{{ sites.length }}</div>
            <div class="stat-label">站点</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ sites.reduce((s, x) => s + x.commandCount, 0) }}</div>
            <div class="stat-label">命令</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #22c55e">{{ totalPublic }}</div>
            <div class="stat-label">免登录</div>
          </div>
        </div>
      </div>
    </header>

    <div class="controls">
      <div class="container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索站点、命令、描述..."
          />
        </div>
        <div class="filter-tags">
          <button
            class="filter-tag"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectCategory('all')"
          >
            全部
          </button>
          <button
            v-for="cat in categoryStats"
            :key="cat.key"
            class="filter-tag"
            :class="{ active: selectedCategory === cat.key }"
            :style="selectedCategory === cat.key ? { background: cat.color, borderColor: cat.color } : {}"
            @click="selectCategory(cat.key)"
          >
            {{ cat.icon }} {{ cat.label }}
            <span class="cat-count">{{ cat.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <main class="container">
      <div v-if="loading" class="empty">
        <div class="empty-icon">⏳</div>
        <p>加载中...</p>
      </div>
      <div v-else-if="error" class="empty">
        <div class="empty-icon">❌</div>
        <p>{{ error }}</p>
      </div>
      <div v-else class="gallery">
        <SiteCard
          v-for="site in filteredSites"
          :key="site.site"
          :site="site"
          @click="openDetail(site)"
        />
      </div>
      <div v-if="!loading && !error && filteredSites.length === 0" class="empty" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <p>没有找到匹配的站点</p>
      </div>
    </main>

    <!-- 作者区域 -->
    <section class="author-section">
      <div class="container">
        <div class="author-card">
          <div class="author-avatar">杨</div>
          <div class="author-info">
            <h3>杨京艺 · OpenCLI 导航</h3>
            <p class="author-desc">前 SaaS 销售 / 探索 AI 工具、Agent、MCP、Skill</p>
          </div>
        </div>

        <div class="social-links">
          <a href="https://github.com/yang1996202-cpu/opencli-gallery" target="_blank" class="social-link">
            <span class="social-icon">⭐</span>
            <div>
              <div class="social-name">GitHub</div>
              <div class="social-handle">给项目点个 Star</div>
            </div>
          </a>
          <a href="https://github.com/yang1996202-cpu" target="_blank" class="social-link">
            <span class="social-icon">🐙</span>
            <div>
              <div class="social-name">GitHub</div>
              <div class="social-handle">yang1996202-cpu</div>
            </div>
          </a>
          <div class="social-link" @click="copyWechat" style="cursor: pointer;">
            <span class="social-icon">💬</span>
            <div>
              <div class="social-name">微信（点击复制）</div>
              <div class="social-handle">a158566566</div>
            </div>
            <span v-if="copied" class="copy-tip">已复制!</span>
          </div>
          <div class="social-link wechat-official">
            <span class="social-icon">📢</span>
            <div>
              <div class="social-name">公众号</div>
              <div class="social-handle">二哥的进化论</div>
            </div>
          </div>
        </div>

        <a
          href="https://github.com/yang1996202-cpu/opencli-gallery"
          target="_blank"
          class="star-btn"
        >
          ⭐ 给项目点个 Star
        </a>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-inner">
        <p>
          共 {{ filteredSites.length }} 个站点 |
          来源：opencli list |
          最后更新：{{ lastUpdated }}
        </p>
        <p class="footer-links">
          <a href="https://github.com/yang1996202-cpu/opencli-gallery" target="_blank">GitHub</a>
          <span>·</span>
          <span>杨京艺</span>
          <span>·</span>
          <span>v1.0.0</span>
        </p>
      </div>
    </footer>

    <SiteDetail
      v-if="selectedSite"
      :site="selectedSite"
      @close="closeDetail"
    />
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #0a0a0f;
  --bg-elevated: #12121a;
  --bg-card: #181820;
  --bg-card-hover: #1e1e28;
  --border: #252530;
  --border-hover: #353540;
  --text: #e8e8f0;
  --text-secondary: #9a9aa8;
  --text-muted: #6a6a78;
  --accent: #6366f1;
  --radius: 14px;
  --radius-sm: 10px;
}

body {
  font-family: 'Inter', 'Noto Sans SC', -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 1px solid var(--border);
  padding: 40px 0 32px;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.brand h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #e8e8f0, #a5a5c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

.stats {
  display: flex;
  gap: 28px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 28px;
}

.stat { text-align: center; }
.stat-value {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 2px;
}

/* Controls */
.controls {
  position: sticky;
  top: 0;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 20px 0;
  z-index: 100;
}

.search-box {
  position: relative;
  max-width: 420px;
  margin-bottom: 14px;
}

.search-box input {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px 12px 44px;
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
}

.search-box input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.search-box input::placeholder { color: var(--text-muted); }

.search-box::before {
  content: "🔍";
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  opacity: 0.4;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tag:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.filter-tag.active {
  color: white;
  font-weight: 600;
}

.cat-count {
  font-size: 11px;
  opacity: 0.7;
  background: rgba(255,255,255,0.1);
  padding: 1px 6px;
  border-radius: 8px;
}

/* Gallery */
.gallery {
  padding: 28px 0 60px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 16px;
}

/* Empty */
.empty {
  text-align: center;
  padding: 100px 24px;
  color: var(--text-muted);
  grid-column: 1 / -1;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 24px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }

/* Author Section */
.author-section {
  border-top: 1px solid var(--border);
  padding: 40px 0 32px;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%);
}

.author-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
}

.author-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.author-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.author-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  position: relative;
}

.social-link:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
}

.social-icon {
  width: 36px;
  height: 36px;
  background: var(--bg-elevated);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.social-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.social-handle {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.copy-tip {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #22c55e;
  font-weight: 600;
}

.star-btn {
  display: block;
  max-width: 360px;
  margin: 0 auto;
  text-align: center;
  padding: 14px 24px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.star-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--accent);
}

.footer-links span {
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .header-inner { flex-direction: column; }
  .stats { width: 100%; justify-content: space-around; }
  .brand h1 { font-size: 22px; }
  .gallery { grid-template-columns: 1fr; }
  .social-links { grid-template-columns: 1fr; }
}
</style>