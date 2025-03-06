<template>
  <div class="color-picker">
    <a-popover
      :open="showPicker"
      trigger="click"
      placement="bottom"
    >
      <div 
        class="preview"
        :style="{
          backgroundColor: current,
          ...triggerStyle
        }"
        @click="showPicker = !showPicker"
      />
      <template #content>
        <div 
          ref="satPanelRef"
          class="saturation-panel"
          :style="{ '--hue': hsvColor.h }"
          @mousedown="handleSatMouseDown"
        >
          <div 
            class="cursor"
            :style="{
              left: `${hsvColor.s * 100}%`,
              top: `${(1 - hsvColor.v) * 100}%`,
              backgroundColor: hsvToHex(hsvColor.h, hsvColor.s, hsvColor.v)
            }"
          />
        </div>
        
        <div 
          ref="hueSliderRef"
          class="hue-slider"
          @mousedown="handleHueMouseDown"
        >
          <div 
            class="slider-cursor"
            :style="{ left: `${(hsvColor.h / 360) * 100}%` }"
          />
        </div>
        
        <div class="color-info">
          <input 
            type="text" 
            v-model="current"
            class="hex-input"
            @keydown.enter="showPicker = false"
          >
          <div 
            class="preview-box"
            :style="{ backgroundColor: current }"
          />
          <a-button class="ml-auto" size="small" @click="handleSelectColor">确定</a-button>
        </div>
      </template>
    </a-popover>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'

interface HSV {
  h: number  // 0-360
  s: number  // 0-1
  v: number  // 0-1
}

const props = defineProps({
  modelValue: {
    type: String,
    default: '#ffffff'
  },
  triggerStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const current = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val)
})


// 响应式颜色对象
const hsvColor = reactive<HSV>({ h: 0, s: 1, v: 1 })
const showPicker = ref(false)
const isDragging = ref<'hue' | 'saturation' | null>(null)

// DOM 引用
const hueSliderRef = ref<HTMLElement>()
const satPanelRef = ref<HTMLElement>()

// 颜色转换工具 --------------------------------------------------
function hexToHsv(hex: string): HSV {
  hex = completeHex(hex)
  hex = hex.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  
  if (max !== min) {
    const d = max - min
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }
  
  return {
    h: Math.round(h),
    s: max === 0 ? 0 : (max - min) / max,
    v: max
  }
}

function hsvToHex(h: number, s: number, v: number): string {
  h = h % 360
  s = Math.max(0, Math.min(1, s))
  v = Math.max(0, Math.min(1, v))

  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c // 还原为正确公式

  let [r, g, b] = [0, 0, 0]

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  // 修正颜色分量计算
  return `#${[r + m, g + m, b + m]
    .map(n => Math.round(n * 255).toString(16).padStart(2, '0'))
    .join('')}`
}

// 事件处理 -----------------------------------------------------
const handleHueMouseDown = (e: MouseEvent) => {
  isDragging.value = 'hue'
  updateHue(e)
  document.addEventListener('mousemove', updateHue)
  document.addEventListener('mouseup', handleMouseUp)
}

const updateHue = (e: MouseEvent) => {
  if (!hueSliderRef.value || !isDragging.value) return
  
  requestAnimationFrame(() => {
    const rect = hueSliderRef.value!.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    hsvColor.h = (x / rect.width) * 360
  })
}

const handleSatMouseDown = (e: MouseEvent) => {
  isDragging.value = 'saturation'
  updateSat(e)
  document.addEventListener('mousemove', updateSat)
  document.addEventListener('mouseup', handleMouseUp)
}

const updateSat = (e: MouseEvent) => {
  if (!satPanelRef.value || !isDragging.value) return
  
  requestAnimationFrame(() => {
    const rect = satPanelRef.value!.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    
    hsvColor.s = x / rect.width
    hsvColor.v = 1 - (y / rect.height)
  })
}

const handleMouseUp = () => {
  isDragging.value = null
  document.removeEventListener('mousemove', updateHue)
  document.removeEventListener('mousemove', updateSat)
  document.removeEventListener('mouseup', handleMouseUp)
}

function completeHex(color: string): string {
  // 去除#号并统一处理简写格式
  const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b)
  // 统一返回带#的6位小写格式
  return `#${hex.replace('#', '').padEnd(6, '0').slice(0, 6).toLowerCase()}`
}

/**点击确定选中颜色 */
function handleSelectColor() {
  emit('select', current.value)
  showPicker.value = false
}

// 初始化与同步 -------------------------------------------------
watch(() => props.modelValue, (newVal) => {
  if (!newVal.startsWith('#')) return '#ffffff'
  Object.assign(hsvColor, hexToHsv(newVal))
})


watch(hsvColor, () => {
  emit('update:modelValue', hsvToHex(hsvColor.h, hsvColor.s, hsvColor.v))
})

onMounted(() => {
  Object.assign(hsvColor, hexToHsv(props.modelValue))
  console.log('-----------------')
  console.log(hsvColor, props.modelValue)
})
</script>
<style scoped>
.color-picker {
  position: relative;
  display: inline-block;
}

.preview {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: box-shadow 0.2s;
}

.preview:hover {
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
}

.saturation-panel {
  position: relative;
  width: 240px;
  height: 160px;
  border-radius: 4px;
  cursor: crosshair;
  overflow: hidden;
  /* 添加硬件加速优化 */
  transform: translateZ(0);
  /* 防止渐变色带 */
  background-blend-mode: multiply;
  /* 添加过渡动画 */
  transition: background-image 0.2s ease;
  /* 修改背景渐变实现 */
  background-image: 
    linear-gradient(to left,
      hsl(var(--hue, 0) 100% 50%),   /* 左侧纯色（当前色相） */
      white                          /* 右侧白色（饱和度降为0） */
    ),
    linear-gradient(to bottom,
      transparent, /* 顶部透明（保持原亮度） */
      black      /* 底部黑色（亮度降为0） */          
    );

  /* 添加复合层优化 */
  will-change: background-image;
}

.cursor {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  /* 提升可视性 */
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
  /* 保证光标可见 */
  border-color: rgba(255,255,255,0.9);
  /* 添加过渡动画 */
  transition: 
    left 0.05s linear,
    top 0.05s linear,
    background-color 0.01s linear;
}

.hue-slider {
  height: 12px;
  margin-top: 12px;
  border-radius: 6px;
  background: linear-gradient(
    to right,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  position: relative;
}

.slider-cursor {
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid #666;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.color-info {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.hex-input {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

.preview-box {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>