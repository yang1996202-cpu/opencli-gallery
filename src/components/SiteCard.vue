<script setup lang="ts">
import type { Site } from '../types/site';
import { CATEGORIES, STRATEGY_LABELS } from '../data/config';

defineProps<{ site: Site }>();
defineEmits<{ click: [] }>();

function getCategoryColor(key: string): string {
  return CATEGORIES.find(c => c.key === key)?.color || '#94a3b8';
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
</script>

<template>
  <div class="site-card" @click="$emit('click')">
    <div class="card-accent" :style="{ background: getCategoryColor(site.category) }"></div>

    <div class="card-header">
      <div class="card-icon">{{ site.emoji }}</div>
      <div class="card-info">
        <h3 class="card-title">{{ site.name }}</h3>
        <span class="card-site">{{ site.site }}</span>
      </div>
      <span class="cmd-count">{{ site.commandCount }} 命令</span>
    </div>

    <p class="card-desc">{{ site.desc }}</p>

    <div class="cmd-preview">
      <span
        v-for="cmd in site.commands.slice(0, 4)"
        :key="cmd.name"
        class="cmd-tag"
      >
        {{ cmd.name }}
      </span>
      <span v-if="site.commands.length > 4" class="cmd-tag more">
        +{{ site.commands.length - 4 }}
      </span>
    </div>

    <div class="card-footer">
      <div class="strategy-tags">
        <span
          v-for="s in site.strategies"
          :key="s"
          class="strategy-badge"
          :style="{
            color: getStrategyColor(s),
            background: getStrategyColor(s) + '18'
          }"
        >
          {{ STRATEGY_LABELS[s] || s }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.site-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity 0.2s;
}

.site-card:hover .card-accent {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-site {
  font-size: 12px;
  color: var(--text-muted);
}

.cmd-count {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 3px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.cmd-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.cmd-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.cmd-tag.more {
  background: transparent;
  border-style: dashed;
  color: var(--text-muted);
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.strategy-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.strategy-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>