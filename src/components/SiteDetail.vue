<script setup lang="ts">
import type { Site } from '../types/site';
import { CATEGORIES, STRATEGY_LABELS } from '../data/config';

defineProps<{ site: Site }>();
const emit = defineEmits<{ close: [] }>();

function getCategoryInfo(key: string) {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
}

function getStrategyColor(strategy: string): string {
  const colors: Record<string, string> = {
    public: '#22c55e',
    cookie: '#f59e0b',
    ui: '#ec4899',
    intercept: '#06b6d4',
    local: '#8b5cf6',
  };
  return colors[strategy] || '#6b7280';
}

function getStrategyBg(strategy: string): string {
  return getStrategyColor(strategy) + '18';
}

function closeOnOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close');
  }
}
</script>

<template>
  <div class="modal-overlay" @click="closeOnOverlay">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-brand">
          <div class="modal-icon">{{ site.emoji }}</div>
          <div>
            <h2 class="modal-title">{{ site.name }}</h2>
            <div class="modal-meta">
              <span
                class="cat-badge"
                :style="{ background: getCategoryInfo(site.category).color + '20', color: getCategoryInfo(site.category).color }"
              >
                {{ getCategoryInfo(site.category).icon }} {{ getCategoryInfo(site.category).label }}
              </span>
              <span class="meta-text">{{ site.site }} · {{ site.commandCount }} 条命令</span>
            </div>
          </div>
        </div>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div class="section">
          <h3 class="section-title">命令列表</h3>
          <div class="cmd-list">
            <div v-for="cmd in site.commands" :key="cmd.name" class="cmd-item">
              <div class="cmd-header">
                <code class="cmd-name">opencli {{ cmd.site }} {{ cmd.name }}</code>
                <div class="cmd-badges">
                  <span
                    class="strategy-badge"
                    :style="{ color: getStrategyColor(cmd.strategy), background: getStrategyBg(cmd.strategy) }"
                  >
                    {{ STRATEGY_LABELS[cmd.strategy] || cmd.strategy }}
                  </span>
                  <span v-if="cmd.browser" class="strategy-badge" style="color: #6366f1; background: #6366f118">
                    浏览器
                  </span>
                </div>
              </div>
              <p class="cmd-desc">{{ cmd.description }}</p>
              <div v-if="cmd.example" class="cmd-example">
                <span class="example-label">示例：</span>
                <code>{{ cmd.example }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  max-width: 720px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalIn 0.25s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 24px 24px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.modal-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 52px;
  height: 52px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.cat-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}

.meta-text {
  font-size: 13px;
  color: var(--text-muted);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 28px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--text);
}

.modal-body {
  padding: 20px 24px 24px;
  overflow-y: auto;
  flex: 1;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 14px;
}

.cmd-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cmd-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  transition: border-color 0.2s;
}

.cmd-item:hover {
  border-color: var(--border-hover);
}

.cmd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.cmd-name {
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  background: var(--bg-elevated);
  padding: 3px 8px;
  border-radius: 5px;
}

.cmd-badges {
  display: flex;
  gap: 6px;
}

.strategy-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.cmd-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.cmd-example {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--bg-elevated);
  border-radius: 6px;
  font-size: 12px;
}

.cmd-example code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--accent);
}

.example-label {
  color: var(--text-muted);
  margin-right: 6px;
}

/* Scrollbar */
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>