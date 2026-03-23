<template>
  <div class="auth-shell">
    <div id="userLoginPage" class="auth-panel">
      <h2 class="title">用户登录</h2>
      <p class="subtitle">选择登录方式，安全进入系统</p>
      <a-tabs v-model:activeKey="loginTab" class="login-tabs auth-tabs" size="large">
      <a-tab-pane key="password" tab="账号密码登录">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
          <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
          </a-form-item>
          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度不能小于 8 位' },
            ]"
          >
            <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
          </a-form-item>
          <div class="forgot-row">
            <a class="forgot-link" @click="resetModalOpen = true">忘记密码？</a>
          </div>
          <div class="tips">
            没有账号
            <RouterLink to="/user/register">去注册</RouterLink>
          </div>
          <a-form-item class="auth-submit-wrap">
            <a-button type="primary" html-type="submit" class="auth-submit-btn" block>登录</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="email" tab="邮箱验证码登录">
        <a-form
          :model="emailLoginForm"
          name="emailLogin"
          autocomplete="off"
          @finish="handleEmailLoginSubmit"
        >
          <a-form-item
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]"
          >
            <a-input v-model:value="emailLoginForm.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
            <div class="code-with-btn">
              <a-input v-model:value="emailLoginForm.code" placeholder="请输入验证码" />
              <a-button
                type="default"
                class="send-code-btn"
                :loading="sendLoginCodeLoading"
                :disabled="emailLoginCountdown.isCounting"
                @click.prevent="handleSendLoginCode"
              >
                {{ emailLoginCountdown.buttonText }}
              </a-button>
            </div>
          </a-form-item>
          <div class="tips">
            没有账号
            <RouterLink to="/user/register">去注册</RouterLink>
          </div>
          <a-form-item class="auth-submit-wrap">
            <a-button type="primary" html-type="submit" class="auth-submit-btn" block>登录</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    </div>

    <a-modal
      v-model:open="resetModalOpen"
      title="重置密码"
      :footer="null"
      destroy-on-close
      :width="480"
    >
      <a-form
        :model="resetFormState"
        name="resetPassword"
        layout="vertical"
        autocomplete="off"
        @finish="handleResetSubmit"
      >
        <a-form-item
          name="email"
          label="邮箱"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱地址' },
          ]"
        >
          <a-input v-model:value="resetFormState.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item name="code" label="验证码" :rules="[{ required: true, message: '请输入验证码' }]">
          <div class="code-with-btn">
            <a-input v-model:value="resetFormState.code" placeholder="请输入验证码" />
            <a-button
              type="default"
              class="send-code-btn"
              :loading="sendResetCodeLoading"
              :disabled="resetCountdown.isCounting"
              @click.prevent="handleSendResetCode"
            >
              {{ resetCountdown.buttonText }}
            </a-button>
          </div>
        </a-form-item>
        <a-form-item
          name="newPassword"
          label="新密码"
          :rules="[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '密码长度不能小于 8 位' },
          ]"
        >
          <a-input-password v-model:value="resetFormState.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item
          name="checkPassword"
          label="确认密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { min: 8, message: '密码长度不能小于 8 位' },
            { validator: validateResetCheckPassword },
          ]"
        >
          <a-input-password
            v-model:value="resetFormState.checkPassword"
            placeholder="请再次输入新密码"
          />
        </a-form-item>
        <a-form-item class="auth-submit-wrap">
          <a-button type="primary" html-type="submit" class="auth-submit-btn" block>提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { resetPassword, userLogin, userLoginByEmail } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/loginUser.ts'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useEmailCodeCountdown } from '@/composables/useEmailCodeCountdown.ts'
import { requestSendEmailCode } from '@/utils/sendEmailVerificationCode.ts'

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const loginTab = ref('password')

const emailLoginForm = reactive({
  email: '',
  code: '',
})

const resetModalOpen = ref(false)
const resetFormState = reactive({
  email: '',
  code: '',
  newPassword: '',
  checkPassword: '',
})

const emailLoginCountdown = useEmailCodeCountdown()
const resetCountdown = useEmailCodeCountdown()
const sendLoginCodeLoading = ref(false)
const sendResetCodeLoading = ref(false)

const router = useRouter()
const loginUserStore = useLoginUserStore()

const validateResetCheckPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (value && value !== resetFormState.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const handleSendLoginCode = () => {
  void requestSendEmailCode(
    emailLoginForm.email,
    'login',
    emailLoginCountdown.start,
    sendLoginCodeLoading,
  )
}

const handleSendResetCode = () => {
  void requestSendEmailCode(
    resetFormState.email,
    'reset',
    resetCountdown.start,
    sendResetCodeLoading,
  )
}

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const res = await userLogin(values)
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('登录失败，' + res.data.message)
  }
}

const handleEmailLoginSubmit = async (values: { email: string; code: string }) => {
  try {
    const res = await userLoginByEmail({
      email: values.email.trim(),
      code: values.code,
    })
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true,
      })
    } else {
      message.error('登录失败，' + (res.data.message ?? ''))
    }
  } catch {
    message.error('网络错误，请稍后重试')
  }
}

const handleResetSubmit = async (values: typeof resetFormState) => {
  try {
    const res = await resetPassword({
      email: values.email.trim(),
      code: values.code,
      newPassword: values.newPassword,
      checkPassword: values.checkPassword,
    })
    if (res.data.code === 0) {
      message.success('密码重置成功，请重新登录')
      resetModalOpen.value = false
    } else {
      message.error(res.data.message ?? '重置失败')
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
  background: linear-gradient(165deg, #e8f0fe 0%, #f4f6fb 42%, #f7f8fa 100%);
}

.auth-panel {
  max-width: 440px;
  margin: 0 auto;
  padding: 40px 40px 36px;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(15, 23, 42, 0.06),
    0 12px 40px -12px rgba(22, 119, 255, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.title {
  text-align: center;
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  letter-spacing: 0.03em;
}

.subtitle {
  text-align: center;
  margin: 0 0 28px;
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.5;
}

.auth-tabs.login-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 28px;
}

.auth-tabs.login-tabs :deep(.ant-tabs-nav::before) {
  border-color: rgba(0, 0, 0, 0.06);
}

.auth-tabs.login-tabs :deep(.ant-tabs-nav-list) {
  display: flex;
  width: 100%;
}

.auth-tabs.login-tabs :deep(.ant-tabs-tab) {
  flex: 1;
  margin: 0 !important;
  justify-content: center;
  padding: 12px 8px;
  font-weight: 500;
}

.auth-tabs.login-tabs :deep(.ant-tabs-tab-active) {
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
  text-align: right;
  color: #8c8c8c;
  font-size: 13px;
  margin-bottom: 16px;
}

.tips :deep(a) {
  color: #1677ff;
  font-weight: 500;
  margin-left: 6px;
}

.tips :deep(a:hover) {
  color: #4096ff;
}

.forgot-row {
  text-align: right;
  margin: -4px 0 14px;
}

.forgot-link {
  color: #1677ff;
  font-size: 13px;
  cursor: pointer;
}

.forgot-link:hover {
  color: #4096ff;
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
