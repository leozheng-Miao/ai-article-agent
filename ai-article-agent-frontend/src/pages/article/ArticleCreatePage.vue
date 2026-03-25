<template>
  <div class="article-create-page">
    <div class="create-layout">

      <!-- 左侧：智能体流程可视化 -->
      <aside class="sidebar-left">
        <div class="sidebar-header">
          <div class="sidebar-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <h3 class="sidebar-title">创作流程</h3>
            <p class="sidebar-subtitle">智能体协作可视化</p>
          </div>
        </div>

        <div class="flow-timeline">
          <div
              v-for="(step, index) in agentSteps"
              :key="index"
              :class="['flow-item', {
              'active': currentStep === index,
              'completed': currentStep > index,
              'pending': currentStep < index
            }]"
          >
            <div class="flow-left">
              <div class="flow-indicator">
                <LoadingOutlined v-if="currentStep === index && isCreating" class="spin-icon" />
                <svg v-else-if="currentStep > index" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span v-else class="step-number">{{ index + 1 }}</span>
              </div>
              <div v-if="index < agentSteps.length - 1" class="flow-connector"></div>
            </div>
            <div class="flow-content">
              <div class="flow-title">{{ step.title }}</div>
              <div class="flow-desc">{{ step.description }}</div>
              <div v-if="currentStep === index && isCreating" class="flow-status">
                <span class="status-dot"></span>执行中...
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中间：主内容区 -->
      <main ref="mainContentRef" class="main-content">

        <!-- 输入状态 -->
        <div v-if="!isCreating && !isCompleted" class="input-state">
          <div class="input-hero">
            <div class="hero-badge">AI 驱动创作</div>
            <h1 class="hero-title">创作新文章</h1>
            <p class="hero-sub">输入选题，六步智能体全自动生成爆款内容</p>
          </div>

          <div class="input-card">
            <div class="input-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              输入选题
            </div>
            <a-textarea
                v-model:value="topic"
                placeholder="请输入您想创作的文章选题，例如：2026年AI如何改变职场"
                :rows="5"
                :maxlength="500"
                show-count
                class="topic-textarea"
            />
            <!-- 文章风格选择 -->
            <div class="config-block">
              <div class="config-block-header">
                <div class="config-block-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  文章风格
                </div>
                <span class="config-block-tip">不选择使用默认风格</span>
              </div>
              <div class="style-options">
                <label
                    v-for="style in styleOptions"
                    :key="style.value"
                    :class="['style-option', { selected: selectedStyle === style.value }]"
                    @click="selectedStyle = style.value"
                >
                  <span class="style-emoji">{{ style.emoji }}</span>
                  <span class="style-name">{{ style.label }}</span>
                </label>
              </div>
            </div>

            <!-- 配图方式选择 -->
            <div class="config-block">
              <div class="config-block-header">
                <div class="config-block-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  配图方式
                </div>
                <span class="config-block-tip">不选择表示支持所有方式</span>
              </div>
              <div class="method-options">
                <label
                    v-for="method in imageMethodOptions"
                    :key="method.value"
                    :class="['method-option', { selected: selectedImageMethods.includes(method.value) }]"
                    @click="toggleMethod(method.value)"
                >
                  <span class="method-dot" :style="{ background: method.color }"></span>
                  <span class="method-name">{{ method.label }}</span>
                  <svg v-if="selectedImageMethods.includes(method.value)" class="method-check" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </label>
              </div>
            </div>

            <a-button
                type="primary"
                size="large"
                :loading="isCreating"
                :disabled="!topic.trim() || !hasQuota"
                @click="startCreate"
                class="create-btn"
            >
              <template #icon><RocketOutlined /></template>
              开始创作
            </a-button>
            <div v-if="!hasQuota" class="quota-warning">
              <WarningOutlined />
              <span>配额已用完，无法创建文章</span>
            </div>
          </div>
        </div>

        <!-- 创作进行中 -->
        <div v-if="isCreating && !isCompleted" class="creating-state">
          <div v-if="article.mainTitle" class="preview-header">
            <h1 class="article-title">{{ article.mainTitle }}</h1>
            <p class="article-subtitle">{{ article.subTitle }}</p>
          </div>

          <div v-if="outlineRaw" class="outline-preview">
            <div class="section-label">
              <BulbOutlined />
              <span>文章大纲</span>
              <span v-if="isOutlineStreaming" class="typing-cursor">|</span>
            </div>
            <div class="outline-list">
              <div v-for="item in parsedOutline" :key="item.section" class="outline-item">
                <div class="outline-index">{{ item.section }}</div>
                <div>
                  <div class="outline-title">{{ item.title }}</div>
                  <ul class="outline-points">
                    <li v-for="(point, idx) in item.points" :key="idx">{{ point }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-if="article.content" class="content-preview">
            <div v-html="markdownToHtml(article.content)" class="markdown-body"></div>
            <span v-if="isStreaming" class="typing-cursor">|</span>
          </div>

          <div v-if="currentStep === 4 && imageProgress > 0" class="image-progress-box">
            <div class="progress-header">
              <PictureOutlined />
              <span>正在生成配图</span>
              <span class="progress-count">{{ imageCount }}/{{ totalImages }}</span>
            </div>
            <a-progress :percent="imageProgress" status="active" :stroke-color="{ from: '#22C55E', to: '#16A34A' }" />
          </div>

          <div v-if="currentStep === 0 && !article.mainTitle" class="loading-placeholder">
            <div class="loading-ring"></div>
            <p>AI 正在构思标题...</p>
          </div>
        </div>

        <!-- 创作完成 -->
        <div v-if="isCompleted" class="completed-state">
          <div class="success-banner">
            <div class="success-banner-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              文章创作完成！
            </div>
          </div>

          <div class="preview-header">
            <h1 class="article-title">{{ article.mainTitle }}</h1>
            <p class="article-subtitle">{{ article.subTitle }}</p>
          </div>
          <div class="content-preview">
            <div v-html="markdownToHtml(article.fullContent || article.content || '')" class="markdown-body"></div>
          </div>
        </div>
      </main>

      <!-- 右侧：辅助面板 -->
      <aside class="sidebar-right">

        <!-- 配额信息 -->
        <div v-if="!isCreating && !isCompleted" class="panel-card quota-card">
          <h4 class="panel-title"><CrownOutlined /> 创作配额</h4>
          <div v-if="isAdmin" class="quota-admin">
            <span class="quota-badge admin">管理员</span>
            <span class="quota-text">无限次</span>
          </div>
          <div v-else class="quota-info">
            <div class="quota-display">
              <span class="quota-number" :class="{ 'low': quota <= 1, 'empty': quota === 0 }">{{ quota }}</span>
              <span class="quota-unit">次</span>
            </div>
            <div class="quota-label">剩余可用</div>
            <a-progress
                :percent="(quota / 5) * 100"
                :show-info="false"
                :stroke-color="quota <= 1 ? '#ff4d4f' : '#22C55E'"
                size="small"
                class="quota-progress"
            />
          </div>
        </div>

        <!-- 热门选题 -->
        <div v-if="!isCreating && !isCompleted" class="panel-card">
          <h4 class="panel-title"><BulbOutlined /> 热门选题</h4>
          <div class="hot-tags">
            <span v-for="example in exampleTopics" :key="example" class="hot-tag" @click="topic = example">
              {{ example }}
            </span>
          </div>
        </div>

        <!-- 创作技巧 -->
        <div v-if="!isCreating && !isCompleted" class="panel-card">
          <h4 class="panel-title"><StarOutlined /> 爆款技巧</h4>
          <div class="tips-list">
            <div v-for="tip in tips" :key="tip.title" class="tip-item">
              <div class="tip-icon">{{ tip.num }}</div>
              <div>
                <div class="tip-title">{{ tip.title }}</div>
                <div class="tip-desc">{{ tip.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 创作进行中的提示 -->
        <div v-if="isCreating && !isCompleted" class="panel-card progress-card">
          <h4 class="panel-title"><ClockCircleOutlined /> 创作进度</h4>
          <div class="progress-steps">
            <div class="progress-row">
              <span class="p-label">当前步骤</span>
              <span class="p-value">{{ agentSteps[currentStep]?.title }}</span>
            </div>
            <div class="progress-row">
              <span class="p-label">已完成</span>
              <span class="p-value">{{ currentStep }}/{{ agentSteps.length }}</span>
            </div>
          </div>
          <div class="tip-notice">
            <InfoCircleOutlined />
            <span>AI 正在努力创作中，请耐心等待...</span>
          </div>
        </div>

        <!-- 完成操作 -->
        <div v-if="isCompleted" class="panel-card action-card">
          <h4 class="panel-title"><ThunderboltOutlined /> 快捷操作</h4>
          <div class="action-list">
            <button class="action-btn secondary" @click="copyContent">
              <CopyOutlined /> 复制全文
            </button>
            <button class="action-btn secondary" @click="viewArticle">
              <EyeOutlined /> 查看详情
            </button>
            <button class="action-btn primary" @click="resetCreate">
              <RedoOutlined /> 再创作一篇
            </button>
          </div>
        </div>

        <!-- 文章统计 -->
        <div v-if="isCompleted" class="panel-card stats-card">
          <h4 class="panel-title"><BarChartOutlined /> 文章统计</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ (article.fullContent || article.content || '').length }}</div>
              <div class="stat-label">字数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ article.images?.length || 0 }}</div>
              <div class="stat-label">配图</div>
            </div>
          </div>
        </div>

        <!-- 底部帮助 -->
        <div class="panel-footer">
          <a class="help-link"><QuestionCircleOutlined /> 使用帮助</a>
          <a class="help-link"><MessageOutlined /> 反馈建议</a>
        </div>
      </aside>
    </div>

    <!-- 错误弹窗 -->
    <a-modal v-model:open="errorVisible" title="创作失败" @ok="errorVisible = false">
      <p>{{ errorMessage }}</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/loginUser'
import { USER_ROLE_ADMIN } from '@/constants/user'
import {
  RocketOutlined, LoadingOutlined, CopyOutlined, EyeOutlined, RedoOutlined,
  ThunderboltOutlined, BulbOutlined, StarOutlined, ClockCircleOutlined,
  InfoCircleOutlined, BarChartOutlined, QuestionCircleOutlined, MessageOutlined,
  PictureOutlined, WarningOutlined, CrownOutlined
} from '@ant-design/icons-vue'
import { createArticle } from '@/api/articleController'
import { connectSSE, type SSEMessage, type SSEConnection } from '@/utils/sse'
import { marked } from 'marked'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

const isAdmin = computed(() => loginUserStore.loginUser.userRole === USER_ROLE_ADMIN)
const quota = computed(() => loginUserStore.loginUser.quota ?? 0)
const hasQuota = computed(() => isAdmin.value || quota.value > 0)

const agentSteps = [
  { title: '生成标题', description: 'AI 分析选题，生成吸睛标题' },
  { title: '规划大纲', description: '构建文章结构，理清脉络' },
  { title: '撰写正文', description: '流式生成高质量文章内容' },
  { title: '分析配图', description: '智能分析配图需求和位置' },
  { title: '生成配图', description: '自动匹配高清无版权图片' },
  { title: '图文合成', description: '将配图插入正文，完美呈现' },
]

const tips = [
  { num: '1', title: '抓住痛点', desc: '直击用户最关心的问题' },
  { num: '2', title: '制造悬念', desc: '让读者产生好奇心' },
  { num: '3', title: '数字吸引', desc: '使用具体数据增加说服力' },
]

const exampleTopics = ['2026年AI如何改变职场', '程序员如何提升竞争力', '远程办公的利与弊', '如何培养深度思考', '新能源汽车趋势', '健康饮食指南']

const selectedStyle = ref('')
const selectedImageMethods = ref<string[]>([])

const styleOptions = [
  { value: '', label: '默认', emoji: '✨' },
  { value: 'tech', label: '科技', emoji: '🔬' },
  { value: 'emotional', label: '情感', emoji: '💫' },
  { value: 'educational', label: '教育', emoji: '📚' },
  { value: 'humorous', label: '幽默', emoji: '😄' },
]

const imageMethodOptions = [
  { value: 'PEXELS', label: 'Pexels', color: '#059669' },
  { value: 'NANO_BANANA', label: 'AI 生成', color: '#7c3aed' },
  { value: 'MERMAID', label: 'Mermaid', color: '#2563eb' },
  { value: 'ICONIFY', label: 'Iconify', color: '#d97706' },
  { value: 'SVG_DIAGRAM', label: 'SVG', color: '#db2777' },
  { value: 'EMOJI_PACK', label: '表情包', color: '#ea580c' },
]

const toggleMethod = (value: string) => {
  const idx = selectedImageMethods.value.indexOf(value)
  if (idx === -1) selectedImageMethods.value.push(value)
  else selectedImageMethods.value.splice(idx, 1)
}

const topic = ref('')
const isCreating = ref(false)
const isCompleted = ref(false)
const isStreaming = ref(false)
const isOutlineStreaming = ref(false)
const currentStep = ref(0)
const taskId = ref('')
const errorVisible = ref(false)
const errorMessage = ref('')
const outlineRaw = ref('')
const mainContentRef = ref<HTMLElement | null>(null)
const imageCount = ref(0)
const totalImages = ref(5)
const imageProgress = ref(0)

const article = ref<Partial<API.ArticleVO>>({ mainTitle: '', subTitle: '', content: '', fullContent: '', images: [] })
let sseConnection: SSEConnection | null = null

interface OutlineItem { title: string; points: string[]; section: number }

const parsedOutline = computed<OutlineItem[]>(() => {
  if (!outlineRaw.value) return []
  const str = outlineRaw.value.trim()
  try {
    const parsed = JSON.parse(str)
    if (parsed && Array.isArray(parsed.sections)) return parsed.sections
    return []
  } catch {
    try {
      const sectionsMatch = str.match(/"sections"\s*:\s*\[/)
      if (!sectionsMatch) return []
      const sectionsStart = str.indexOf('[', sectionsMatch.index)
      if (sectionsStart === -1) return []
      const afterStart = str.substring(sectionsStart)
      const lastBrace = afterStart.lastIndexOf('}')
      if (lastBrace > 0) {
        const parsed = JSON.parse(afterStart.substring(0, lastBrace + 1) + ']')
        if (Array.isArray(parsed)) return parsed
      }
      return []
    } catch { return [] }
  }
})

const markdownToHtml = (markdown: string) => marked(markdown)
const scrollToBottom = () => nextTick(() => { if (mainContentRef.value) mainContentRef.value.scrollTop = mainContentRef.value.scrollHeight })

const startCreate = async () => {
  if (!topic.value.trim()) { message.warning('请输入选题'); return }
  if (!hasQuota.value) { message.error('配额不足，无法创建文章'); return }
  sseConnection?.cancel(); sseConnection = null
  isCreating.value = true; isCompleted.value = false; isStreaming.value = false
  isOutlineStreaming.value = false; currentStep.value = 0
  try {
    const res = await createArticle({
      topic: topic.value,
      style: selectedStyle.value || undefined,
      enabledImageMethods: selectedImageMethods.value.length > 0 ? selectedImageMethods.value : undefined,
    })
    const createdTaskId = res.data.data
    if (!createdTaskId) throw new Error('创建任务失败：未返回任务ID')
    taskId.value = createdTaskId
    await loginUserStore.fetchLoginUser()
    sseConnection = connectSSE(taskId.value, { onMessage: handleSSEMessage, onError: handleSSEError, onComplete: handleSSEComplete })
  } catch (error: any) {
    message.error(error.message || '创建任务失败')
    isCreating.value = false; sseConnection?.cancel(); sseConnection = null
  }
}

const handleSSEMessage = (msg: SSEMessage) => {
  switch (msg.type) {
    case 'AGENT1_COMPLETE': currentStep.value = 1; article.value.mainTitle = msg.title?.mainTitle || msg.data?.mainTitle || ''; article.value.subTitle = msg.title?.subTitle || msg.data?.subTitle || ''; break
    case 'AGENT2_STREAMING': isOutlineStreaming.value = true; outlineRaw.value += msg.content || msg.data?.content || ''; scrollToBottom(); break
    case 'AGENT2_COMPLETE': isOutlineStreaming.value = false; currentStep.value = 2; break
    case 'AGENT3_STREAMING': isStreaming.value = true; article.value.content += msg.content || msg.data?.content || ''; scrollToBottom(); break
    case 'AGENT3_COMPLETE': isStreaming.value = false; currentStep.value = 3; break
    case 'AGENT4_COMPLETE': currentStep.value = 4; totalImages.value = msg.imageRequirements?.length || msg.data?.imageRequirements?.length || 5; break
    case 'IMAGE_COMPLETE': imageCount.value++; imageProgress.value = Math.round((imageCount.value / totalImages.value) * 100); break
    case 'AGENT5_COMPLETE': currentStep.value = 5; article.value.images = msg.images || msg.data?.images || []; break
    case 'MERGE_COMPLETE': article.value.fullContent = msg.fullContent || msg.data?.fullContent || ''; scrollToBottom(); break
    case 'ALL_COMPLETE': currentStep.value = 6; isCompleted.value = true; isCreating.value = false; message.success('文章创作完成!'); break
    case 'ERROR': errorMessage.value = msg.message || msg.data?.message || '创作失败'; errorVisible.value = true; isCreating.value = false; break
  }
}
const handleSSEError = (_error: Event) => { message.error('连接失败,请重试'); isCreating.value = false }
const handleSSEComplete = () => {}

const copyContent = async () => {
  const content = article.value.fullContent || article.value.content || ''
  try { await navigator.clipboard.writeText(content); message.success('已复制到剪贴板') } catch { message.error('复制失败') }
}
const viewArticle = () => { if (!taskId.value) return; router.push(`/article/${taskId.value}`) }
const resetCreate = () => {
  sseConnection?.cancel(); sseConnection = null
  topic.value = ''; taskId.value = ''; isCreating.value = false; isCompleted.value = false
  isStreaming.value = false; isOutlineStreaming.value = false; currentStep.value = 0
  imageCount.value = 0; imageProgress.value = 0; outlineRaw.value = ''; totalImages.value = 5
  selectedStyle.value = ''; selectedImageMethods.value = []
  article.value = { mainTitle: '', subTitle: '', content: '', fullContent: '', images: [] }
}

onMounted(() => { if (route.query.topic) topic.value = route.query.topic as string })
onBeforeUnmount(() => { sseConnection?.cancel() })
</script>

<style scoped lang="scss">
// ─── Design Tokens ────────────────────────────────────────────────
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
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 20px;
$shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
$shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04);
$shadow-lg: 0 8px 32px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06);

// ─── Page Shell ───────────────────────────────────────────────────
.article-create-page {
  height: calc(100vh - 64px);
  background: $bg;
  overflow: hidden;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

.create-layout {
  display: grid;
  grid-template-columns: 260px 1fr 280px;
  height: 100%;
  gap: 0;
}

// ─── Left Sidebar ─────────────────────────────────────────────────
.sidebar-left {
  background: $white;
  border-right: 1px solid $border;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid $border-light;
}

.sidebar-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  background: $green-mid;
  color: $green-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 2px;
  color: $text;
  letter-spacing: -0.2px;
}

.sidebar-subtitle {
  font-size: 12px;
  color: $text-muted;
  margin: 0;
}

.flow-timeline { flex: 1; }

.flow-item {
  display: flex;
  gap: 14px;
  position: relative;
  padding-bottom: 4px;
}

.flow-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.flow-connector {
  width: 2px;
  flex: 1;
  min-height: 20px;
  margin: 4px 0;
  background: $border;
  border-radius: 1px;
  transition: background 0.3s;

  .completed + .flow-content ~ .flow-item .flow-connector,
  .completed & {
    background: $green;
  }
}

.flow-item.completed .flow-connector { background: $green; }
.flow-item.active .flow-connector { background: linear-gradient(180deg, $green 50%, $border 100%); }

.flow-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.25s;
  flex-shrink: 0;

  .pending & {
    background: $bg;
    color: $text-muted;
    border: 1.5px solid $border;
  }
  .active & {
    background: $white;
    color: $green;
    border: 2px solid $green;
    box-shadow: 0 0 0 4px $green-mid;
  }
  .completed & {
    background: $green;
    color: $white;
    border: none;
  }

  .step-number { font-weight: 700; font-size: 12px; }
  .spin-icon { animation: spin 1s linear infinite; }
}

.flow-content {
  flex: 1;
  padding-bottom: 20px;
}

.flow-title {
  font-size: 13px;
  font-weight: 600;
  color: $text;
  margin-bottom: 2px;
  line-height: 30px; // align with indicator

  .pending & { color: $text-muted; }
  .active & { color: $green-dark; }
}

.flow-desc {
  font-size: 11px;
  color: $text-muted;
  line-height: 1.5;
}

.flow-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  padding: 3px 8px;
  background: $green-mid;
  border-radius: 20px;
  font-size: 11px;
  color: $green-dark;
  font-weight: 500;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: $green;
  animation: pulse 1.5s infinite;
}

// ─── Main Content ─────────────────────────────────────────────────
.main-content {
  padding: 36px 48px;
  overflow-y: auto;
  background: $white;
  border-right: 1px solid $border;
}

// Input State
.input-state {
  max-width: 680px;
  margin: 0 auto;
  padding-top: 48px;
}

.input-hero {
  text-align: center;
  margin-bottom: 36px;
}

.hero-badge {
  display: inline-block;
  padding: 5px 14px;
  background: $green-mid;
  color: $green-dark;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: $text;
  margin: 0 0 10px;
  letter-spacing: -0.8px;
  line-height: 1.2;
}

.hero-sub {
  font-size: 15px;
  color: $text-sub;
  margin: 0;
}

.input-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-xl;
  padding: 28px;
  box-shadow: $shadow-md;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: $text-sub;
}

.topic-textarea {
  font-size: 15px !important;
  border-radius: $radius-md !important;
  resize: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: $green !important;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12) !important;
  }

  :deep(textarea) {
    font-size: 15px;
    line-height: 1.7;
    padding: 14px 16px;
  }
}

.create-btn {
  &.ant-btn {
    height: 50px;
    font-size: 15px;
    font-weight: 700;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $green 0%, $green-dark 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.35) !important;
    letter-spacing: 0.3px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.45) !important;
    }

    &:active:not(:disabled) { transform: translateY(0); }

    &:disabled, &.ant-btn-disabled {
      background: $border !important;
      box-shadow: none !important;
      color: $text-muted !important;
    }
  }
}

.quota-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 77, 79, 0.06);
  border: 1px solid rgba(255, 77, 79, 0.18);
  border-radius: $radius-sm;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
}

// Creating / Completed States
.creating-state, .completed-state { max-width: 100%; }

.preview-header {
  text-align: center;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid $border-light;
}

.article-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
  color: $text;
  line-height: 1.35;
  letter-spacing: -0.5px;
}

.article-subtitle {
  font-size: 15px;
  color: $text-sub;
  margin: 0;
}

// Outline Preview
.outline-preview {
  margin-bottom: 28px;
  padding: 20px 24px;
  background: $bg;
  border-radius: $radius-lg;
  border: 1px solid $border-light;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: $green-dark;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.outline-list { display: flex; flex-direction: column; gap: 10px; }

.outline-item {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  background: $white;
  border-radius: $radius-md;
  border: 1px solid $border;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: $shadow-md; }
}

.outline-index {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.outline-title {
  font-size: 13px;
  font-weight: 700;
  color: $text;
  margin-bottom: 6px;
}

.outline-points {
  margin: 0;
  padding-left: 16px;

  li {
    font-size: 12px;
    color: $text-sub;
    line-height: 1.6;
    margin-bottom: 3px;

    &:last-child { margin-bottom: 0; }
  }
}

// Content Preview
.content-preview { line-height: 1.8; }

.markdown-body {
  line-height: 1.85;
  font-size: 15px;
  color: $text;

  :deep(h1), :deep(h2), :deep(h3) {
    font-weight: 700;
    letter-spacing: -0.3px;
    color: $text;
  }

  :deep(h2) {
    font-size: 20px;
    margin: 32px 0 14px;
    padding-bottom: 10px;
    border-bottom: 2px solid $green-light;
  }

  :deep(h3) {
    font-size: 16px;
    margin: 20px 0 10px;
  }

  :deep(p) {
    margin-bottom: 14px;
    text-indent: 2em;
    color: #374151;
  }

  :deep(img) {
    display: block;
    max-width: 100%;
    margin: 24px auto;
    border-radius: $radius-lg;
    box-shadow: $shadow-lg;
  }

  :deep(strong) { color: $text; }

  :deep(blockquote) {
    border-left: 3px solid $green;
    padding: 10px 16px;
    background: $green-mid;
    border-radius: 0 $radius-sm $radius-sm 0;
    margin: 16px 0;

    p { margin: 0; text-indent: 0; }
  }
}

.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: $green;
  font-weight: bold;
  font-size: 18px;
}

// Image Progress
.image-progress-box {
  background: $bg;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px 24px;
  margin-top: 24px;

  .progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 14px;
    font-weight: 600;
    color: $text;

    .progress-count {
      margin-left: auto;
      font-size: 13px;
      color: $green-dark;
      background: $green-mid;
      padding: 2px 10px;
      border-radius: 20px;
    }
  }
}

// Loading Placeholder
.loading-placeholder {
  text-align: center;
  padding: 100px 0;

  .loading-ring {
    width: 44px;
    height: 44px;
    border: 3px solid $border;
    border-top-color: $green;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }

  p {
    color: $text-sub;
    font-size: 15px;
    margin: 0;
  }
}

// Success Banner
.success-banner {
  margin-bottom: 24px;
}

.success-banner-inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, $green 0%, $green-dark 100%);
  border-radius: 30px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
  letter-spacing: 0.2px;
}

// ─── Right Sidebar ─────────────────────────────────────────────────
.sidebar-right {
  background: $white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.panel-card {
  background: $bg;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 16px 18px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: $text;
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

// Quota Card
.quota-card {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0.02) 100%);
  border-color: rgba(34, 197, 94, 0.2);
}

.quota-admin { display: flex; align-items: center; gap: 10px; }

.quota-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;

  &.admin {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #78350f;
  }
}

.quota-text { font-size: 14px; color: $text-sub; }

.quota-info { text-align: center; }

.quota-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  margin-bottom: 2px;
}

.quota-number {
  font-size: 40px;
  font-weight: 800;
  color: $green;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  &.low { color: #f59e0b; }
  &.empty { color: #ef4444; }
}

.quota-unit { font-size: 14px; color: $text-muted; }

.quota-label {
  font-size: 12px;
  color: $text-muted;
  margin: 4px 0 12px;
}

.quota-progress { max-width: 100px; margin: 0 auto; }

// Hot Tags
.hot-tags { display: flex; flex-wrap: wrap; gap: 7px; }

.hot-tag {
  display: inline-block;
  padding: 6px 11px;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-sm;
  font-size: 12px;
  color: $text-sub;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.3;

  &:hover {
    border-color: $green;
    color: $green-dark;
    background: $green-mid;
    transform: translateY(-1px);
  }
}

// Tips
.tips-list { display: flex; flex-direction: column; gap: 10px; }

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: $white;
  border-radius: $radius-sm;
  border: 1px solid $border;
  transition: box-shadow 0.15s;

  &:hover { box-shadow: $shadow-sm; }
}

.tip-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.tip-title { font-size: 12px; font-weight: 700; color: $text; margin-bottom: 2px; }
.tip-desc { font-size: 11px; color: $text-muted; line-height: 1.4; }

// Progress Card
.progress-steps { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 12px;
  background: $white;
  border-radius: $radius-sm;
  border: 1px solid $border;
}

.p-label { font-size: 12px; color: $text-muted; }

.p-value {
  font-size: 12px;
  font-weight: 700;
  color: $green-dark;
}

.tip-notice {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 10px 12px;
  background: $green-mid;
  border-radius: $radius-sm;
  font-size: 12px;
  color: $green-dark;
  line-height: 1.5;
}

// Action Card
.action-list { display: flex; flex-direction: column; gap: 8px; }

.action-btn {
  width: 100%;
  height: 38px;
  border-radius: $radius-sm;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: none;

  &.secondary {
    background: $white;
    color: $text;
    border: 1px solid $border;

    &:hover { border-color: $green; color: $green-dark; background: $green-mid; }
  }

  &.primary {
    background: linear-gradient(135deg, $green, $green-dark);
    color: white;
    box-shadow: 0 3px 10px rgba(34, 197, 94, 0.3);

    &:hover { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(34, 197, 94, 0.4); }
  }
}

// Stats
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.stat-item {
  text-align: center;
  padding: 14px 10px;
  background: $white;
  border-radius: $radius-sm;
  border: 1px solid $border;
}

.stat-value { font-size: 22px; font-weight: 800; color: $green; margin-bottom: 3px; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 11px; color: $text-muted; font-weight: 500; }

// Footer
.panel-footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid $border-light;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.help-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: $text-muted;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: $green; }
}

// ─── Config Blocks（风格 & 配图方式）────────────────────────────────
.config-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.config-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-block-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: $text-sub;
}

.config-block-tip {
  font-size: 11px;
  color: $text-muted;
}

// 风格选项
.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.style-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1.5px solid $border;
  border-radius: $radius-md;
  background: $white;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;

  &:hover {
    border-color: $green;
    background: rgba(34, 197, 94, 0.04);
  }

  &.selected {
    border-color: $green;
    background: $green-mid;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
}

.style-emoji {
  font-size: 15px;
  line-height: 1;
}

.style-name {
  font-size: 13px;
  font-weight: 500;
  color: $text;

  .selected & { color: $green-dark; font-weight: 600; }
}

// 配图方式选项
.method-options {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1.5px solid $border;
  border-radius: $radius-sm;
  background: $white;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  position: relative;

  &:hover {
    border-color: $green;
    background: rgba(34, 197, 94, 0.04);
  }

  &.selected {
    border-color: $green;
    background: $green-mid;
  }
}

.method-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.method-name {
  font-size: 12px;
  font-weight: 500;
  color: $text-sub;

  .selected & { color: $green-dark; font-weight: 600; }
}

.method-check {
  color: $green-dark;
  flex-shrink: 0;
}

// ─── Animations ───────────────────────────────────────────────────
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

// ─── Responsive ───────────────────────────────────────────────────
@media (max-width: 1400px) {
  .create-layout { grid-template-columns: 240px 1fr 260px; }
}

@media (max-width: 1100px) {
  .create-layout { grid-template-columns: 220px 1fr 240px; }
  .main-content { padding: 28px 32px; }
}

@media (max-width: 900px) {
  .article-create-page { height: auto; min-height: calc(100vh - 64px); overflow: visible; }
  .create-layout { grid-template-columns: 1fr; height: auto; }
  .sidebar-left, .sidebar-right { display: none; }
  .main-content { padding: 20px; border: none; }
}
</style>