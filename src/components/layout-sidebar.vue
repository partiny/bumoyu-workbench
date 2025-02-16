<template>
  <div class="layout-sidebar" :class="{ fold: isFold }" @click="isFold = !isFold">
    <ul class="menu-list">
      <li
        v-for="item in menuList"
        :key="item.id"
        class="menu-item"
        :class="{ 'active': router.currentRoute.value.fullPath === item.url }"
        @click.stop="handleChange(item.url)"
      >
        <img v-if="item.icon" :src="item.icon" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <div class="bottom-list">
      <a-tooltip
        v-for="item in extraMenuList"
        :key="item.id"
        placement="right"
        :title="item.name"
        :mouse-enter-delay="0.5"
      >
        <component
          :is="item.icon"
          :style="{ color: 'rgba(255, 255, 255, .6)', fontSize: '20px' }"
          @click.stop="item.onClick"
        />
      </a-tooltip>
      <div class="menu-userinfo" @click.stop>
        <a-popover v-if="getUserInfo() && getUserInfo()?.userId" placement="right" trigger="click">
          <img :src="IconUserInfo" />
          <template #content>
            <ul>
              <li class="popover-item" @click="handleSignOut">退出登录</li>
            </ul>
          </template>
        </a-popover>
        <span v-else @click="router.push('/login')">登录</span>
      </div>
    </div>
  </div>
  <!-- 设置弹窗 -->
  <setting-modal v-model:visible="isSettingModalShow" />
  <!-- 历史备份记录弹窗 -->
  <backup-modal v-model:visible="isBackupModalShow" />
</template>
<script setup lang="ts">
import IconNav from '@/assets/images/IconNav.svg'
import IconUserInfo from '@/assets/images/IconUserInfo.svg'
import { useRouter } from 'vue-router';
import { getUserInfo, removeToken } from '@/utils';
import { ref } from 'vue';
import { ClockCircleOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import BackupModal from '@/views/page-navigation/components/backup-modal.vue';
import SettingModal from '@/views/page-navigation/components/setting-modal.vue';

const router = useRouter()
const menuList = [
  { id: 3, name: '导航', icon: IconNav, url: '/navigation' }
]
const extraMenuList = [
  {
    id: 1,
    name: '文档指南',
    icon: FileTextOutlined,
    onClick: () => {
      window.open(window.location.origin + '/docs')
    }
  },
  {
    id: 2,
    name: '设置',
    icon: SettingOutlined,
    onClick: () => {
      isSettingModalShow.value = true
    }
  },
  {
    id: 3,
    name: '历史备份记录',
    icon: ClockCircleOutlined,
    onClick: () => {
      isBackupModalShow.value = true
    }
  }
]
const isFold = ref(true) // 是否折叠
const isBackupModalShow = ref(false) // 控制历史备份记录弹窗显隐
const isSettingModalShow = ref(false) // 控制设置弹窗显隐

function handleChange(url: string) {
  if (router.currentRoute.value.fullPath === url) return
  router.push(url)
}
function handleSignOut() {
  removeToken()
  router.push('/login')
}
</script>
<style scoped lang="scss">
.layout-sidebar {
  --layout-sidebar-width: 60px;
  width: var(--layout-sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  flex-shrink: 0;
  transition: all .8s;
  overflow: hidden;
  cursor: pointer;
  &.fold {
    width: 8px;
    opacity: 0;
    > .menu-list {
      display: none;
    }
    > .menu-theme {
      display: none;
    }
    > .menu-userinfo {
      display: none;
    }
    > .bottom-list {
      display: none;
    }
  }
}
.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 40px;
  flex: 1;
  width: var(--layout-sidebar-width);
}
.menu-item {
  font-size: 12px;
  color: #c6c4ff;
  transition: color .4s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  align-items: center;
  & > img {
    width: 20px;
    height: auto;
    opacity: .5;
    transition: opacity .4s;
  }
  &:hover {
    color: #fff;
    > img {
      opacity: .8;
    }
  }
  &.active {
    color: #fff;
    > img {
      opacity: .8;
    }
  }
}
.bottom-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  row-gap: 12px;
}
.menu-userinfo {
  width: 32px;
  height: 32px;
  background-color: #c6c4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  margin-bottom: 30px;
  border-radius: 50%;
  cursor: pointer;
  > img {
    background-color: #fff;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}
.popover-item {
  cursor: pointer;
  font-size: 12px;
  color: var(--qt-text-1);
  padding: 6px 10px;
  border-radius: 8px;
  &:hover {
    background: #f3f2ff;
    color: #615ced;
  }
}
</style>