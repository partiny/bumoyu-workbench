<template>
  <a-form
    ref="formRef"
    :model="form"
    spellcheck="false"
    autocomplete="off"
    :rules="rules"
  >
    <a-form-item name="email">
      <a-input
        v-model:value.trim="form.email"
        class="h-50 fs-16! b-rd-12"
        placeholder="请输入邮箱"
        allow-clear
        :maxlength="30"
        show-count
      />
    </a-form-item>
    <a-form-item name="verificationCode">
      <div class="input-wrap">
        <a-input
          v-model:value="form.verificationCode"
          :bordered="false"
          class="fs-16"
          placeholder="请输入验证码"
          allow-clear
          :maxlength="6"
          show-count
        />
        <a-divider class="ml-4 mr-4" type="vertical" />
        <a-button
          class="pl-4 pr-10"
          type="link"
          :disabled="!isEmailCorrect || !isSendAllow"
          @click="handleSendCode"
        >{{ btnCodeText }}</a-button>
      </div>
      <div v-if="!isSendInit" class="flex items-center mt-12 fs-13 color-#373d41">
        <CheckCircleOutlined class="color-#7ef705 mr-6" />
        <p>邮箱验证码已发送，可能会有延后，请耐心等待</p>
      </div>
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { http, REGEXP, setRefreshToken, setToken } from '@/utils';
import { computed, reactive, ref } from 'vue';
import { message as toast } from 'ant-design-vue';
import { ApiAuth } from '@/apis';
import type { Rule } from 'ant-design-vue/es/form';
import { useRouter } from 'vue-router';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:loading'])
const formInit = () => ({
  email: '',
  verificationCode: ''
})
const router = useRouter()
const form = reactive(formInit())
const formRef = ref()
const loading = computed({
  get: () => props.loading,
  set: (val) => emit('update:loading', val)
})
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

const rules: Record<string, Rule[]> = {
  email: [{ required: true, validator: validateEmail, trigger: ['blur', 'change'] }],
  verificationCode: [{ required: true, message: '请输入验证码', trigger: ['blur'] }]
}

/**发送验证码 */
function handleSendCode() {
  if (!form.email) {
    toast.info('请输入邮箱')
    return
  }
  isSendInit.value = false
  isSendAllow.value = false

  http.post(ApiAuth.sendEmailCodeOfEmailLogin, { email: form.email })
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
      email: form.email,
      verificationCode: form.verificationCode
    }
    loading.value = true
    http.post<{ accessToken: string; refreshToken: string; }>(ApiAuth.emailLogin, params)
      .then(res => {
        loading.value = false
        const { data, message, success } = res || {}
        if (!success) {
          toast.error(message || '邮箱登录请求错误')
          return
        }
        if (!data) {
          toast.error('邮箱登录失败')
          return
        }
        setToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        router.push('/')
      })
      .catch(error => {
        loading.value = false
        toast.error(error || '邮箱登录请求错误')
      })
  }).catch(() => {})
}

defineExpose({
  submit: handleSubmit
})
</script>
<style scoped lang="scss">
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
</style>