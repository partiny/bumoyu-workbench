<template>
  <main class="wrap">
    <div class="container-wrap">
      <div class="w-360">
        <div class="logo-wrap">
          <img src="/src/assets/images/logo.png" />
          <span>{{ projectName }}</span>
        </div>
        <a-form spellcheck="false" autocomplete="off">
          <a-form-item>
            <a-input
              v-model:value.trim="form.userName"
              class="h-50 font-size-16! b-rd-12"
              placeholder="请输入用户名"
              allow-clear
              :maxlength="20"
            />
          </a-form-item>
          <a-form-item>
            <a-input-password
              v-model:value.trim="form.password"
              class="h-50 font-size-16 b-rd-12"
              placeholder="请输入密码"
              allow-clear
              :maxlength="20"
            />
          </a-form-item>
        </a-form>
        <a-divider>
          <span class="color-#8f91a8 font-size-12">其他登录方式</span>
        </a-divider>
        <ul class="method-list">
          <li
            v-for="item in methodList"
            :key="item.value"
            class="method-item"
            @click="toast.info('该功能暂未开放')"
          >
            <img :src="item.icon" :alt="item.label" />
          </li>
        </ul>
        <div class="agreement">
          <a-checkbox v-model:checked="form.agreement">
            <div class="agreement-main">
              我已阅读并同意
              <a class="ml-4" href="#" @click="toAgreement('user')">用户协议</a>、
              <a href="#" @click="toAgreement('privacy')">隐私政策</a>
            </div>
          </a-checkbox>
        </div>
        <a-button
          block
          type="primary"
          class="btn-login"
          :loading="loading"
          @click="handleSubmit"
        >登录</a-button>
        <div class="operation">
          <div @click="router.push('/password-reset')">忘记密码</div>
          <div @click="router.push('/regist')">账号注册</div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import ImgEmail from '@/assets/images/login/logo_method_email.png'
import ImgPassword from '@/assets/images/login/logo_method_password.png'
import { ApiAuth } from '@/apis';
import { http, setRefreshToken, setToken, openNewTab } from '@/utils';
import { reactive, ref } from 'vue';
import { message as toast } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const projectName = import.meta.env.VITE_PROJECT_NAME
const methodList = [
  { label: '邮箱验证码登录', value: 'email', icon: ImgEmail },
  { label: '用户名密码登录', value: 'username', icon: ImgPassword }
]
const formInit = () => ({
  userName: '',
  password: '',
  agreement: false
})
const form = reactive(formInit())
const loading = ref(false)
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
  if (!form.agreement) {
    toast.info('请阅读并同意协议')
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
/**打开协议 */
function toAgreement(type: string) {
  const route = router.resolve(`/agreement?type=${type}`)
  openNewTab(route.href)
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
  justify-content: center;
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
.btn-login {
  height: 48px;
  font-size: 16px;
  border-radius: 12px;
  background-color: var(--qt-primary-color);
  &:hover {
    background-color: var(--qt-primary-color);
  }
}
.method-list {
  display: flex;
  justify-content: center;
  column-gap: 10px;
  margin-bottom: 30px;
}
.method-item {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f7f8fc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #fff;
    pointer-events: none;
    user-select: none;
  }
}
.agreement {
  margin-bottom: 24px;
  text-align: center;
  &-main {
    color: var(--qt-text-2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    > a {
      color: var(--qt-primary-color);
    }
  }
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