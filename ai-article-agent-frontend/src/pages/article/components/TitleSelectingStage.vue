<template>
  <div class="title-selecting-stage">

    <div class="stage-header">
      <div class="stage-badge">阶段 1 / 3</div>
      <h2 class="stage-title">选择标题方案</h2>
      <p class="stage-subtitle">AI 为您生成了以下标题方案，请选择一个继续创作</p>
    </div>

    <div class="title-options">
      <!-- AI 生成的标题选项 -->
      <div
          v-for="(option, index) in titleOptions"
          :key="index"
          :class="['title-card', { selected: selectedIndex === index }]"
          @click="selectedIndex = index"
      >
        <div class="title-card-left">
          <div class="radio-circle">
            <div v-if="selectedIndex === index" class="radio-dot"></div>
          </div>
          <div class="title-card-index">{{ index + 1 }}</div>
        </div>
        <div class="title-card-body">
          <div class="title-main">{{ option.mainTitle }}</div>
          <div class="title-sub">{{ option.subTitle }}</div>
        </div>
        <div v-if="selectedIndex === index" class="selected-indicator">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- 自定义标题选项 -->
      <div
          :class="['title-card', 'custom-card', { selected: selectedIndex === -1 }]"
          @click="selectedIndex = -1"
      >
        <div class="title-card-left">
          <div class="radio-circle">
            <div v-if="selectedIndex === -1" class="radio-dot"></div>
          </div>
          <div class="title-card-index custom-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="title-card-body">
          <div class="title-main custom-label">自定义标题</div>
          <div class="title-sub">手动输入主标题和副标题</div>
        </div>
      </div>
    </div>

    <!-- 自定义标题输入框 -->
    <Transition name="expand">
      <div v-if="selectedIndex === -1" class="custom-inputs">
        <div class="custom-input-row">
          <label class="custom-input-label">主标题</label>
          <a-input
              v-model:value="customMainTitle"
              placeholder="请输入主标题"
              size="large"
              class="custom-input"
          />
        </div>
        <div class="custom-input-row">
          <label class="custom-input-label">副标题</label>
          <a-input
              v-model:value="customSubTitle"
              placeholder="请输入副标题"
              size="large"
              class="custom-input"
          />
        </div>
      </div>
    </Transition>

    <!-- 补充描述 -->
    <div class="description-section">
      <div class="description-header">
        <div class="desc-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          补充描述
          <span class="optional-tag">可选</span>
        </div>
        <span class="desc-tip">告诉 AI 您对文章的期望和重点</span>
      </div>
      <a-textarea
          v-model:value="userDescription"
          placeholder="例如：请重点强调技术原理，用通俗的语言讲解，适合初学者阅读..."
          :rows="3"
          :maxlength="500"
          show-count
          class="description-textarea"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="stage-actions">
      <div class="action-hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        确认后将基于所选标题生成文章大纲
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
        确认并生成大纲
      </a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface TitleOption {
  mainTitle: string
  subTitle: string
}

interface Props {
  titleOptions: TitleOption[]
  loading?: boolean
}

interface Emits {
  (e: 'confirm', data: { mainTitle: string; subTitle: string; userDescription: string }): void
}

const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<Emits>()

const selectedIndex = ref<number>(0)
const customMainTitle = ref('')
const customSubTitle = ref('')
const userDescription = ref('')

const canConfirm = computed(() => {
  if (selectedIndex.value === -1) {
    return customMainTitle.value.trim().length > 0 && customSubTitle.value.trim().length > 0
  }
  return selectedIndex.value >= 0 && selectedIndex.value < props.titleOptions.length
})

const handleConfirm = () => {
  if (!canConfirm.value) return
  let mainTitle = ''
  let subTitle = ''
  if (selectedIndex.value === -1) {
    mainTitle = customMainTitle.value.trim()
    subTitle = customSubTitle.value.trim()
  } else {
    const selected = props.titleOptions[selectedIndex.value]
    mainTitle = selected.mainTitle
    subTitle = selected.subTitle
  }
  emit('confirm', { mainTitle, subTitle, userDescription: userDescription.value })
}
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
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
$shadow-md: 0 4px 16px rgba(0,0,0,.08);

.title-selecting-stage {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

// ─── Header ──────────────────────────────────────────────────────
.stage-header { text-align: center; }

.stage-badge {
  display: inline-block;
  padding: 4px 12px;
  background: $green-mid;
  color: $green-dark;
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

// ─── Title Options ────────────────────────────────────────────────
.title-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  background: $white;
  border: 1.5px solid $border;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all 0.18s;
  box-shadow: $shadow-sm;
  position: relative;

  &:hover {
    border-color: rgba(34, 197, 94, 0.4);
    box-shadow: $shadow-md;
    transform: translateY(-1px);
  }

  &.selected {
    border-color: $green;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.04) 0%, rgba(34, 197, 94, 0.02) 100%);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12), $shadow-sm;
  }

  &.custom-card {
    border-style: dashed;

    &.selected { border-style: solid; }
  }
}

.title-card-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-top: 2px;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
  flex-shrink: 0;

  .selected & { border-color: $green; }
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $green;
}

.title-card-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: $bg;
  border: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: $text-muted;
  flex-shrink: 0;
  transition: all 0.15s;

  .selected & {
    background: $green;
    border-color: $green;
    color: white;
  }

  &.custom-icon { color: $text-muted; }
  .selected &.custom-icon { color: white; }
}

.title-card-body { flex: 1; min-width: 0; }

.title-main {
  font-size: 15px;
  font-weight: 700;
  color: $text;
  margin-bottom: 5px;
  line-height: 1.4;

  &.custom-label { color: $text-sub; }
  .selected & { color: $text; }
}

.title-sub {
  font-size: 13px;
  color: $text-muted;
  line-height: 1.5;
}

.selected-indicator {
  color: $green;
  flex-shrink: 0;
  margin-top: 3px;
}

// ─── Custom Inputs ────────────────────────────────────────────────
.custom-inputs {
  background: $bg;
  border: 1px solid $border-light;
  border-radius: $radius-md;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-input-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.custom-input-label {
  font-size: 12px;
  font-weight: 600;
  color: $text-sub;
}

.custom-input {
  border-radius: $radius-sm !important;

  &:focus, &:hover { border-color: $green !important; }

  :deep(.ant-input:focus) {
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15) !important;
  }
}

// ─── Expand Transition ────────────────────────────────────────────
.expand-enter-active, .expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 300px;
}

// ─── Description ─────────────────────────────────────────────────
.description-section {
  background: $bg;
  border: 1px solid $border-light;
  border-radius: $radius-md;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.description-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.desc-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: $text-sub;
}

.optional-tag {
  padding: 2px 8px;
  background: $border-light;
  border-radius: 20px;
  font-size: 11px;
  color: $text-muted;
  font-weight: 500;
}

.desc-tip {
  font-size: 12px;
  color: $text-muted;
}

.description-textarea {
  border-radius: $radius-sm !important;
  font-size: 14px !important;

  :deep(textarea) { line-height: 1.6; }
  :deep(.ant-input:focus) { border-color: $green !important; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.12) !important; }
}

// ─── Actions ─────────────────────────────────────────────────────
.stage-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.action-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-muted;
}

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
</style>