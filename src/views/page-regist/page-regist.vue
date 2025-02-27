<template>
  <main class="wrap">
    <div class="container-wrap">
      <div class="w-360">
        <div class="logo-wrap">
          <img src="/src/assets/images/logo.png" />
          <span>注册</span>
        </div>
        <a-form
          ref="formRef"
          :model="form"
          spellcheck="false"
          autocomplete="off"
          :rules="rules"
        >
          <a-form-item name="userName">
            <a-input
              v-model:value.trim="form.userName"
              class="h-50 font-size-16! b-rd-12"
              placeholder="请输入用户名（ 字母、数字或_ ）"
              allow-clear
              :maxlength="20"
              :show-count="form.userName.length"
            />
          </a-form-item>
          <a-form-item name="email">
            <a-input
              v-model:value.trim="form.email"
              class="h-50 font-size-16! b-rd-12"
              placeholder="请输入邮箱"
              allow-clear
              :maxlength="30"
              :show-count="form.email.length"
            />
          </a-form-item>
          <a-form-item name="verificationCode">
            <div class="input-wrap">
              <a-input
                v-model:value="form.verificationCode"
                :bordered="false"
                class="font-size-16"
                placeholder="请输入验证码"
                allow-clear
                :maxlength="6"
                :show-count="form.verificationCode.length"
              />
              <a-divider class="ml-4 mr-4" type="vertical" />
              <a-button
                class="pl-4 pr-10"
                type="link"
                :disabled="!isEmailCorrect || !isSendAllow"
                @click="handleSendCode"
              >{{ btnCodeText }}</a-button>
            </div>
            <div v-if="!isSendInit" class="flex items-center mt-12 font-size-13 color-#373d41">
              <CheckCircleOutlined class="color-#7ef705 mr-6" />
              <p>邮箱验证码已发送，可能会有延后，请耐心等待</p>
            </div>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              v-model:value.trim="form.password"
              class="h-50 font-size-16! b-rd-12"
              placeholder="请输入密码"
              allow-clear
              :maxlength="20"
              :show-count="form.password.length"
            />
          </a-form-item>
          <a-form-item name="confirmPassword">
            <a-input-password
              v-model:value.trim="form.confirmPassword"
              class="h-50 font-size-16! b-rd-12"
              placeholder="再次输入密码"
              allow-clear
              :maxlength="20"
              :show-count="form.confirmPassword.length"
            />
          </a-form-item>
        </a-form>
        <a-button
          block
          type="primary"
          class="btn-login"
          :loading="loading"
          @click="handleSubmit"
        >注册</a-button>
        <div class="operation">
          <div @click="router.push('/login')">返回登录</div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ApiAuth } from '@/apis';
import { http, setRefreshToken, setToken, openNewTab, REGEXP } from '@/utils';
import { computed, reactive, ref } from 'vue';
import { message as toast } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const step = reactive({
  current: 0,
  list: [
    { title: '填写用户名和邮箱' },
    { title: '设置登录密码' }
  ]
})
const projectName = import.meta.env.VITE_PROJECT_NAME


const formInit = () => ({
  userName: '',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})
const form = reactive(formInit())
const formRef = ref()
const loading = ref(false)
const router = useRouter()
const isEmailCorrect = computed(() => REGEXP.email.test(form.email))
const isSendAllow = ref(true)
const isSendInit = ref(true)
const countDown = ref(60)
const btnCodeText = computed(() => {
  if (!isSendAllow.value) {
    return `${countDown.value}秒后重新发送`
  } else {
    return isSendInit.value ? '获取验证码' : '重新发送'
  }
})

/**发送验证码 */
function handleSendCode() {
  if (!form.email) {
    toast.info('请输入邮箱')
    return
  }
  isSendInit.value = false
  isSendAllow.value = false

  http.post(ApiAuth.sendEmailCodeOfRegistAccount, { email: form.email })
    .then(res => {
      const { message, success } = res || {}
      if (!success) {
        isSendAllow.value = true
        toast.error(message || '发送验证码错误')
        return
      }
      toast.success('已发送')
      startCounting()
    })
    .catch(error => {
      isSendAllow.value = true
      toast.error(error || '发送验证码错误')
    })
}
/**开始计时 */
function startCounting() {
  const timer = setInterval(() => {
    countDown.value --
    if (countDown.value <= 0) {
      clearInterval(timer)
      isSendAllow.value = true
      countDown.value = 60
    }
  }, 1000)
}
/**提交 */
function handleSubmit() {
  formRef.value.validate().then(() => {
    const params = {
      userName: form.userName,
      email: form.email,
      verificationCode: form.verificationCode,
      password: form.password
    }
    loading.value = true
    http.post<{ accessToken: string; refreshToken: string; }>(ApiAuth.signUp, {
      ...params,
      source: 'WORKBENCH'
    })
      .then(res => {
        loading.value = false
        const { message, success } = res || {}
        if (!success) {
          toast.error(message || '注册请求错误')
          return
        }
        toast.success('注册成功')
        router.back()
      })
      .catch(error => {
        loading.value = false
        toast.error(error || '注册请求错误')
      })
  }).catch(() => {})
}
const rules: Record<string, Rule[]> = {
  userName: [{ required: true, validator: validateUserName, trigger: ['blur', 'change'] }],
  email: [{ required: true, validator: validateEmail, trigger: ['blur', 'change'] }],
  verificationCode: [{ required: true, message: '请输入验证码', trigger: ['blur'] }],
  password: [{ required: true, validator: validatePassword, trigger: ['blur', 'change'] }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }]
}
/**校验用户名 */
async function validateUserName(_rule: Rule, value: string) {
  if (!value) {
    return Promise.reject('请输入用户名')
  } else if (/[^A-Za-z0-9_]/g.test(value)) {
    return Promise.reject('用户名只能输入字母、数字及_')
  } else if (value.length < 4) {
    return Promise.reject('用户名长度不能小于4位')
  } else {
    return Promise.resolve()
  }
}
/**校验邮箱 */
async function validateEmail(_rule: Rule, value: string) {
  if (!value) {
    return Promise.reject('请输入邮箱')
  } else if (!REGEXP.email.test(value)) {
    return Promise.reject('邮箱格式不正确')
  } else {
    return Promise.resolve()
  }
}
/**校验密码 */
async function validatePassword(_rule: Rule, value: string) {
  if (!value) {
    return Promise.reject('请输入密码')
  } else if (value.length < 4) {
    return Promise.reject('密码长度不能小于4位')
  } else {
    return Promise.resolve()
  }
}
/**校验确认密码 */
async function validateConfirmPassword(_rule: Rule, value: string) {
  if (!value) {
    return Promise.reject('请输入密码')
  } else if (value.length < 4) {
    return Promise.reject('密码长度不能小于4位')
  } else if (value !== form.password) {
    return Promise.reject('两次密码不一致')
  } else {
    return Promise.resolve()
  }
}
</script>
<style scoped lang="scss">
.wrap {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(21% 28% at 77% 4%,#d6d9f9 0,rgba(214,217,249,0) 100%),radial-gradient(23% 34% at 56% 10%,#eaebf7 0,rgba(238,238,246,0) 100%),radial-gradient(52% 67% at 101% 105%,#c7c5ff 0,#cecdff 34%,#e4e6fc 97%),#e4e6fc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}
.container-wrap {
  background-color: #fff;
  border-radius: 12px;
  width: 450px;
  height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logo-wrap {
  height: 60px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 6px;
  color: var(--qt-primary-color);
  font-size: 26px;
  pointer-events: none;
  user-select: none;
  > img {
    height: 36px;
  }
  > span {
    transform: translateY(2px);
    font-weight: 600;
  }
}
.input-wrap {
  height: 50px;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  font-size: 16px;
  transition: border-color .4s;
  &:has(input:focus) {
    border-color: var(--qt-sub-color);
    box-shadow: 0 0 0 2px rgba(55, 5, 255, 0.06);
  }
  &:hover {
    border-color: var(--qt-sub-color);
    box-shadow: 0 0 0 2px rgba(55, 5, 255, 0.06);
  }
  &:has(input.ant-input-status-error) {
    border-color: #ff4d4f;
    &:hover, &:focus {
      border-color: #ff4d4f;
    }
  }
}

.btn-login {
  height: 48px;
  font-size: 16px;
  border-radius: 12px;
  background-color: var(--qt-primary-color);
  &:hover {
    background-color: var(--qt-primary-color);
  }
}
:deep(.ant-form-item-explain) {
  font-size: 12px;
}

.operation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 10px;
  padding-top: 8px;
  color: var(--qt-text-2);
  font-size: 12px;
  >div {
    cursor: pointer;
    &:hover {
      color: var(--qt-primary-color);
    }
  }
}
</style>