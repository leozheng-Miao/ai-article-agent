<template>
  <div class="auth-shell">
    <div id="userRegisterPage" class="auth-panel">
      <h2 class="title">用户注册</h2>
      <p class="subtitle">创建账号，开始使用</p>
      <a-tabs v-model:activeKey="registerTab" class="register-tabs auth-tabs" size="large">
      <a-tab-pane key="password" tab="账号密码注册">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
          <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
          </a-form-item>
          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码不能小于 8 位' },
            ]"
          >
            <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
          </a-form-item>
          <a-form-item
            name="checkPassword"
            :rules="[
              { required: true, message: '请确认密码' },
              { min: 8, message: '密码不能小于 8 位' },
              { validator: validateCheckPassword },
            ]"
          >
            <a-input-password v-model:value="formState.checkPassword" placeholder="请确认密码" />
          </a-form-item>
          <div class="tips">
            已有账号？
            <RouterLink to="/user/login">去登录</RouterLink>
          </div>
          <a-form-item class="auth-submit-wrap">
            <a-button type="primary" html-type="submit" class="auth-submit-btn" block>注册</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="email" tab="邮箱验证码注册">
        <a-form
          :model="emailRegisterForm"
          name="emailRegister"
          autocomplete="off"
          @finish="handleEmailRegisterSubmit"
        >
          <a-form-item
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]"
          >
            <a-input v-model:value="emailRegisterForm.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
            <div class="code-with-btn">
              <a-input v-model:value="emailRegisterForm.code" placeholder="请输入验证码" />
              <a-button
                type="default"
                class="send-code-btn"
                :loading="sendRegisterCodeLoading"
                :disabled="emailRegisterCountdown.isCounting"
                @click.prevent="handleSendRegisterCode"
              >
                {{ emailRegisterCountdown.buttonText }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码不能小于 8 位' },
            ]"
          >
            <a-input-password
              v-model:value="emailRegisterForm.userPassword"
              placeholder="请输入密码"
            />
          </a-form-item>
          <a-form-item
            name="checkPassword"
            :rules="[
              { required: true, message: '请确认密码' },
              { min: 8, message: '密码不能小于 8 位' },
              { validator: validateEmailRegisterCheckPassword },
            ]"
          >
            <a-input-password
              v-model:value="emailRegisterForm.checkPassword"
              placeholder="请确认密码"
            />
          </a-form-item>
          <div class="tips">
            已有账号？
            <RouterLink to="/user/login">去登录</RouterLink>
          </div>
          <a-form-item class="auth-submit-wrap">
            <a-button type="primary" html-type="submit" class="auth-submit-btn" block>注册</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userRegister, userRegisterByEmail } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { useEmailCodeCountdown } from '@/composables/useEmailCodeCountdown.ts'
import { requestSendEmailCode } from '@/utils/sendEmailVerificationCode.ts'

const router = useRouter()

const registerTab = ref('password')

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const emailRegisterForm = reactive({
  email: '',
  code: '',
  userPassword: '',
  checkPassword: '',
})

const emailRegisterCountdown = useEmailCodeCountdown()
const sendRegisterCodeLoading = ref(false)

/**
 * 验证确认密码
 * @param rule
 * @param value
 * @param callback
 */
const validateCheckPassword = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value && value !== formState.userPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateEmailRegisterCheckPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (value && value !== emailRegisterForm.userPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const handleSendRegisterCode = () => {
  void requestSendEmailCode(
    emailRegisterForm.email,
    'register',
    emailRegisterCountdown.start,
    sendRegisterCodeLoading,
  )
}

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: API.UserRegisterRequest) => {
  const res = await userRegister(values)
  // 注册成功，跳转到登录页面
  if (res.data.code === 0) {
    message.success('注册成功')
    router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('注册失败，' + res.data.message)
  }
}

const handleEmailRegisterSubmit = async (values: typeof emailRegisterForm) => {
  try {
    const res = await userRegisterByEmail({
      email: values.email.trim(),
      code: values.code,
      userPassword: values.userPassword,
      checkPassword: values.checkPassword,
    })
    if (res.data.code === 0) {
      message.success('注册成功')
      router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      message.error('注册失败，' + (res.data.message ?? ''))
    }
  } catch {
    message.error('网络错误，请稍后重试')
  }
}
</script>

<style scoped>
.auth-shell {
  min-height: calc(100vh - 120px);
  padding: 40px 20px 56px;
  background: var(--gradient-surface);
}

.auth-panel {
  max-width: 440px;
  margin: 0 auto;
  padding: 40px 40px 36px;
  background: var(--color-bg-card);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--color-shadow);
  border: 1px solid var(--color-border);
}

.title {
  text-align: center;
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.03em;
}

.subtitle {
  text-align: center;
  margin: 0 0 28px;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.auth-tabs.register-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 28px;
}

.auth-tabs.register-tabs :deep(.ant-tabs-nav::before) {
  border-color: var(--color-border-weak);
}

.auth-tabs.register-tabs :deep(.ant-tabs-nav-list) {
  display: flex;
  width: 100%;
}

.auth-tabs.register-tabs :deep(.ant-tabs-tab) {
  flex: 1;
  margin: 0 !important;
  justify-content: center;
  padding: 12px 8px;
  font-weight: 500;
}

.auth-tabs.register-tabs :deep(.ant-tabs-tab-active) {
  font-weight: 600;
}

.auth-panel :deep(.ant-form-item) {
  margin-bottom: 20px;
}

.auth-panel :deep(.ant-input-affix-wrapper),
.auth-panel :deep(.ant-input) {
  border-radius: 8px;
}

.auth-submit-wrap {
  margin-bottom: 0 !important;
  margin-top: 8px;
}

.auth-submit-btn {
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
}

.tips {
  margin-bottom: 16px;
  color: var(--color-text-tertiary);
  font-size: 13px;
  text-align: right;
}

.tips :deep(a) {
  color: var(--color-primary);
  font-weight: 500;
  margin-left: 6px;
}

.tips :deep(a:hover) {
  color: var(--color-primary-hover);
}

.code-with-btn {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code-with-btn :deep(.ant-input) {
  flex: 1;
  min-width: 0;
}

.send-code-btn {
  flex-shrink: 0;
  width: 120px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 13px;
}
</style>
