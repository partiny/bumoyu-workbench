<template>
  <div class="user-agreement">
    <h1>用户协议</h1>
    <p class="text-right"><strong>版本生效日期：</strong>{{ effectiveDate }}</p>

    <h2>1. 使用许可</h2>
    <p>我们授予您有限的、非独占的、不可转让的许可，允许您访问和使用本网站的内容和服务，仅限于个人和非商业用途。</p>

    <h2>2. 用户义务</h2>
    <div>
      您同意：
      <ul>
        <li>不利用本网站从事任何非法活动；</li>
        <li>不干扰或破坏本网站的正常运行；</li>
        <li>不未经授权访问本网站的任何部分；</li>
        <li>不侵犯他人的知识产权或其他合法权益。</li>
      </ul>
    </div>

    <h2>3. 知识产权</h2>
    <p>本网站的所有内容（包括但不限于文本、图像、标志、软件等）均受版权、商标和其他知识产权法律保护。未经我们明确书面许可，您不得复制、修改、分发或使用任何内容。</p>

    <h2>4. 免责声明</h2>
    <p>本网站的内容和服务按“原样”提供，我们不提供任何明示或暗示的保证。对于因使用或无法使用本网站而导致的任何损失或损害，我们不承担任何责任。</p>

    <h2>5. 责任限制</h2>
    <p>在任何情况下，我们均不对任何间接、附带、特殊或后果性损害负责，包括但不限于利润损失、数据丢失或业务中断。</p>

    <h2>6. 协议的修改</h2>
    <p>我们保留随时修改本协议的权利。任何更改将在本页面发布，继续使用本网站即表示您接受修改后的协议。</p>

    <h2>7. 终止</h2>
    <p>我们有权在不事先通知的情况下，终止或暂停您访问本网站的权利，如果您违反了本协议的任何条款。</p>

    <h2>8. 适用法律</h2>
    <p>本协议受[您所在国家/地区]法律管辖，并按其解释。任何争议应提交至[您所在城市]有管辖权的法院解决。</p>

    <h2>9. 联系我们</h2>
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
  document.title = `${projectName}的用户协议`
})
</script>

<style scoped>
.user-agreement {
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