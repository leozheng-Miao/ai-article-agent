<template>
  <div class="article-detail-page">
    <div class="page-container">

      <!-- 顶部操作栏 -->
      <div class="top-bar">
        <button class="back-btn" @click="goBack">
          <ArrowLeftOutlined />
          <span>返回</span>
        </button>
        <div class="top-actions">
          <button class="action-btn" @click="copyContent" :class="{ copied: isCopied }">
            <CheckOutlined v-if="isCopied" />
            <CopyOutlined v-else />
            <span>{{ isCopied ? '已复制' : '复制全文' }}</span>
          </button>
          <button class="action-btn primary" @click="exportMarkdown">
            <DownloadOutlined />
            <span>导出 Markdown</span>
          </button>
        </div>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="skeleton-wrap">
        <div class="sk-hero">
          <div class="sk-block sk-title"></div>
          <div class="sk-block sk-subtitle"></div>
          <div class="sk-block sk-meta"></div>
        </div>
        <div class="sk-divider"></div>
        <div class="sk-body">
          <div v-for="i in 8" :key="i" class="sk-block sk-line" :style="{ width: `${70 + Math.random() * 30}%` }"></div>
        </div>
      </div>

      <!-- 主内容 -->
      <article v-else-if="article" class="article-card">

        <!-- 文章头部 -->
        <header class="article-header">
          <div class="header-meta">
            <span class="status-pill" :class="article.status?.toLowerCase()">
              <span class="status-dot"></span>
              {{ getStatusText(article.status) }}
            </span>
            <span class="meta-time">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              {{ formatDate(article.createTime) }}
            </span>
            <span v-if="article.images?.length" class="meta-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              {{ article.images.length }} 张配图
            </span>
          </div>

          <h1 class="article-main-title">{{ article.mainTitle }}</h1>
          <p class="article-sub-title">{{ article.subTitle }}</p>
        </header>

        <!-- 分隔线 -->
        <div class="article-divider"></div>

        <!-- 大纲（可折叠） -->
        <section v-if="article.outline && article.outline.length > 0" class="outline-section">
          <div class="section-header" @click="outlineExpanded = !outlineExpanded">
            <div class="section-title-row">
              <div class="section-icon outline-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <h2 class="section-title">文章大纲</h2>
              <span class="outline-count">{{ article.outline.length }} 个章节</span>
            </div>
            <div class="toggle-btn" :class="{ expanded: outlineExpanded }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>

          <transition name="outline-collapse">
            <div v-show="outlineExpanded" class="outline-body">
              <div class="outline-grid">
                <div
                    v-for="item in article.outline"
                    :key="item.section"
                    class="outline-card"
                >
                  <div class="outline-num">{{ item.section }}</div>
                  <div class="outline-content">
                    <div class="outline-card-title">{{ item.title }}</div>
                    <ul class="outline-points">
                      <li v-for="(point, idx) in item.points" :key="idx">{{ point }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </section>

        <div class="article-divider light"></div>

        <!-- ✅ 核心修复：优先使用 fullContent（已包含图片），fallback 到 content -->
        <section class="content-section">
          <div class="section-header no-toggle">
            <div class="section-title-row">
              <div class="section-icon content-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <h2 class="section-title">文章正文</h2>
              <span class="outline-count">{{ wordCount }} 字</span>
            </div>
          </div>

          <!--
            关键修复说明：
            fullContent = 后端 mergeImagesIntoContent() 生成的，已将图片以 ![desc](url) 形式嵌入正文
            content     = 仅文字，图片占位符未替换
            应优先使用 fullContent，图片会在正文对应位置渲染
          -->
          <div
              v-html="markdownToHtml(article.fullContent || article.content || '')"
              class="markdown-body"
          ></div>
        </section>

        <!-- 配图索引（附加展示，仅在有图时显示，作为补充索引） -->
        <template v-if="article.images && article.images.length > 0">
          <div class="article-divider light"></div>
          <section class="images-section">
            <div class="section-header no-toggle">
              <div class="section-title-row">
                <div class="section-icon images-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <h2 class="section-title">配图索引</h2>
                <span class="outline-count">{{ article.images.length }} 张</span>
              </div>
            </div>
            <div class="images-grid">
              <div
                  v-for="image in article.images"
                  :key="image.position"
                  class="image-card"
                  @click="openImagePreview(image.url)"
              >
                <div class="image-thumb-wrap">
                  <img :src="image.url" :alt="image.description || '配图'" loading="lazy" />
                  <div class="image-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
                <div class="image-meta">
                  <div class="image-meta-left">
                    <span class="position-badge">P{{ image.position }}</span>
                    <span class="method-badge" :class="getMethodClass(image.method)">{{ image.method }}</span>
                  </div>
                  <span v-if="image.sectionTitle" class="image-section-label">{{ image.sectionTitle }}</span>
                </div>
              </div>
            </div>
          </section>
        </template>

      </article>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <p class="empty-text">文章不存在或已被删除</p>
        <button class="back-btn" @click="goBack">返回列表</button>
      </div>
    </div>

    <!-- 图片预览遮罩 -->
    <transition name="fade">
      <div v-if="previewUrl" class="image-preview-mask" @click="previewUrl = ''">
        <img :src="previewUrl" alt="预览" @click.stop />
        <button class="preview-close" @click="previewUrl = ''">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, DownloadOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { getArticle, type ArticleVO } from '@/api/articleController'
import { marked } from 'marked'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const article = ref<ArticleVO | null>(null)
const outlineExpanded = ref(true)
const isCopied = ref(false)
const previewUrl = ref('')

// 字数统计（基于 fullContent 或 content）
const wordCount = computed(() => {
  const text = article.value?.fullContent || article.value?.content || ''
  return text.replace(/!\[.*?\]\(.*?\)/g, '').replace(/[#*>`\-_\[\]]/g, '').trim().length
})

// Markdown 转 HTML
const markdownToHtml = (markdown: string) => {
  if (!markdown) return ''
  return marked(markdown) as string
}

// 加载文章
const loadArticle = async () => {
  const taskId = route.params.taskId as string
  if (!taskId) { message.error('文章ID不存在'); return }
  loading.value = true
  try {
    const res = await getArticle({ taskId })
    article.value = res.data.data
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()

// 复制全文
const copyContent = async () => {
  const content = article.value?.fullContent || article.value?.content || ''
  try {
    await navigator.clipboard.writeText(content)
    isCopied.value = true
    message.success('已复制到剪贴板')
    setTimeout(() => (isCopied.value = false), 2000)
  } catch {
    message.error('复制失败')
  }
}

// 导出 Markdown
const exportMarkdown = () => {
  if (!article.value) return
  let md = `# ${article.value.mainTitle}\n\n> ${article.value.subTitle}\n\n`
  if (article.value.outline?.length) {
    md += `## 目录\n\n`
    article.value.outline.forEach(item => { md += `${item.section}. ${item.title}\n` })
    md += `\n---\n\n`
  }
  md += article.value.fullContent || article.value.content || ''
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${article.value.mainTitle}.md`
  a.click()
  URL.revokeObjectURL(url)
  message.success('导出成功')
}

// 图片预览
const openImagePreview = (url: string) => { previewUrl.value = url }

// 工具函数
const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')

const getStatusText = (status: string) => {
  return ({ PENDING: '等待中', PROCESSING: '生成中', COMPLETED: '已完成', FAILED: '失败' })[status] || status
}

const getMethodClass = (method: string) => {
  const map: Record<string, string> = {
    PEXELS: 'method-pexels',
    NANO_BANANA: 'method-ai',
    MERMAID: 'method-mermaid',
    ICONIFY: 'method-icon',
    SVG_DIAGRAM: 'method-svg',
    EMOJI_PACK: 'method-emoji',
  }
  return map[method] || 'method-default'
}

onMounted(loadArticle)
</script>

<style scoped lang="scss">
// ─── Tokens ───────────────────────────────────────────────────────
$green: #22C55E;
$green-dark: #16A34A;
$green-light: #DCFCE7;
$green-mid: rgba(34, 197, 94, 0.1);
$text: #111827;
$text-sub: #6B7280;
$text-muted: #9CA3AF;
$border: #E5E7EB;
$border-light: #F3F4F6;
$bg: #F9FAFB;
$white: #ffffff;
$shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
$shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04);
$shadow-lg: 0 12px 40px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.06);

// ─── Shell ────────────────────────────────────────────────────────
.article-detail-page {
  min-height: 100vh;
  background: $bg;
  padding: 28px 24px 64px;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

.page-container {
  max-width: 860px;
  margin: 0 auto;
}

// ─── Top Bar ──────────────────────────────────────────────────────
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: $white;
  border: 1px solid $border;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: $text-sub;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: $shadow-sm;

  &:hover {
    border-color: $green;
    color: $green-dark;
    background: $green-mid;
  }
}

.top-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid $border;
  background: $white;
  color: $text-sub;
  box-shadow: $shadow-sm;

  &:hover {
    border-color: $green;
    color: $green-dark;
    background: $green-mid;
  }

  &.copied {
    border-color: $green;
    color: $green-dark;
    background: $green-light;
  }

  &.primary {
    background: linear-gradient(135deg, $green, $green-dark);
    border-color: transparent;
    color: white;
    box-shadow: 0 3px 10px rgba(34, 197, 94, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(34, 197, 94, 0.4);
      background: linear-gradient(135deg, $green, $green-dark);
      color: white;
    }
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────
.skeleton-wrap {
  background: $white;
  border-radius: 20px;
  padding: 40px 48px;
  box-shadow: $shadow-md;
}

.sk-hero { margin-bottom: 32px; }

.sk-block {
  background: linear-gradient(90deg, $border-light 25%, #e9ecef 50%, $border-light 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 8px;
  margin-bottom: 14px;
}

.sk-title { height: 36px; width: 65%; }
.sk-subtitle { height: 20px; width: 45%; }
.sk-meta { height: 14px; width: 30%; }
.sk-divider { height: 1px; background: $border-light; margin: 28px 0; }
.sk-line { height: 14px; margin-bottom: 12px; }

// ─── Article Card ─────────────────────────────────────────────────
.article-card {
  background: $white;
  border-radius: 20px;
  box-shadow: $shadow-md;
  overflow: hidden;
}

// ─── Article Header ───────────────────────────────────────────────
.article-header {
  padding: 40px 48px 32px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  &.completed { background: $green-light; color: $green-dark; }
  &.processing { background: rgba(59, 130, 246, 0.1); color: #1d4ed8; }
  &.pending { background: $border-light; color: $text-sub; }
  &.failed { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
}

.meta-time, .meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: $text-muted;
}

.article-main-title {
  font-size: 30px;
  font-weight: 800;
  color: $text;
  margin: 0 0 12px;
  line-height: 1.3;
  letter-spacing: -0.6px;
}

.article-sub-title {
  font-size: 16px;
  color: $text-sub;
  margin: 0;
  line-height: 1.6;
}

// ─── Dividers ─────────────────────────────────────────────────────
.article-divider {
  height: 1px;
  background: $border;
  margin: 0 48px;

  &.light { background: $border-light; }
}

// ─── Section Commons ──────────────────────────────────────────────
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 48px 0;
  cursor: pointer;
  user-select: none;

  &.no-toggle { cursor: default; padding-bottom: 20px; }
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.outline-icon { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
  &.content-icon { background: $green-mid; color: $green-dark; }
  &.images-icon { background: rgba(245, 158, 11, 0.1); color: #d97706; }
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: $text;
  margin: 0;
  letter-spacing: -0.2px;
}

.outline-count {
  font-size: 12px;
  color: $text-muted;
  background: $border-light;
  padding: 2px 8px;
  border-radius: 20px;
}

.toggle-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: $bg;
  border: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  transition: all 0.2s;
  flex-shrink: 0;

  svg { transition: transform 0.2s; }
  &.expanded svg { transform: rotate(180deg); }

  &:hover { background: $green-mid; border-color: $green; color: $green-dark; }
}

// ─── Outline ──────────────────────────────────────────────────────
.outline-section { padding-bottom: 28px; }

.outline-body { padding: 16px 48px 0; }

.outline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.outline-card {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: $bg;
  border: 1px solid $border;
  border-radius: 12px;
  transition: box-shadow 0.15s;

  &:hover { box-shadow: $shadow-sm; }
}

.outline-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.outline-content { flex: 1; min-width: 0; }

.outline-card-title {
  font-size: 13px;
  font-weight: 700;
  color: $text;
  margin-bottom: 6px;
  line-height: 1.4;
}

.outline-points {
  margin: 0;
  padding-left: 14px;

  li {
    font-size: 12px;
    color: $text-sub;
    line-height: 1.6;
    margin-bottom: 2px;
    &:last-child { margin-bottom: 0; }
  }
}

// ─── Collapse Transition ──────────────────────────────────────────
.outline-collapse-enter-active,
.outline-collapse-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.outline-collapse-enter-from,
.outline-collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
}
.outline-collapse-enter-to,
.outline-collapse-leave-from {
  opacity: 1;
  max-height: 2000px;
}

// ─── Content Section ──────────────────────────────────────────────
.content-section {
  padding: 0 48px 40px;
}

// ─── Markdown Body ────────────────────────────────────────────────
// 关键：图片在正文中正确渲染
.markdown-body {
  font-size: 16px;
  line-height: 1.9;
  color: $text;

  :deep(h1) {
    font-size: 24px;
    font-weight: 800;
    margin: 36px 0 16px;
    color: $text;
    letter-spacing: -0.4px;
    display: none; // 已在 header 区域展示，避免重复
  }

  :deep(h2) {
    font-size: 20px;
    font-weight: 700;
    margin: 36px 0 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid $green-light;
    color: $text;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 18px;
      background: linear-gradient(180deg, $green, $green-dark);
      border-radius: 2px;
      flex-shrink: 0;
    }
  }

  :deep(h3) {
    font-size: 17px;
    font-weight: 700;
    margin: 24px 0 12px;
    color: $text;
  }

  :deep(p) {
    margin-bottom: 16px;
    color: #374151;

    &:has(img) {
      text-indent: 0; // 图片段落不缩进
      margin: 28px 0;
    }
  }

  // ✅ 图片渲染（fullContent 中的 markdown 图片语法会在此处正确展示）
  :deep(img) {
    display: block;
    max-width: 100%;
    width: 100%;
    margin: 28px auto;
    border-radius: 14px;
    box-shadow: $shadow-lg;
    object-fit: cover;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 16px 48px rgba(0,0,0,.15);
    }
  }

  :deep(blockquote) {
    border-left: 4px solid $green;
    padding: 12px 20px;
    background: $green-mid;
    border-radius: 0 10px 10px 0;
    margin: 20px 0;
    color: $green-dark;

    p { margin: 0; text-indent: 0; color: $green-dark; }
  }

  :deep(ul), :deep(ol) {
    padding-left: 24px;
    margin-bottom: 16px;
  }

  :deep(li) {
    margin-bottom: 8px;
    color: #374151;
    line-height: 1.7;
  }

  :deep(strong) { color: $text; font-weight: 700; }

  :deep(code) {
    background: $border-light;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
    color: #dc2626;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  :deep(pre) {
    background: #1e293b;
    border-radius: 10px;
    padding: 20px;
    overflow-x: auto;
    margin: 20px 0;

    code {
      background: none;
      color: #e2e8f0;
      padding: 0;
      font-size: 14px;
    }
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid $border;
    margin: 32px 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;

    th {
      background: $bg;
      padding: 10px 14px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid $border;
    }

    td {
      padding: 10px 14px;
      border-bottom: 1px solid $border-light;
    }

    tr:hover td { background: $bg; }
  }
}

// ─── Images Section ───────────────────────────────────────────────
.images-section {
  padding: 0 48px 40px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.image-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid $border;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-md;

    .image-overlay { opacity: 1; }
  }
}

.image-thumb-wrap {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: $border-light;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover img { transform: scale(1.05); }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-meta {
  padding: 10px 12px;
  background: $white;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.image-meta-left {
  display: flex;
  gap: 6px;
  align-items: center;
}

.position-badge {
  font-size: 11px;
  font-weight: 700;
  color: $text-muted;
  background: $border-light;
  padding: 2px 7px;
  border-radius: 20px;
}

.method-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;

  &.method-pexels { background: rgba(5, 150, 105, 0.1); color: #065f46; }
  &.method-ai { background: rgba(139, 92, 246, 0.1); color: #6d28d9; }
  &.method-mermaid { background: rgba(59, 130, 246, 0.1); color: #1d4ed8; }
  &.method-icon { background: rgba(245, 158, 11, 0.1); color: #92400e; }
  &.method-svg { background: rgba(236, 72, 153, 0.1); color: #9d174d; }
  &.method-emoji { background: rgba(251, 191, 36, 0.1); color: #92400e; }
  &.method-default { background: $border-light; color: $text-muted; }
}

.image-section-label {
  font-size: 11px;
  color: $text-muted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ─── Empty State ──────────────────────────────────────────────────
.empty-state {
  text-align: center;
  padding: 100px 0;

  .empty-icon { margin-bottom: 16px; }

  .empty-text {
    font-size: 15px;
    color: $text-muted;
    margin: 0 0 20px;
  }
}

// ─── Image Preview ────────────────────────────────────────────────
.image-preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  img {
    max-width: 90vw;
    max-height: 85vh;
    border-radius: 12px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    object-fit: contain;
  }
}

.preview-close {
  position: fixed;
  top: 20px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.25); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// ─── Animations ───────────────────────────────────────────────────
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

// ─── Responsive ───────────────────────────────────────────────────
@media (max-width: 768px) {
  .article-detail-page { padding: 16px 12px 48px; }

  .article-header,
  .article-divider,
  .section-header,
  .outline-body,
  .content-section,
  .images-section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .article-divider { margin: 0 20px; }

  .article-main-title { font-size: 22px; }

  .outline-grid { grid-template-columns: 1fr; }

  .images-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }

  .top-bar { flex-wrap: wrap; gap: 10px; }
}
</style>