<template>
  <footer class="global-footer">
    <div class="footer-container">
      <div class="footer-divider"></div>

      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-info">
            <img src="@/assets/logo.png" alt="Logo" class="footer-logo" />
            <span class="brand-title">AI文章创作器</span>
          </div>
          <p class="brand-slogan">
            基于 Human-in-the-Loop 理念，<br />
            让每一篇 AI 生成的文章都充满灵魂。
          </p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4 class="group-title">产品</h4>
            <RouterLink to="/create">开始创作</RouterLink>
            <RouterLink to="/vip">会员权益</RouterLink>
          </div>
          <div class="link-group">
            <h4 class="group-title">资源</h4>
            <RouterLink to="/article/list">我的文章</RouterLink>
            <a href="https://github.com" target="_blank">开源仓库</a>
          </div>
        </div>

        <div class="footer-status">
          <div class="status-card">
            <div class="status-dot"></div>
            <span>服务运行正常</span>
          </div>
          <div class="social-links">
            <span class="social-text">Build with ❤️ by Leo Zheng</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ new Date().getFullYear() }} AI文章创作器. All Rights Reserved.
        </p>
        <div class="legal-links">
          <span>隐私政策</span>
          <span class="dot">·</span>
          <span>服务条款</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
// 引入与首页一致的颜色变量
$green: #22C55E;
$green-dark: #16A34A;
$text: #111827;
$text-sub: #6B7280;
$text-muted: #9CA3AF;
$border: #E5E7EB;
$white: #ffffff;
$bg-light: #F9FAFB;

.global-footer {
  background: $white;
  border-top: 1px solid $border;
  padding-top: 40px;
  padding-bottom: 30px;
  margin-top: 60px;
  font-family: -apple-system, 'PingFang SC', sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

// ─── Brand Section ───
.footer-brand {
  flex: 1;
  min-width: 240px;

  .brand-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;

    .footer-logo {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: $text;
      letter-spacing: -0.5px;
    }
  }

  .brand-slogan {
    font-size: 14px;
    color: $text-sub;
    line-height: 1.6;
    margin: 0;
  }
}

// ─── Links Section ───
.footer-links {
  display: flex;
  gap: 60px;

  .link-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .group-title {
      font-size: 14px;
      font-weight: 700;
      color: $text;
      margin-bottom: 4px;
    }

    a {
      font-size: 14px;
      color: $text-sub;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: $green;
      }
    }
  }
}

// ─── Status Section ───
.footer-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;

  .status-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: #f0fdf4;
    border: 1px solid #dcfce7;
    border-radius: 20px;
    font-size: 12px;
    color: $green-dark;
    font-weight: 600;

    .status-dot {
      width: 6px;
      height: 6px;
      background: $green;
      border-radius: 50%;
      box-shadow: 0 0 6px $green;
    }
  }

  .social-text {
    font-size: 12px;
    color: $text-muted;
  }
}

// ─── Bottom Section ───
.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid $border;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  .copyright {
    font-size: 13px;
    color: $text-muted;
    margin: 0;
  }

  .legal-links {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $text-muted;

    .dot {
      opacity: 0.5;
    }

    span:not(.dot) {
      cursor: pointer;
      &:hover {
        color: $text-sub;
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .footer-brand .brand-info {
    justify-content: center;
  }

  .footer-links {
    gap: 40px;
  }

  .footer-status {
    align-items: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>