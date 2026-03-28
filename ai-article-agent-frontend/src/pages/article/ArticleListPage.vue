<template>
  <div class="article-list-page">
    <div class="page-inner">

      <!-- 顶部标题栏 -->
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">我的文章</h1>
          <span class="article-count">共 {{ pagination.total }} 篇</span>
        </div>
        <button class="btn-create" @click="goToCreate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          创作新文章
        </button>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="card-grid">
        <div v-for="i in 6" :key="i" class="article-card skeleton-card">
          <div class="sk-cover"></div>
          <div class="sk-body">
            <div class="sk-line w70"></div>
            <div class="sk-line w45"></div>
            <div class="sk-line w30"></div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!dataSource.length" class="empty-state">
        <div class="empty-illustration">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="empty-title">还没有文章</h3>
        <p class="empty-sub">创作你的第一篇 AI 文章吧</p>
        <button class="btn-create" @click="goToCreate">立即开始创作</button>
      </div>

      <!-- 文章卡片网格 -->
      <div v-else class="card-grid">
        <div
            v-for="record in dataSource"
            :key="record.id"
            class="article-card"
            @click="viewArticle(record)"
        >
          <!-- 封面图 -->
          <div class="card-cover">
            <img
                v-if="getCoverUrl(record)"
                :src="getCoverUrl(record)"
                :alt="record.mainTitle"
                class="cover-img"
                loading="lazy"
            />
            <div v-else class="cover-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>暂无封面</span>
            </div>

            <!-- 状态徽章 -->
            <div class="cover-status" :class="record.status?.toLowerCase()">
              <span class="status-dot"></span>
              {{ getStatusText(record.status) }}
            </div>

            <!-- 悬浮操作遮罩 -->
            <div class="cover-overlay">
              <span class="overlay-hint">点击查看详情</span>
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="card-body">
            <div class="card-topic">{{ record.topic || '未知选题' }}</div>
            <h3 class="card-title">{{ record.mainTitle || '标题生成中...' }}</h3>
            <p class="card-subtitle">{{ record.subTitle || '—' }}</p>

            <div class="card-footer">
              <div class="card-meta">
                <span class="meta-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ formatDate(record.createTime) }}
                </span>
                <span v-if="record.images?.length" class="meta-imgs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ record.images.length }} 张
                </span>
              </div>

              <!-- 操作按钮 -->
              <div class="card-actions" @click.stop>
                <button class="card-action-btn view" @click.stop="viewArticle(record)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  查看
                </button>
                <a-popconfirm
                    title="确定要删除这篇文章吗？"
                    ok-text="确定删除"
                    cancel-text="取消"
                    @confirm="handleDelete(record)"
                    @click.stop
                >
                  <button class="card-action-btn delete" @click.stop>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    删除
                  </button>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="pagination.total > pagination.pageSize" class="pagination-wrap">
        <a-pagination
            v-model:current="pagination.current"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            show-quick-jumper
            :show-size-changer="false"
            @change="handlePageChange"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listArticle, deleteArticle as deleteArticleApi, type ArticleVO } from '@/api/articleController'
import dayjs from 'dayjs'

const router = useRouter()

const loading = ref(false)
const dataSource = ref<ArticleVO[]>([])
const pagination = ref({ current: 1, pageSize: 12, total: 0 })

// ── 获取封面图（position === 1 的图片）────────────────────────────
const getCoverUrl = (record: ArticleVO): string | null => {
  if (!record.images?.length) return null
  const cover = record.images.find((img: any) => img.position === 1 || img.type === 'cover')
  return cover?.url || record.images[0]?.url || null
}

// ── 数据加载 ─────────────────────────────────────────────────────
const loadData = async () => {
  loading.value = true
  try {
    const res = await listArticle({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
    })
    const pageData = res.data.data
    dataSource.value = pageData.records || []
    pagination.value.total = pageData.totalRow || 0
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.value.current = page
  loadData()
}

const viewArticle = (record: ArticleVO) => router.push(`/article/${record.taskId}`)
const goToCreate = () => router.push('/create')

const handleDelete = async (record: ArticleVO) => {
  try {
    await deleteArticleApi({ id: record.id })
    message.success('删除成功')
    loadData()
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const formatDate = (date: string) => dayjs(date).format('MM-DD HH:mm')

const getStatusText = (status: string) =>
    ({ PENDING: '等待中', PROCESSING: '生成中', COMPLETED: '已完成', FAILED: '失败' })[status] || status

onMounted(loadData)
</script>

<style scoped lang="scss">
$green: #22C55E;
$green-dark: #16A34A;
$green-light: #DCFCE7;
$green-mid: rgba(34, 197, 94, 0.12);
$text: #111827;
$text-sub: #6B7280;
$text-muted: #9CA3AF;
$border: #E5E7EB;
$border-light: #F3F4F6;
$bg: #F9FAFB;
$white: #ffffff;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 20px;
$shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
$shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04);
$shadow-lg: 0 12px 32px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);

.article-list-page {
  min-height: calc(100vh - 64px);
  background: $bg;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

.page-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 36px 32px 64px;
}

// ─── Page Header ─────────────────────────────────────────────────
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  color: $text;
  margin: 0;
  letter-spacing: -0.5px;
}

.article-count {
  font-size: 13px;
  color: $text-muted;
  background: $border-light;
  padding: 3px 10px;
  border-radius: 20px;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: $radius-md;
  border: none;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 10px rgba(34,197,94,.35);

  &:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(34,197,94,.45); }
}

// ─── Card Grid ────────────────────────────────────────────────────
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

// ─── Article Card ─────────────────────────────────────────────────
.article-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all 0.22s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: rgba(34,197,94,.2);

    .cover-overlay { opacity: 1; }
    .cover-img { transform: scale(1.04); }
  }
}

// ─── Cover ───────────────────────────────────────────────────────
.card-cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: $border-light;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);

  span {
    font-size: 12px;
    color: $text-muted;
  }
}

.cover-status {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(8px);

  &.completed { background: rgba(34,197,94,.85); color: white; }
  &.processing { background: rgba(59,130,246,.85); color: white; }
  &.pending { background: rgba(255,255,255,.85); color: $text-sub; }
  &.failed { background: rgba(239,68,68,.85); color: white; }

  .status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,.5) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  opacity: 0;
  transition: opacity 0.22s;
}

.overlay-hint {
  font-size: 12px;
  color: rgba(255,255,255,.9);
  font-weight: 600;
}

// ─── Card Body ────────────────────────────────────────────────────
.card-body {
  padding: 16px 18px 14px;
}

.card-topic {
  font-size: 11px;
  font-weight: 600;
  color: $green-dark;
  background: $green-mid;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  margin-bottom: 8px;
  letter-spacing: 0.2px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: $text;
  margin: 0 0 5px;
  line-height: 1.4;
  letter-spacing: -0.2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-subtitle {
  font-size: 12px;
  color: $text-muted;
  margin: 0 0 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid $border-light;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-time, .meta-imgs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: $text-muted;
}

.card-actions {
  display: flex;
  gap: 6px;
}

.card-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid $border;
  background: $white;

  &.view {
    color: $text-sub;
    &:hover { border-color: $green; color: $green-dark; background: $green-mid; }
  }

  &.delete {
    color: $text-muted;
    &:hover { border-color: rgba(239,68,68,.3); color: #ef4444; background: rgba(239,68,68,.06); }
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────
.skeleton-card { pointer-events: none; }

.sk-cover {
  aspect-ratio: 16/9;
  background: linear-gradient(90deg, $border-light 25%, #e9ecef 50%, $border-light 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }

.sk-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, $border-light 25%, #e9ecef 50%, $border-light 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;

  &.w70 { width: 70%; }
  &.w45 { width: 45%; }
  &.w30 { width: 30%; }
}

// ─── Empty State ──────────────────────────────────────────────────
.empty-state {
  text-align: center;
  padding: 100px 0;
}

.empty-illustration {
  width: 96px; height: 96px;
  border-radius: 50%;
  background: $border-light;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}

.empty-title { font-size: 18px; font-weight: 700; color: $text; margin: 0 0 8px; }
.empty-sub { font-size: 14px; color: $text-muted; margin: 0 0 24px; }

// ─── Pagination ───────────────────────────────────────────────────
.pagination-wrap {
  display: flex;
  justify-content: center;
  padding-top: 8px;

  :deep(.ant-pagination-item-active) {
    border-color: $green;
    a { color: $green-dark; }
  }

  :deep(.ant-pagination-item:hover) {
    border-color: $green;
    a { color: $green-dark; }
  }
}

// ─── Animations ───────────────────────────────────────────────────
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

// ─── Responsive ───────────────────────────────────────────────────
@media (max-width: 768px) {
  .page-inner { padding: 24px 16px 48px; }
  .card-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 22px; }
}
</style>