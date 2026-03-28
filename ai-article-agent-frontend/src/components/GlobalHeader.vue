<template>
  <header class="global-header">
    <div class="header-inner">

      <!-- 左侧：Logo + 标题 -->
      <RouterLink to="/" class="header-brand">
        <div class="brand-logo">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
        </div>
        <span class="brand-name">AI文章创作器</span>
      </RouterLink>

      <!-- 中间：导航 -->
      <nav class="header-nav">
        <RouterLink
            v-for="item in visibleMenuItems"
            :key="item.key"
            :to="item.key"
            :class="['nav-link', { active: selectedKey === item.key }]"
            @click="selectedKey = item.key"
        >
          <component :is="item.icon" class="nav-icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- 右侧：操作区 -->
      <div class="header-actions">

        <!-- 主题切换 -->
        <button class="icon-btn theme-btn" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'" @click="toggleTheme">
          <span>{{ isDark ? '🌙' : '☀️' }}</span>
        </button>

        <!-- 已登录 -->
        <template v-if="loginUserStore.loginUser.id">

          <!-- 未登录 VIP：升级按钮 -->
          <RouterLink v-if="!isVip" to="/vip" class="upgrade-btn">
            <CrownOutlined />
            <span>升级 VIP</span>
          </RouterLink>

          <!-- 已是 VIP：徽章 -->
          <RouterLink v-else to="/vip" class="vip-badge-btn">
            <CrownOutlined />
            <span>VIP</span>
          </RouterLink>

          <!-- 用户下拉 -->
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <div class="user-trigger">
              <a-avatar
                  :src="loginUserStore.loginUser.userAvatar"
                  :size="32"
                  class="user-avatar"
              />
              <span class="user-name">{{ loginUserStore.loginUser.userName ?? '用户' }}</span>
              <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <template #overlay>
              <div class="dropdown-panel">
                <!-- VIP 信息 -->
                <RouterLink v-if="isVip" to="/vip" class="dropdown-vip-item">
                  <div class="dropdown-vip-icon"><CrownOutlined /></div>
                  <div>
                    <div class="dropdown-vip-title">永久会员</div>
                    <div class="dropdown-vip-sub">点击查看专属权益</div>
                  </div>
                </RouterLink>
                <div v-if="isVip" class="dropdown-divider"></div>

                <!-- 退出 -->
                <button class="dropdown-item logout-item" @click="doLogout">
                  <LogoutOutlined />
                  <span>退出登录</span>
                </button>
              </div>
            </template>
          </a-dropdown>
        </template>

        <!-- 未登录 -->
        <RouterLink v-else to="/user/login" class="login-btn">
          登录
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/loginUser.ts'
import { userLogout } from '@/api/userController.ts'
import {
  LogoutOutlined,
  HomeOutlined,
  EditOutlined,
  UnorderedListOutlined,
  CrownOutlined,
} from '@ant-design/icons-vue'
import { useTheme } from '@/composables/useTheme'
import { USER_ROLE_ADMIN, USER_ROLE_VIP } from '@/constants/user.ts'

const loginUserStore = useLoginUserStore()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const selectedKey = ref(router.currentRoute.value.path)
router.afterEach((to) => { selectedKey.value = to.path })

const isVip = computed(() =>
    loginUserStore.loginUser.userRole === USER_ROLE_VIP ||
    loginUserStore.loginUser.userRole === USER_ROLE_ADMIN
)
const isAdmin = computed(() => loginUserStore.loginUser.userRole === USER_ROLE_ADMIN)

const allMenuItems = [
  { key: '/', label: '主页', icon: HomeOutlined },
  { key: '/create', label: '创作文章', icon: EditOutlined },
  { key: '/article/list', label: '我的文章', icon: UnorderedListOutlined },
  { key: '/admin/userManage', label: '用户管理', icon: UnorderedListOutlined, adminOnly: true },
]

const visibleMenuItems = computed(() =>
    allMenuItems.filter(item => !item.adminOnly || isAdmin.value)
)

const doLogout = async () => {
  const res = await userLogout()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({ userName: '未登录' })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped lang="scss">
$green: #22C55E;
$green-dark: #16A34A;
$green-mid: rgba(34, 197, 94, 0.12);
$text: #111827;
$text-sub: #6B7280;
$text-muted: #9CA3AF;
$border: #E5E7EB;
$white: #ffffff;
$bg: #F9FAFB;
$amber: #f59e0b;
$amber-dark: #d97706;
$radius-sm: 8px;
$radius-md: 10px;
$shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
$shadow-md: 0 4px 16px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06);

.global-header {
  height: 64px;
  background: $white;
  border-bottom: 1px solid $border;
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 0;
}

// ─── Brand ────────────────────────────────────────────────────────
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 32px;

  &:hover .brand-name { color: $green-dark; }
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-name {
  font-size: 16px;
  font-weight: 800;
  color: $text;
  white-space: nowrap;
  letter-spacing: -0.3px;
  transition: color 0.15s;
}

// ─── Nav ─────────────────────────────────────────────────────────
.header-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: $radius-sm;
  font-size: 13px;
  font-weight: 500;
  color: $text-sub;
  text-decoration: none;
  transition: all 0.15s;

  &:hover {
    background: $bg;
    color: $text;
  }

  &.active {
    background: $green-mid;
    color: $green-dark;
    font-weight: 600;
  }
}

.nav-icon {
  font-size: 14px;
  opacity: 0.8;
}

// ─── Actions ─────────────────────────────────────────────────────
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: $radius-sm;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.15s;

  &:hover { background: $bg; }
}

// 升级 VIP 按钮（未购买）
.upgrade-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: $radius-sm;
  border: 1.5px solid rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.06);
  color: $amber-dark;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s;
  letter-spacing: 0.2px;

  &:hover {
    border-color: $amber;
    background: rgba(245, 158, 11, 0.12);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(245, 158, 11, 0.2);
  }
}

// VIP 已购徽章
.vip-badge-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  color: #78350f;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  transition: all 0.15s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }

  :deep(.anticon) { font-size: 12px; }
}

// 用户触发器
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: $radius-sm;
  border: 1px solid $border;
  cursor: pointer;
  transition: all 0.15s;
  background: $white;

  &:hover {
    border-color: rgba(34, 197, 94, 0.4);
    background: $bg;
  }
}

.user-avatar {
  border: 1.5px solid $border;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: $text;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  color: $text-muted;
  flex-shrink: 0;
}

// 登录按钮
.login-btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 18px;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, $green, $green-dark);
  color: white;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
  transition: all 0.15s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  }
}

// ─── Dropdown Panel ───────────────────────────────────────────────
.dropdown-panel {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  min-width: 200px;
  padding: 6px;
  overflow: hidden;
}

.dropdown-vip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: $radius-sm;
  text-decoration: none;
  transition: background 0.15s;
  cursor: pointer;

  &:hover { background: rgba(245, 158, 11, 0.06); }
}

.dropdown-vip-icon {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $amber-dark;
  font-size: 14px;
  flex-shrink: 0;
}

.dropdown-vip-title {
  font-size: 13px;
  font-weight: 700;
  color: $amber-dark;
  margin-bottom: 1px;
}

.dropdown-vip-sub {
  font-size: 11px;
  color: $text-muted;
}

.dropdown-divider {
  height: 1px;
  background: $border;
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border-radius: $radius-sm;
  border: none;
  background: transparent;
  font-size: 13px;
  color: $text-sub;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;

  &:hover { background: $bg; color: $text; }

  &.logout-item:hover { background: rgba(239, 68, 68, 0.06); color: #ef4444; }
}
</style>