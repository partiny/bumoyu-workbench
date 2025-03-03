<template>
  <div class="context-menu">
    <slot />
    <Teleport to="body">
      <Transition>
        <div
          v-if="visible"
          class="context-menu-panel"
          :style="{
            left: position.x + 'px',
            top: position.y + 'px'
          }"
        >
          <ul class="context-menu-panel-list">
            <li
              v-for="(item, index) in localOptions"
              :key="index"
              class="context-menu-panel-item"
              @click="localOnChoose(item)"
            >{{ item.name }}</li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, type PropType, watch } from 'vue';
import type { MenuItem } from './interface';

const props = defineProps({
  options: {
    type: Array as PropType<MenuItem[]>,
    required: true
  },
  onChoose: {
    type: Function,
    default: null
  }
})
const visible = ref(false)
const position = reactive({ x: 0, y: 0 })
const localOptions = ref(props.options)
const localOnChoose = ref(props.onChoose)

// 此处用监听，是为了变相实现修改options和onChoose
watch(() => props.options, (val) => {
  localOptions.value = val
}, { immediate: true })
watch(() => props.onChoose, (val) => {
  localOnChoose.value = val
}, { immediate: true })

/**
 * 打开上下文弹窗
 * @param x 弹窗的x坐标
 * @param y 弹窗的y坐标
 */
function open(x: number, y: number) {
  position.x = x
  position.y = y
  visible.value = true
}
/**
 * 关闭上下文弹窗
 * @param e Event
 */
function close(e: MouseEvent) {
  if (e?.type === 'contextmenu') {
    e.preventDefault() // 仅阻止右键菜单的默认行为
  }
  visible.value = false
}
/**
 * 修改上下文菜单
 * @param options MenuItem[]
 */
function setOptions(options: MenuItem[]) {
  localOptions.value = options
}
/**修改上下文菜单选中事件 */
function setOnChoose(onChoose: () => void) {
  localOnChoose.value = onChoose
}

defineExpose({
  open,
  close,
  setOptions,
  setOnChoose
})
</script>
<style scoped lang="scss">
.context-menu {
  width: 100%;
  height: 100%;
}
.context-menu-panel {
  position: fixed;
  width: 130px;
  left: 0;
  top: 0;
  background-color: rgba(255, 255, 255, .8);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.03) 2px 2px 10px 2px;
  transform-origin: top left;
  z-index: 1;
  &-list {
    position: relative;
    padding: 4px;
    user-select: none;
    height: 100%;
    overflow: hidden;
  }
  &-item {
    color: #2c2c36;
    transition: .4s ease;
    padding: 0 12px;
    border-radius: 4px;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      background: #eeedff;
    }
  }
}
.v-enter-from {
  opacity: 0;
  transform: scale(0);
  
}
.v-enter-to {
  transition: .2s;
  opacity: 1;
  transform: scale(1);
  
}
</style>