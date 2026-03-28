<template>
  <div class="vip-page">

    <!-- 顶部 Hero 区域 -->
    <div class="hero-section">
      <div class="hero-bg-orb orb-1"></div>
      <div class="hero-bg-orb orb-2"></div>
      <div class="hero-inner">
        <div class="hero-badge">
          <CrownOutlined />
          <span>永久会员</span>
        </div>
        <h1 class="hero-title">解锁全部创作能力</h1>
        <p class="hero-sub">一次购买，终身使用，无限配额，所有高级功能全解锁</p>

        <!-- 已是 VIP 的特殊提示 -->
        <div v-if="isVip" class="already-vip-notice">
          <div class="notice-icon"><CheckCircleOutlined /></div>
          <div>
            <div class="notice-title">您已是永久会员 🎉</div>
            <div class="notice-sub">享受全部高级功能，感谢您的支持！</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">

      <!-- ── 主内容区：价格卡 + 特权列表 ── -->
      <div class="main-grid">

        <!-- 左：价格卡 -->
        <div class="pricing-col">
          <div class="pricing-card" :class="{ 'is-vip': isVip }">

            <div class="pricing-tag">限时优惠</div>

            <!-- 图标 + 方案名 -->
            <div class="plan-header">
              <div class="plan-icon-wrap">
                <CrownOutlined class="plan-icon" />
              </div>
              <div class="plan-name">永久会员</div>
              <div class="plan-desc">一次买断，终身有效</div>
            </div>

            <!-- 价格 -->
            <div class="price-block">
              <div class="price-row">
                <span class="price-currency">$</span>
                <span class="price-value">199</span>
                <span class="price-period">/永久</span>
              </div>
              <div class="price-original">
                <span>原价</span>
                <span class="price-strike">$299</span>
                <span class="price-save">省 $100</span>
              </div>
            </div>

            <div class="pricing-divider"></div>

            <!-- 功能列表 -->
            <ul class="pricing-features">
              <li v-for="(item, i) in pricingFeatures" :key="i" class="pricing-feature">
                <div class="feature-check-icon">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>{{ item }}</span>
              </li>
            </ul>

            <!-- 购买按钮 -->
            <a-button
                type="primary"
                size="large"
                :loading="purchasing"
                :disabled="isVip"
                @click="handlePurchase"
                class="purchase-btn"
            >
              <template #icon><ThunderboltOutlined /></template>
              {{ isVip ? '您已是永久会员' : '立即升级 · $199' }}
            </a-button>

            <!-- 安全提示 -->
            <div class="security-row">
              <SafetyOutlined />
              <span>Stripe 安全支付 · 7 天无理由退款</span>
            </div>

          </div>
        </div>

        <!-- 右：特权卡片网格 -->
        <div class="features-col">
          <div class="features-header">
            <h2 class="features-title">会员专属特权</h2>
            <p class="features-sub">解锁之后，这些全部是你的</p>
          </div>
          <div class="features-grid">
            <div
                v-for="(feature, i) in features"
                :key="i"
                class="feature-card"
                :style="{ '--delay': `${i * 0.06}s` }"
            >
              <div class="feature-icon-box" :style="{ background: feature.bg, color: feature.color }">
                <component :is="feature.icon" class="feature-icon" />
              </div>
              <div class="feature-body">
                <h4 class="feature-title">{{ feature.title }}</h4>
                <p class="feature-desc">{{ feature.desc }}</p>
              </div>
              <div class="feature-tag" :style="{ color: feature.color, background: feature.bg }">
                {{ feature.tag }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 数据对比条 ── -->
      <div class="compare-section">
        <h2 class="compare-title">免费版 vs 永久会员</h2>
        <div class="compare-table">
          <div class="compare-head">
            <div class="compare-cell feature-col">功能</div>
            <div class="compare-cell center-col">
              <span class="plan-label free">免费版</span>
            </div>
            <div class="compare-cell center-col">
              <span class="plan-label vip">永久会员</span>
            </div>
          </div>
          <div v-for="(row, i) in compareRows" :key="i" class="compare-row" :class="{ 'alt': i % 2 === 1 }">
            <div class="compare-cell feature-col">{{ row.feature }}</div>
            <div class="compare-cell center-col">
              <span v-if="row.free === true" class="check-yes">✓</span>
              <span v-else-if="row.free === false" class="check-no">✕</span>
              <span v-else class="check-text">{{ row.free }}</span>
            </div>
            <div class="compare-cell center-col">
              <span v-if="row.vip === true" class="check-yes vip-yes">✓</span>
              <span v-else-if="row.vip === false" class="check-no">✕</span>
              <span v-else class="check-text vip-text">{{ row.vip }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── FAQ ── -->
      <div class="faq-section">
        <div class="faq-header">
          <h2 class="faq-title">常见问题</h2>
          <p class="faq-sub">还有疑问？随时联系我们</p>
        </div>
        <div class="faq-grid">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-card">
            <div class="faq-q-wrap">
              <div class="faq-q-icon">Q</div>
              <h4 class="faq-question">{{ faq.question }}</h4>
            </div>
            <p class="faq-answer">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  CrownOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  PictureOutlined,
  AppstoreOutlined,
  EditOutlined,
  StarOutlined,
  GiftOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/loginUser'
import { createVipPaymentSession } from '@/api/paymentController'
import { USER_ROLE_VIP, USER_ROLE_ADMIN } from '@/constants/user'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()
const purchasing = ref(false)

const isVip = computed(() =>
    loginUserStore.loginUser.userRole === USER_ROLE_VIP ||
    loginUserStore.loginUser.userRole === USER_ROLE_ADMIN
)

// ── 数据 ─────────────────────────────────────────────────────────
const features = [
  {
    icon: RocketOutlined,
    title: '无限创作配额',
    desc: '无限次使用文章创作功能，不再受次数限制',
    tag: '核心',
    bg: 'rgba(34, 197, 94, 0.1)',
    color: '#16A34A',
  },
  {
    icon: PictureOutlined,
    title: 'AI 智能生图',
    desc: '使用 Nano Banana AI 生成独特风格配图',
    tag: 'VIP 专属',
    bg: 'rgba(124, 58, 237, 0.1)',
    color: '#7c3aed',
  },
  {
    icon: AppstoreOutlined,
    title: 'SVG 图表生成',
    desc: '自动生成精美概念示意图和思维导图',
    tag: 'VIP 专属',
    bg: 'rgba(37, 99, 235, 0.1)',
    color: '#2563eb',
  },
  {
    icon: EditOutlined,
    title: 'AI 大纲编辑',
    desc: '用自然语言驱动 AI 重构文章大纲结构',
    tag: 'VIP 专属',
    bg: 'rgba(245, 158, 11, 0.1)',
    color: '#d97706',
  },
  {
    icon: StarOutlined,
    title: '优先生成队列',
    desc: '高峰期优先处理，享受更快生成速度',
    tag: '特权',
    bg: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
  },
  {
    icon: GiftOutlined,
    title: '终身有效',
    desc: '一次购买，永久使用，无任何续费',
    tag: '买断制',
    bg: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
  },
]

const pricingFeatures = [
  '无限文章创作配额',
  'AI 生图 & SVG 图表',
  'AI 辅助大纲编辑',
  '优先生成队列',
  '全部配图方式解锁',
  '终身有效，无需续费',
]

const compareRows = [
  { feature: '文章创作次数', free: '5 次', vip: '无限次' },
  { feature: 'Pexels 真实配图', free: true, vip: true },
  { feature: 'Mermaid 图表', free: true, vip: true },
  { feature: '优先生成队列', free: true, vip: true },
  { feature: 'SVG 概念图', free: false, vip: true },
  { feature: 'AI 生图（Nano Banana）', free: false, vip: true },
  { feature: 'AI 大纲智能编辑', free: false, vip: true },
]

const faqs = [
  {
    question: '支付后多久生效？',
    answer: '支付成功后立即生效，刷新页面即可看到会员权益，无需等待。',
  },
  {
    question: '如何申请退款？',
    answer: '购买后 7 天内如不满意，可通过反馈渠道申请退款，退款成功后会员权限将同步撤销。',
  },
  {
    question: '会员需要续费吗？',
    answer: '不需要。永久会员为买断制，一次购买，终身有效，未来功能更新也同步享受。',
  },
  {
    question: '支付方式安全吗？',
    answer: '我们接入 Stripe 国际支付平台，全程 SSL 加密，不存储任何卡号信息，安全可靠。',
  },
]

// ── 逻辑 ─────────────────────────────────────────────────────────
onMounted(async () => {
  const success = route.query.success
  const cancelled = route.query.cancelled

  if (success === 'true') {
    await loginUserStore.fetchLoginUser()
    Modal.success({
      title: '支付成功！',
      content: '恭喜您成为永久会员，已解锁全部高级功能！',
      okText: '开始创作',
      onOk: () => router.push('/create'),
    })
    router.replace('/vip')
  } else if (cancelled === 'true') {
    message.info('支付已取消')
    router.replace('/vip')
  }
})

const handlePurchase = async () => {
  if (!loginUserStore.loginUser.id) {
    message.warning('请先登录')
    router.push('/user/login')
    return
  }
  if (isVip.value) {
    message.info('您已经是永久会员')
    return
  }
  purchasing.value = true
  try {
    const res = await createVipPaymentSession()
    if (res.data.code === 0 && res.data.data) {
      window.location.href = res.data.data
    } else {
      message.error(res.data.message || '创建支付失败')
    }
  } catch (error) {
    console.error('创建支付失败:', error)
    message.error('创建支付失败，请稍后重试')
  } finally {
    purchasing.value = false
  }
}
</script>

<style scoped lang="scss">
$green: #22C55E;
$green-dark: #16A34A;
$green-light: #DCFCE7;
$green-mid: rgba(34, 197, 94, 0.12);
$amber: #f59e0b;
$amber-dark: #d97706;
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
$shadow-lg: 0 12px 40px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.06);
$shadow-xl: 0 20px 60px rgba(0,0,0,.14), 0 8px 24px rgba(0,0,0,.08);

.vip-page {
  min-height: calc(100vh - 64px);
  background: $bg;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

// ─── Hero ─────────────────────────────────────────────────────────
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 72px 24px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;

  &.orb-1 {
    width: 400px;
    height: 400px;
    background: rgba(34, 197, 94, 0.15);
    top: -100px;
    left: -50px;
  }

  &.orb-2 {
    width: 300px;
    height: 300px;
    background: rgba(245, 158, 11, 0.1);
    bottom: -80px;
    right: 100px;
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 18px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 24px;
  letter-spacing: 0.3px;
}

.hero-title {
  font-size: 44px;
  font-weight: 900;
  color: #f8fafc;
  margin: 0 0 14px;
  letter-spacing: -1px;
  line-height: 1.15;
}

.hero-sub {
  font-size: 16px;
  color: #94a3b8;
  margin: 0 0 32px;
  line-height: 1.6;
}

.already-vip-notice {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 16px 24px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: $radius-lg;
  text-align: left;
}

.notice-icon {
  font-size: 24px;
  color: $green;
  flex-shrink: 0;
}

.notice-title {
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 3px;
}

.notice-sub {
  font-size: 13px;
  color: #94a3b8;
}

// ─── Page Body ────────────────────────────────────────────────────
.page-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

// ─── Main Grid ────────────────────────────────────────────────────
.main-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
  align-items: start;
}

// ─── Pricing Card ─────────────────────────────────────────────────
.pricing-col {
  position: sticky;
  top: 88px;
}

.pricing-card {
  background: $white;
  border-radius: $radius-xl;
  padding: 32px 28px;
  box-shadow: $shadow-xl;
  border: 2px solid $green;
  position: relative;

  &.is-vip {
    border-color: $amber;
    box-shadow: 0 20px 60px rgba(245, 158, 11, 0.15), 0 8px 24px rgba(0,0,0,.08);
  }
}

.pricing-tag {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  padding: 5px 18px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(34, 197, 94, 0.35);
  letter-spacing: 0.3px;
}

.plan-header {
  text-align: center;
  margin-bottom: 20px;
}

.plan-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: $radius-lg;
  background: linear-gradient(135deg, rgba(245,158,11,.15), rgba(245,158,11,.05));
  border: 1px solid rgba(245,158,11,.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.plan-icon {
  font-size: 26px;
  color: $amber;
}

.plan-name {
  font-size: 20px;
  font-weight: 800;
  color: $text;
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.plan-desc {
  font-size: 13px;
  color: $text-muted;
}

.price-block {
  text-align: center;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 6px;
}

.price-currency {
  font-size: 20px;
  font-weight: 600;
  color: $text-sub;
}

.price-value {
  font-size: 56px;
  font-weight: 900;
  color: $green;
  line-height: 1;
  letter-spacing: -2px;
}

.price-period {
  font-size: 14px;
  color: $text-muted;
  margin-left: 2px;
}

.price-original {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: $text-muted;
}

.price-strike {
  text-decoration: line-through;
}

.price-save {
  padding: 2px 8px;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-radius: 20px;
  font-weight: 700;
  font-size: 12px;
}

.pricing-divider {
  height: 1px;
  background: $border-light;
  margin: 20px 0;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pricing-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: $text;
}

.feature-check-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $green;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.purchase-btn {
  &.ant-btn {
    width: 100%;
    height: 52px;
    font-size: 15px;
    font-weight: 700;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $green 0%, $green-dark 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4) !important;
    letter-spacing: 0.3px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.5) !important;
    }

    &:disabled, &.ant-btn-disabled {
      background: linear-gradient(135deg, $amber 0%, $amber-dark 100%) !important;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
      color: white !important;
      opacity: 1;
    }
  }
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 12px;
  color: $text-muted;

  :deep(.anticon) { color: $green; }
}

// ─── Features ─────────────────────────────────────────────────────
.features-col {}

.features-header { margin-bottom: 20px; }

.features-title {
  font-size: 22px;
  font-weight: 800;
  color: $text;
  margin: 0 0 6px;
  letter-spacing: -0.4px;
}

.features-sub {
  font-size: 14px;
  color: $text-sub;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.4s ease both;
  animation-delay: var(--delay);

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: rgba(34, 197, 94, 0.2);
  }
}

.feature-icon-box {
  width: 40px;
  height: 40px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon { font-size: 18px; }

.feature-body { flex: 1; min-width: 0; }

.feature-title {
  font-size: 14px;
  font-weight: 700;
  color: $text;
  margin: 0 0 4px;
}

.feature-desc {
  font-size: 12px;
  color: $text-sub;
  margin: 0;
  line-height: 1.5;
}

.feature-tag {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

// ─── Compare Table ────────────────────────────────────────────────
.compare-section {}

.compare-title {
  font-size: 22px;
  font-weight: 800;
  color: $text;
  margin: 0 0 20px;
  letter-spacing: -0.4px;
}

.compare-table {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.compare-head {
  display: grid;
  grid-template-columns: 1fr 160px 160px;
  background: $bg;
  border-bottom: 1px solid $border;
}

.compare-row {
  display: grid;
  grid-template-columns: 1fr 160px 160px;
  border-bottom: 1px solid $border-light;

  &:last-child { border-bottom: none; }
  &.alt { background: $bg; }
}

.compare-cell {
  padding: 14px 20px;
  font-size: 14px;
  color: $text-sub;
  display: flex;
  align-items: center;

  &.feature-col { font-weight: 500; color: $text; }
  &.center-col { justify-content: center; }
}

.plan-label {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;

  &.free { background: $border-light; color: $text-muted; }
  &.vip { background: $green-mid; color: $green-dark; }
}

.check-yes {
  font-size: 16px;
  font-weight: 700;
  color: $text-muted;

  &.vip-yes { color: $green; }
}

.check-no {
  font-size: 16px;
  color: #d1d5db;
}

.check-text {
  font-size: 13px;
  color: $text-muted;

  &.vip-text { color: $green-dark; font-weight: 600; }
}

// ─── FAQ ─────────────────────────────────────────────────────────
.faq-section {}

.faq-header { margin-bottom: 20px; }

.faq-title {
  font-size: 22px;
  font-weight: 800;
  color: $text;
  margin: 0 0 6px;
  letter-spacing: -0.4px;
}

.faq-sub {
  font-size: 14px;
  color: $text-sub;
  margin: 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.faq-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.15s;

  &:hover { box-shadow: $shadow-md; }
}

.faq-q-wrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.faq-q-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: $green-mid;
  color: $green-dark;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.faq-question {
  font-size: 14px;
  font-weight: 700;
  color: $text;
  margin: 0;
  line-height: 1.4;
}

.faq-answer {
  font-size: 13px;
  color: $text-sub;
  margin: 0;
  line-height: 1.7;
  padding-left: 32px;
}

// ─── Animations ───────────────────────────────────────────────────
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

// ─── Responsive ───────────────────────────────────────────────────
@media (max-width: 1024px) {
  .main-grid { grid-template-columns: 320px 1fr; gap: 24px; }
}

@media (max-width: 860px) {
  .main-grid { grid-template-columns: 1fr; }
  .pricing-col { position: static; }
  .pricing-card { max-width: 440px; margin: 0 auto; }
  .features-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .hero-title { font-size: 32px; }
  .faq-grid { grid-template-columns: 1fr; }
  .compare-head, .compare-row { grid-template-columns: 1fr 110px 110px; }
  .compare-cell { padding: 12px 14px; font-size: 13px; }
  .page-body { padding: 32px 16px 60px; gap: 40px; }
}
</style>