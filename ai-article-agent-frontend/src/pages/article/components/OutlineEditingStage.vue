<template>
  <div class="outline-editing-stage">

    <div class="stage-header">
      <div class="stage-badge">阶段 2 / 3</div>
      <h2 class="stage-title">编辑文章大纲</h2>
      <p class="stage-subtitle">拖动章节可调整顺序，也可以让 AI 帮你修改</p>
    </div>

    <!-- 大纲章节列表 -->
    <div class="outline-list" ref="outlineListRef">
      <div
          v-for="(section, index) in outlineSections"
          :key="section.section"
          class="outline-section-card"
          :data-section-id="section.section"
      >
        <!-- 卡片头部 -->
        <div class="section-card-header">
          <div class="section-card-left">
            <div class="drag-handle" title="拖动排序">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="19" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div class="section-num">{{ index + 1 }}</div>
          </div>
          <a-input
              v-model:value="section.title"
              placeholder="章节标题"
              class="section-title-input"
          />
          <button
              class="delete-section-btn"
              @click="deleteSection(index)"
              title="删除章节"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- 要点列表 -->
        <div class="section-points">
          <div v-for="(point, pointIdx) in section.points" :key="pointIdx" class="point-row">
            <div class="point-bullet"></div>
            <a-input
                v-model:value="section.points[pointIdx]"
                placeholder="输入要点内容"
                class="point-input"
            />
            <button
                class="delete-point-btn"
                @click="deletePoint(index, pointIdx)"
                :disabled="section.points.length <= 1"
                title="删除要点"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <button class="add-point-btn" @click="addPoint(index)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            添加要点
          </button>
        </div>
      </div>
    </div>

    <!-- 添加章节按钮 -->
    <button class="add-section-btn" @click="addSection">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      添加章节
    </button>

    <!-- AI 修改面板 -->
<!--    <div class="ai-panel" :class="{ 'vip-only': !isVip }">-->
<!--      <div class="ai-panel-header">-->
<!--        <div class="ai-panel-title">-->
<!--          <div class="ai-icon">-->
<!--            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">-->
<!--              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" stroke-width="2"/>-->
<!--              <path d="M8 12s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>-->
<!--              <path d="M9 9h.01M15 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>-->
<!--            </svg>-->
<!--          </div>-->
<!--          AI 助手修改大纲-->
<!--          <span v-if="!isVip" class="vip-badge-small">-->
<!--            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 2px;">-->
<!--              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>-->
<!--            </svg>-->
<!--            VIP-->
<!--          </span>-->
<!--        </div>-->
<!--        <span class="ai-panel-tip">描述您的需求，AI 将重新调整大纲结构</span>-->
<!--      </div>-->
<!--      <div v-if="isVip || isAdmin" class="ai-panel-body">-->
<!--        <a-textarea-->
<!--            v-model:value="modifySuggestion"-->
<!--            placeholder="例如：请在第二章节后增加一个关于实践案例的章节，并删除第四章节..."-->
<!--            :rows="3"-->
<!--            :maxlength="500"-->
<!--            show-count-->
<!--            class="ai-textarea"-->
<!--        />-->
<!--        <a-button-->
<!--            :loading="aiModifying"-->
<!--            :disabled="!modifySuggestion.trim()"-->
<!--            @click="handleAiModify"-->
<!--            class="ai-modify-btn"-->
<!--        >-->
<!--          <template #icon>-->
<!--            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">-->
<!--              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--            </svg>-->
<!--          </template>-->
<!--          AI 修改大纲-->
<!--        </a-button>-->
<!--      </div>-->

<!--      <div v-else class="vip-upgrade-notice">-->
<!--        <div class="lock-icon">-->
<!--          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">-->
<!--            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>-->
<!--            <path d="M7 11V7a5 5 0 0110 0v4"></path>-->
<!--          </svg>-->
<!--        </div>-->
<!--        <p>AI 修改大纲功能仅限 VIP 会员使用</p>-->
<!--        <RouterLink to="/vip" class="upgrade-btn">-->
<!--          立即升级 VIP-->
<!--        </RouterLink>-->
<!--      </div>-->
<!--    </div>-->

    <div class="ai-panel" :class="{ 'vip-only': !hasAccess }">
      <div class="ai-panel-header">
        <div class="ai-panel-title">
          <div class="ai-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 9h.01M15 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          AI 助手修改大纲
          <span v-if="!hasAccess" class="vip-badge-small">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 2px;">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
        </svg>
        VIP
      </span>
        </div>
        <span class="ai-panel-tip">描述您的需求，AI 将重新调整大纲结构</span>
      </div>

      <div v-if="hasAccess" class="ai-panel-body">
        <a-textarea
            v-model:value="modifySuggestion"
            placeholder="例如：请在第二章节后增加一个关于实践案例的章节，并删除第四章节..."
            :rows="3"
            :maxlength="500"
            show-count
            class="ai-textarea"
        />
        <a-button
            :loading="aiModifying"
            :disabled="!modifySuggestion.trim()"
            @click="handleAiModify"
            class="ai-modify-btn"
        >
          <template #icon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          AI 修改大纲
        </a-button>
      </div>

      <div v-else class="vip-upgrade-notice">
        <div class="lock-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
        </div>
        <p>AI 修改大纲功能仅限 VIP 会员使用</p>
        <RouterLink to="/vip" class="upgrade-btn">
          立即升级 VIP
        </RouterLink>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="stage-actions">
      <div class="actions-left">
        <span class="section-count">共 {{ outlineSections.length }} 个章节</span>
        <span class="divider">·</span>
        <span class="points-count">{{ totalPoints }} 个要点</span>
      </div>
      <a-button
          type="primary"
          size="large"
          :loading="loading"
          :disabled="!canConfirm"
          @click="handleConfirm"
          class="confirm-btn"
      >
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
        确认并生成正文
      </a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import Sortable from 'sortablejs'
import { aiModifyOutline } from '@/api/articleController'

interface OutlineSection {
  section: number
  title: string
  points: string[]
}

interface Props {
  outline: API.OutlineSection[]
  taskId: string
  loading?: boolean
  isVip?: boolean
  isAdmin?: boolean
}

const hasAccess = computed(() => props.isVip || props.isAdmin)

interface Emits {
  (e: 'confirm', outline: OutlineSection[]): void
}

const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<Emits>()

// 内部状态
const outlineSections = ref<OutlineSection[]>(
    props.outline.map((item, index) => ({
      section: item.section ?? index + 1,
      title: item.title ?? '',
      points: item.points ?? [''],
    }))
)
const outlineListRef = ref<HTMLElement | null>(null)
const modifySuggestion = ref('')
const aiModifying = ref(false)

// 计算属性
const totalPoints = computed(() =>
    outlineSections.value.reduce((sum, s) => sum + s.points.length, 0)
)

const canConfirm = computed(() =>
    outlineSections.value.length > 0 &&
    outlineSections.value.every(
        s => s.title.trim().length > 0 && s.points.length > 0 && s.points.every(p => p.trim().length > 0)
    )
)

// 重新编号
const reindex = () => {
  outlineSections.value.forEach((sec, idx) => { sec.section = idx + 1 })
}

// 初始化拖拽
onMounted(() => {
  nextTick(() => {
    if (outlineListRef.value) {
      Sortable.create(outlineListRef.value, {
        animation: 200,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            const item = outlineSections.value.splice(oldIndex, 1)[0]
            outlineSections.value.splice(newIndex, 0, item)
            reindex()
          }
        },
      })
    }
  })
})

// 章节操作
const addSection = () => {
  outlineSections.value.push({
    section: outlineSections.value.length + 1,
    title: '',
    points: [''],
  })
}

const deleteSection = (index: number) => {
  if (outlineSections.value.length <= 1) {
    message.warning('至少需要保留一个章节')
    return
  }
  outlineSections.value.splice(index, 1)
  reindex()
}

// 要点操作
const addPoint = (sectionIndex: number) => {
  outlineSections.value[sectionIndex].points.push('')
}

const deletePoint = (sectionIndex: number, pointIndex: number) => {
  const section = outlineSections.value[sectionIndex]
  if (section.points.length <= 1) return
  section.points.splice(pointIndex, 1)
}

// 确认
const handleConfirm = () => {
  emit('confirm', outlineSections.value)
}

// AI 修改
const handleAiModify = async () => {
  if (!modifySuggestion.value.trim()) return
  aiModifying.value = true
  try {
    const res = await aiModifyOutline({
      taskId: props.taskId,
      modifySuggestion: modifySuggestion.value,
    })
    if (res.data.data) {
      outlineSections.value = res.data.data.map((item: any, index: number) => ({
        section: item.section ?? index + 1,
        title: item.title ?? '',
        points: item.points ?? [''],
      }))
      modifySuggestion.value = ''
      message.success('AI 已根据您的建议修改大纲')
    }
  } catch (error) {
    message.error((error as Error).message || 'AI 修改失败')
  } finally {
    aiModifying.value = false
  }
}
</script>

<style scoped lang="scss">
$green: #22C55E;
$green-dark: #16A34A;
$green-light: #DCFCE7;
$green-mid: rgba(34, 197, 94, 0.12);
$purple: #7c3aed;
$purple-mid: rgba(124, 58, 237, 0.08);
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
$shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
$shadow-md: 0 4px 16px rgba(0,0,0,.08);

.outline-editing-stage {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

// ─── Header ──────────────────────────────────────────────────────
.stage-header { text-align: center; margin-bottom: 8px; }

.stage-badge {
  display: inline-block;
  padding: 4px 12px;
  background: $purple-mid;
  color: $purple;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.3px;
}

.stage-title {
  font-size: 26px;
  font-weight: 800;
  color: $text;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.stage-subtitle {
  font-size: 14px;
  color: $text-sub;
  margin: 0;
}

// ─── Outline List ─────────────────────────────────────────────────
.outline-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.outline-section-card {
  background: $white;
  border: 1.5px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover { box-shadow: $shadow-md; border-color: rgba(34, 197, 94, 0.3); }

  // Sortable states
  &.sortable-ghost {
    opacity: 0.4;
    background: $green-light;
    border-color: $green;
  }

  &.sortable-chosen {
    box-shadow: 0 8px 24px rgba(0,0,0,.12);
    border-color: $green;
  }
}

.section-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: $bg;
  border-bottom: 1px solid $border-light;
}

.section-card-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.drag-handle {
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  cursor: grab;
  transition: all 0.15s;

  &:hover { background: $border; color: $text-sub; }
  &:active { cursor: grabbing; }
}

.section-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: $green;
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-title-input {
  flex: 1;
  border-radius: $radius-sm !important;
  font-weight: 600 !important;
  font-size: 14px !important;

  :deep(.ant-input) {
    font-weight: 600;
    color: $text;
    &:focus { border-color: $green !important; box-shadow: 0 0 0 2px rgba(34,197,94,.12) !important; }
  }
}

.delete-section-btn {
  width: 30px;
  height: 30px;
  border-radius: $radius-sm;
  border: none;
  background: transparent;
  color: $text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { background: rgba(239, 68, 68, 0.08); color: #ef4444; }
}

// ─── Points ───────────────────────────────────────────────────────
.section-points {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.point-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.point-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $green;
  flex-shrink: 0;
  margin-left: 8px;
}

.point-input {
  flex: 1;
  border-radius: $radius-sm !important;
  font-size: 13px !important;

  :deep(.ant-input) {
    font-size: 13px;
    color: $text-sub;
    &:focus { border-color: $green !important; box-shadow: 0 0 0 2px rgba(34,197,94,.1) !important; }
  }
}

.delete-point-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: $text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) { background: rgba(239, 68, 68, 0.08); color: #ef4444; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.add-point-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px dashed $border;
  border-radius: $radius-sm;
  background: transparent;
  color: $text-muted;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: 22px;

  &:hover { border-color: $green; color: $green-dark; background: $green-mid; }
}

// ─── Add Section ─────────────────────────────────────────────────
.add-section-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  border: 1.5px dashed $border;
  border-radius: $radius-lg;
  background: transparent;
  color: $text-muted;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { border-color: $green; color: $green-dark; background: $green-mid; }
}

// ─── AI Panel ─────────────────────────────────────────────────────
.ai-panel {
  background: linear-gradient(135deg, $purple-mid 0%, rgba(124, 58, 237, 0.04) 100%);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: $radius-lg;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: all 0.3s ease;

  // 非 VIP 时的样式覆盖
  &.vip-only {
    background: #f8f9fa;
    border: 1px solid #e5e7eb;

    .ai-icon {
      background: #f3f4f6;
      border-color: #e5e7eb;
      color: #9ca3af;
    }

    .ai-panel-title {
      color: #6b7280;
    }
  }
}

.ai-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.ai-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: $purple;
}

.ai-icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: $purple-mid;
  border: 1px solid rgba(124, 58, 237, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $purple;
}

.ai-panel-tip {
  font-size: 12px;
  color: $text-muted;
}

.ai-panel-body {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.ai-textarea {
  flex: 1;
  border-radius: $radius-sm !important;
  :deep(.ant-input) { font-size: 13px; line-height: 1.6; }
  :deep(.ant-input:focus) { border-color: $purple !important; box-shadow: 0 0 0 2px rgba(124,58,237,.12) !important; }
}

.ai-modify-btn {
  &.ant-btn {
    height: 80px; // match textarea rows=3 approx
    padding: 0 18px;
    border-radius: $radius-sm;
    background: $purple !important;
    border-color: $purple !important;
    color: white !important;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    white-space: nowrap;
    transition: all 0.15s;

    &:hover:not(:disabled) {
      background: darken($purple, 5%) !important;
      transform: translateY(-1px);
    }

    &:disabled { opacity: 0.5; }
  }
}

// ─── Stage Actions ────────────────────────────────────────────────
.stage-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-muted;
}

.divider { color: $border; }
.section-count, .points-count { font-weight: 500; }

.confirm-btn {
  &.ant-btn {
    height: 46px;
    padding: 0 28px;
    font-size: 14px;
    font-weight: 700;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $green 0%, $green-dark 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35) !important;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(34, 197, 94, 0.45) !important;
    }

    &:disabled, &.ant-btn-disabled {
      background: $border !important;
      box-shadow: none !important;
      color: $text-muted !important;
    }
  }
}

/* --- 新增：AI 面板在非 VIP 状态下的变灰处理 --- */
.ai-panel.vip-only {
  background: #f8f9fa;
  border: 1px solid #eee;
  .ai-icon, .ai-panel-title { color: #999; }
  .ai-icon { background: #eee; border-color: #ddd; }
}

/* --- 新增：标题旁的小 VIP 标签 --- */
.vip-badge-small {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: white;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
  font-weight: 800;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.2);
}

/* --- 新增：未升级时的提示区域布局 --- */
.vip-upgrade-notice {
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  p {
    margin: 0;
    color: $text-sub;
    font-size: 14px;
  }

  .lock-icon {
    color: $text-muted;
    margin-bottom: 4px;
    color: #9ca3af;
    background: #ffffff;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  /* --- 新增：亮眼的黄金色升级按钮 --- */
  .upgrade-btn {
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    color: #5c3b00;
    padding: 8px 24px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 15px rgba(255, 215, 0, 0.4);
    }
  }
}
</style>