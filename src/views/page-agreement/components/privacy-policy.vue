<template>
  <div class="privacy-policy">
    <h1>隐私政策</h1>
    <p class="text-right"><strong>版本生效日期：</strong>{{ effectiveDate }}</p>

    <h2>1. 信息的收集与使用</h2>
    <div>
      我们可能会收集以下类型的个人信息：
      <ul>
        <li><strong>您主动提供的信息：</strong>当您注册账户、填写表单或联系我们时，我们可能会收集您的姓名、电子邮件地址、电话号码等信息。</li>
        <li><strong>自动收集的信息：</strong>当您访问本网站时，我们可能会自动收集您的IP地址、浏览器类型、访问时间、页面浏览记录等信息。</li>
        <li><strong>Cookies和其他技术：</strong>我们可能会使用Cookies和类似技术来增强您的用户体验，并分析网站流量。</li>
      </ul>
    </div>

    <h2>2. 信息的使用目的</h2>
    <div>
      我们收集的信息可能用于以下用途：
      <ul>
        <li>提供、维护和改进本网站的服务；</li>
        <li>与您沟通，回复您的询问或请求；</li>
        <li>分析网站使用情况，优化用户体验；</li>
        <li>遵守法律法规或响应法律程序。</li>
      </ul>
    </div>

    <h2>3. 信息的共享与披露</h2>
    <div>
      我们不会将您的个人信息出售、交易或转让给第三方，除非以下情况：
      <ul>
        <li>获得您的明确同意；</li>
        <li>为提供服务所需，向可信赖的第三方合作伙伴共享信息；</li>
        <li>根据法律法规要求或响应合法的法律程序。</li>
      </ul>
    </div>

    <h2>4. 信息安全</h2>
    <p>我们采取合理的技术和管理措施保护您的个人信息安全，防止未经授权的访问、使用或泄露。</p>

    <h2>5. 您的权利</h2>
    <div>
      您有权：
      <ul>
        <li>访问、更正或删除您的个人信息；</li>
        <li>拒绝或限制我们使用您的个人信息；</li>
        <li>撤回您已同意的隐私政策。</li>
      </ul>
    </div>

    <h2>6. 隐私政策的变更</h2>
    <p>我们可能会不定期更新本隐私政策。任何更改将在本页面发布，请您定期查阅。</p>

    <h2>7. 联系我们</h2>
    <p>
      如果您对本隐私政策有任何疑问，请通过电子邮件（{{ contactEmail }}）联系我们。
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';

const effectiveDate = '2025年01月18日'
const contactEmail = 'bumoyu@126.com'
const projectName = import.meta.env.VITE_PROJECT_NAME

onBeforeMount(() => {
  document.title = `${projectName}的隐私政策`
})
</script>

<style scoped>
.privacy-policy {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  font-size: 14px;
}
h1 {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
h2 {
  font-weight: bold;
}
ul {
  padding-left: 20px;
}
</style>