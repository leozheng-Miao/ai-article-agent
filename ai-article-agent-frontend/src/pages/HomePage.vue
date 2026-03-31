<template>
  <div class="home-page">

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-bg-orb orb-1"></div>
      <div class="hero-bg-orb orb-2"></div>
      <div class="hero-bg-orb orb-3"></div>

      <div class="hero-inner">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Human-in-the-Loop · 三步协作创作
        </div>

        <h1 class="hero-title">
          AI 爆款文章<br />
          <span class="hero-title-accent">创作器</span>
        </h1>

        <p class="hero-sub">
          输入选题，AI 生成标题 → 你选择 → AI 生成大纲 → 你确认 → 全自动生成图文并茂的爆款文章
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">5 <span class="stat-unit">分钟</span></div>
            <div class="stat-label">完成一篇</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">6 <span class="stat-unit">步</span></div>
            <div class="stat-label">智能体协作</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">10x <span class="stat-unit"></span></div>
            <div class="stat-label">效率提升</div>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn-primary" @click="goToCreate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            立即开始创作
          </button>
          <button class="btn-secondary" @click="goToList">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            我的文章
          </button>
        </div>
      </div>

      <!-- 右侧装饰：流程预览卡 -->
      <div class="hero-visual">
        <div class="flow-preview">
          <div class="flow-step-card" v-for="(step, i) in flowSteps" :key="i" :style="{ '--i': i }">
            <div class="fsc-icon" :style="{ background: step.bg, color: step.color }">
              {{ step.emoji }}
            </div>
            <div class="fsc-body">
              <div class="fsc-title">{{ step.title }}</div>
              <div class="fsc-sub">{{ step.sub }}</div>
            </div>
            <div class="fsc-role" :class="step.role === 'human' ? 'role-human' : 'role-ai'">
              {{ step.role === 'human' ? '👤 你' : '🤖 AI' }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 核心功能 ── -->
    <section class="features-section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-label">核心能力</div>
          <h2 class="section-title">六大智能体，全流程自动化</h2>
          <p class="section-sub">从选题到成文，每一步都有 AI 加持，每一步都有你把控</p>
        </div>

        <div class="features-grid">
          <div
              v-for="(feature, i) in features"
              :key="i"
              class="feature-card"
              :style="{ '--delay': `${i * 0.07}s` }"
          >
            <div class="fc-icon-wrap" :style="{ background: feature.bg }">
              <span class="fc-emoji">{{ feature.emoji }}</span>
            </div>
            <div class="fc-body">
              <h3 class="fc-title">{{ feature.title }}</h3>
              <p class="fc-desc">{{ feature.desc }}</p>
            </div>
            <div class="fc-tag" :style="{ color: feature.tagColor, background: feature.tagBg }">
              {{ feature.tag }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 流程说明 ── -->
    <section class="flow-section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-label">工作流程</div>
          <h2 class="section-title">Human-in-the-Loop 三阶段创作</h2>
          <p class="section-sub">AI 生成，你决策，保证每篇文章都符合你的预期</p>
        </div>

        <div class="flow-phases">
          <template v-for="(phase, i) in phases" :key="i">
            <div class="phase-card">
              <div class="phase-num">{{ i + 1 }}</div>
              <div class="phase-icon">{{ phase.emoji }}</div>
              <h3 class="phase-title">{{ phase.title }}</h3>
              <p class="phase-desc">{{ phase.desc }}</p>
              <div class="phase-steps">
                <div v-for="(step, j) in phase.steps" :key="j" class="phase-step">
                  <span class="step-dot" :class="step.type"></span>
                  <span>{{ step.text }}</span>
                </div>
              </div>
            </div>
            <div v-if="i < phases.length - 1" class="phase-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
<!--            <div class="phase-arrow" v-for="i in 2" :key="`arrow-${i}`" :style="{ gridColumn: i * 2 }">-->
<!--              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">-->
<!--                <path d="M5 12h14M12 5l7 7-7 7" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--              </svg>-->
<!--            </div>-->
          </template>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="cta-section">
      <div class="cta-inner">
        <div class="cta-badge">🚀 免费开始</div>
        <h2 class="cta-title">准备好了吗？</h2>
        <p class="cta-sub">注册即送 5 次免费创作机会，升级 VIP 享无限次数</p>
        <button class="btn-primary large" @click="goToCreate">开始我的第一篇文章</button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goToCreate = () => router.push('/create')
const goToList = () => router.push('/article/list')

const flowSteps = [
  { emoji: '✍️', title: '输入选题', sub: '一句话描述你的想法', role: 'human', bg: 'rgba(34,197,94,.1)', color: '#16A34A' },
  { emoji: '🤖', title: 'AI 生成标题', sub: '多个方案供你挑选', role: 'ai', bg: 'rgba(124,58,237,.1)', color: '#7c3aed' },
  { emoji: '👤', title: '选择标题', sub: '或自定义标题', role: 'human', bg: 'rgba(245,158,11,.1)', color: '#d97706' },
  { emoji: '🤖', title: 'AI 生成大纲', sub: '流式展示，实时预览', role: 'ai', bg: 'rgba(124,58,237,.1)', color: '#7c3aed' },
  { emoji: '👤', title: '编辑大纲', sub: '拖拽调序 · AI 辅助', role: 'human', bg: 'rgba(245,158,11,.1)', color: '#d97706' },
  { emoji: '🚀', title: '全自动生成', sub: '正文 + 配图 + 合成', role: 'ai', bg: 'rgba(34,197,94,.1)', color: '#16A34A' },
]

const features = [
  { emoji: '📝', title: '智能标题生成', desc: '一次生成多个标题方案，覆盖不同风格和角度，选你最满意的', tag: '必备', tagColor: '#16A34A', tagBg: 'rgba(34,197,94,.1)', bg: 'rgba(34,197,94,.08)' },
  { emoji: '📋', title: '大纲规划', desc: '基于选题和标题智能规划章节结构，可拖拽排序、AI 辅助修改', tag: '交互', tagColor: '#7c3aed', tagBg: 'rgba(124,58,237,.1)', bg: 'rgba(124,58,237,.06)' },
  { emoji: '⚡', title: '流式正文生成', desc: '实时展示写作过程，像打字机一样逐字输出，所见即所得', tag: '实时', tagColor: '#2563eb', tagBg: 'rgba(37,99,235,.1)', bg: 'rgba(37,99,235,.06)' },
  { emoji: '🖼️', title: '智能配图', desc: '自动分析正文，从 Pexels / AI 生图 / SVG 等多源匹配最佳配图', tag: '自动', tagColor: '#d97706', tagBg: 'rgba(245,158,11,.1)', bg: 'rgba(245,158,11,.06)' },
  { emoji: '🎨', title: '多种文章风格', desc: '科技、情感、教育、幽默四种风格，让文章风格与内容完美契合', tag: '个性化', tagColor: '#dc2626', tagBg: 'rgba(239,68,68,.1)', bg: 'rgba(239,68,68,.06)' },
  { emoji: '💾', title: 'Markdown 导出', desc: '一键导出标准 Markdown 格式，轻松发布到各大内容平台', tag: '效率', tagColor: '#059669', tagBg: 'rgba(16,185,129,.1)', bg: 'rgba(16,185,129,.06)' },
]

const phases = [
  {
    emoji: '🎯',
    title: '阶段一：标题确定',
    desc: 'AI 生成多个标题方案，由你选择最满意的方向',
    steps: [
      { text: 'AI 生成 3 个标题方案', type: 'ai' },
      { text: '你选择或自定义标题', type: 'human' },
      { text: '可补充描述引导大纲', type: 'human' },
    ],
  },
  {
    emoji: '🗂️',
    title: '阶段二：大纲编辑',
    desc: 'AI 规划章节结构，你可以自由编辑和优化',
    steps: [
      { text: 'AI 流式生成大纲', type: 'ai' },
      { text: '拖拽调整章节顺序', type: 'human' },
      { text: 'AI 助手辅助修改', type: 'ai' },
    ],
  },
  {
    emoji: '✨',
    title: '阶段三：全自动生成',
    desc: '确认大纲后，AI 全自动完成正文、配图和合成',
    steps: [
      { text: '流式生成高质量正文', type: 'ai' },
      { text: '智能分析配图需求', type: 'ai' },
      { text: '图文合成，一键导出', type: 'ai' },
    ],
  },
]
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

.home-page {
  width: 100%;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

// ─── Hero ─────────────────────────────────────────────────────────
.hero {
  position: relative;
  background: linear-gradient(135deg, #0c1445 0%, #0f172a 40%, #1a0533 100%);
  min-height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: 1fr 480px;
  align-items: center;
  gap: 40px;
  padding: 80px 80px 80px 80px;
  overflow: hidden;
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;

  &.orb-1 { width: 500px; height: 500px; background: rgba(34,197,94,.12); top: -100px; left: -100px; }
  &.orb-2 { width: 400px; height: 400px; background: rgba(124,58,237,.1); bottom: -80px; right: 400px; }
  &.orb-3 { width: 300px; height: 300px; background: rgba(245,158,11,.08); top: 100px; right: 100px; }
}

.hero-inner { position: relative; z-index: 1; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  background: rgba(34,197,94,.12);
  border: 1px solid rgba(34,197,94,.25);
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  color: #86efac;
  margin-bottom: 28px;
  letter-spacing: 0.3px;
}

.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: $green;
  box-shadow: 0 0 6px $green;
  animation: pulse-dot 2s infinite;
}

.hero-title {
  font-size: 58px;
  font-weight: 900;
  color: #f8fafc;
  margin: 0 0 20px;
  line-height: 1.1;
  letter-spacing: -2px;
}

.hero-title-accent {
  background: linear-gradient(135deg, $green, #86efac);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.7;
  margin: 0 0 36px;
  max-width: 520px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.stat-item { text-align: center; }

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: $green;
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -0.5px;

  .stat-unit { font-size: 14px; font-weight: 600; color: #86efac; }
}

.stat-label { font-size: 12px; color: #64748b; }

.stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,.1); }

.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

// ─── Buttons ──────────────────────────────────────────────────────
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: $radius-md;
  border: none;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(34,197,94,.4);
  letter-spacing: 0.2px;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,197,94,.5); }
  &:active { transform: translateY(0); }

  &.large { padding: 16px 40px; font-size: 16px; border-radius: $radius-lg; }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: $radius-md;
  border: 1.5px solid rgba(255,255,255,.15);
  background: rgba(255,255,255,.06);
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);

  &:hover { border-color: rgba(34,197,94,.4); background: rgba(34,197,94,.08); color: #86efac; }
}

// ─── Hero Visual ──────────────────────────────────────────────────
.hero-visual { position: relative; z-index: 1; }

.flow-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flow-step-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: $radius-md;
  backdrop-filter: blur(8px);
  animation: slideInRight 0.4s ease both;
  animation-delay: calc(var(--i) * 0.08s);
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,.1); }
}

.fsc-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.fsc-body { flex: 1; min-width: 0; }

.fsc-title { font-size: 13px; font-weight: 700; color: #f1f5f9; margin-bottom: 2px; }
.fsc-sub { font-size: 11px; color: #64748b; }

.fsc-role {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  flex-shrink: 0;

  &.role-human { background: rgba(245,158,11,.15); color: #fbbf24; }
  &.role-ai { background: rgba(124,58,237,.15); color: #a78bfa; }
}

// ─── Section Commons ──────────────────────────────────────────────
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-label {
  display: inline-block;
  padding: 5px 14px;
  background: $green-mid;
  color: $green-dark;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: $text;
  margin: 0 0 12px;
  letter-spacing: -0.6px;
}

.section-sub { font-size: 15px; color: $text-sub; margin: 0; }

// ─── Features ─────────────────────────────────────────────────────
.features-section {
  padding: 96px 0;
  background: $bg;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.feature-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-xl;
  padding: 24px;
  box-shadow: $shadow-sm;
  transition: all 0.22s;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.4s ease both;
  animation-delay: var(--delay);

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    border-color: rgba(34,197,94,.2);
  }
}

.fc-icon-wrap {
  width: 48px; height: 48px;
  border-radius: $radius-md;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}

.fc-emoji { font-size: 22px; }

.fc-title { font-size: 15px; font-weight: 700; color: $text; margin: 0 0 8px; letter-spacing: -0.2px; }
.fc-desc { font-size: 13px; color: $text-sub; line-height: 1.6; margin: 0; }

.fc-tag {
  position: absolute;
  top: 16px; right: 16px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.2px;
}

// ─── Flow Section ─────────────────────────────────────────────────
.flow-section {
  padding: 96px 0;
  background: $white;
}

.flow-phases {
  //display: flex;
  //grid-template-columns: 1fr auto 1fr auto 1fr;
  //gap: 0;
  //align-items: center;
  display: flex;
  align-items: stretch; // 让所有卡片高度一致
  justify-content: center;
  gap: 20px; // 卡片与箭头之间的间距
  flex-wrap: nowrap; // 电脑端不换行
}

//.phase-card {
//  background: $bg;
//  border: 1.5px solid $border;
//  border-radius: $radius-xl;
//  padding: 28px 24px;
//  transition: all 0.2s;
//
//  &:hover {
//    border-color: rgba(34,197,94,.3);
//    box-shadow: $shadow-md;
//    transform: translateY(-3px);
//  }
//}

.phase-card {
  flex: 1; // 均分空间
  min-width: 280px; // 保证卡片不会被挤得太窄
  background: $bg;
  border: 1.5px solid $border;
  border-radius: $radius-xl;
  padding: 32px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba(34, 197, 94, 0.4);
    background: $white; // 悬浮时变白，突出对比
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    transform: translateY(-8px);
  }
}

.phase-num {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  font-size: 14px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}

.phase-icon { font-size: 28px; margin-bottom: 12px; }
.phase-title { font-size: 16px; font-weight: 800; color: $text; margin: 0 0 8px; letter-spacing: -0.3px; }
.phase-desc { font-size: 13px; color: $text-sub; margin: 0 0 16px; line-height: 1.5; }

.phase-steps { display: flex; flex-direction: column; gap: 8px; }

.phase-step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: $text-sub;
}

.step-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;

  &.ai { background: #7c3aed; }
  &.human { background: #f59e0b; }
}

.phase-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: $green;

  // 加上一点微动的动画，更有引导感
  svg {
    animation: arrow-float 2s infinite ease-in-out;
  }
}

@keyframes arrow-float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

// 响应式处理：平板及手机端变垂直排列
@media (max-width: 1024px) {
  .flow-phases {
    flex-direction: column;
    align-items: center;
  }

  .phase-card {
    width: 100%;
    max-width: 500px;
  }

  .phase-arrow {
    transform: rotate(90deg); // 垂直排列时箭头向下
    padding: 10px 0;
  }
}

// ─── CTA ─────────────────────────────────────────────────────────
.cta-section {
  padding: 96px 48px;
  background: linear-gradient(135deg, #0c1445 0%, #0f172a 100%);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    background: rgba(34,197,94,.08);
    border-radius: 50%;
    filter: blur(80px);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
}

.cta-inner { position: relative; z-index: 1; }

.cta-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(34,197,94,.15);
  border: 1px solid rgba(34,197,94,.25);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #86efac;
  margin-bottom: 20px;
}

.cta-title {
  font-size: 42px;
  font-weight: 900;
  color: #f8fafc;
  margin: 0 0 14px;
  letter-spacing: -1px;
}

.cta-sub {
  font-size: 16px;
  color: #94a3b8;
  margin: 0 0 36px;
}

// ─── Animations ───────────────────────────────────────────────────
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// ─── Responsive ───────────────────────────────────────────────────
@media (max-width: 1200px) {
  .hero { grid-template-columns: 1fr; padding: 80px 48px; }
  .hero-visual { display: none; }
  .hero-title { font-size: 48px; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .flow-phases { grid-template-columns: 1fr; gap: 16px; }
  .phase-arrow { display: none; }
}

@media (max-width: 768px) {
  .hero { padding: 60px 24px; }
  .hero-title { font-size: 36px; }
  .hero-sub { font-size: 14px; }
  .features-grid { grid-template-columns: 1fr; }
  .section-inner { padding: 0 24px; }
  .features-section, .flow-section { padding: 64px 0; }
  .cta-section { padding: 64px 24px; }
  .cta-title { font-size: 30px; }
}
</style>