<template>
  <a-layout-footer class="footer">
    <div class="footer-content">
      <p class="copyright">
        <a
            href="https://www.codefather.cn"
            target="_blank"
            rel="noopener noreferrer"
            class="author-link"
        >
          编程导航原创项目
        </a>
      </p>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
// 无需额外的响应式数据
</script>

<style scoped>
.footer {
  background: var(--color-glass-bg);
  backdrop-filter: blur(10px);
  text-align: center;
  padding: 20px;
  margin-top: 40px;
  border-top: 1px solid var(--color-glass-border);
}

.copyright {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: 14px;
}
</style>