<template>
  <a-form spellcheck="false" autocomplete="off">
    <a-form-item>
      <a-input
        v-model:value.trim="form.userName"
        class="h-50 fs-16! b-rd-12"
        placeholder="请输入用户名"
        allow-clear
        :maxlength="20"
      />
    </a-form-item>
    <a-form-item>
      <a-input-password
        v-model:value.trim="form.password"
        class="h-50 fs-16 b-rd-12"
        placeholder="请输入密码"
        allow-clear
        :maxlength="20"
      />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { ApiAuth } from '@/apis';
import { http, setRefreshToken, setToken } from '@/utils';
import { computed, reactive } from 'vue';
import { message as toast } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:loading'])
const formInit = () => ({
  userName: '',
  password: ''
})
const form = reactive(formInit())
const loading = computed({
  get: () => props.loading,
  set: (val) => emit('update:loading', val)
})
const router = useRouter()

/**提交 */
function handleSubmit() {
  if (!form.userName) {
    toast.info('用户名不能为空')
    return
  }
  if (!form.password) {
    toast.info('密码不能为空')
    return
  }
  loading.value = true
  http.post<{ accessToken: string; refreshToken: string; }>(ApiAuth.signIn, { ...form })
    .then(res => {
      loading.value = false
      const { data, message, success } = res || {}
      if (!success) {
        toast.error(message || '登录请求错误')
        return
      }
      if (!data) {
        toast.error('登录失败')
        return
      }
      setToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      router.push('/')
    })
    .catch(error => {
      loading.value = false
      toast.error(error || '登录请求错误')
    })
}

defineExpose({
  submit: handleSubmit
})
</script>