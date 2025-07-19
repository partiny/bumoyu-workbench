

<template>
  <!-- 新增/编辑代码片段弹窗 -->
  <a-modal
    v-model:open="visible"
    class="snippet-edit-modal"
    :closable="false"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    @close="onModalClose"
  >
    <div class="snippet-edit-header">
      <div class="snippet-edit-header-title">
        <a-tooltip v-if="!isTitleEditing" title="双击修改标题">
          <h4 @dblclick="onTitleClick">{{ form.title || '代码片段' }}</h4>
        </a-tooltip>
        <a-input
          ref="titleInputRef"
          v-if="isTitleEditing"
          v-model:value="form.title"
          placeholder="输入标题（最多30个字符）"
          @blur="onTitleBlur"
        />
      </div>
      <div class="snippet-edit-header-operation">
        <a-button block @click="onModalClose">取消</a-button>
        <a-button type="primary" block @click="onSubmit">提交</a-button>
      </div>
    </div>
    <div class="snippet-edit-form">
      <a-form
        
        :model="form"
        :label-col="{ span: 3 }"
        label-align="left"
        :colon="false"
      >
        <a-row :gutter="24" class="mb-16">
          <a-col :span="12">
            <a-form-item label="标题">
              <a-input
                v-model:value="form.title"
                placeholder="输入标题（最多30个字符）"
                :maxlength="30"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="标签">
              <a-select
                v-model:value="form.tags"
                mode="multiple"
                max-tag-count="responsive"
                placeholder="选择标签（支持自定义）"
              >
                <a-select-option
                  v-for="item in MECONFIG.tagList"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="描述">
              <a-textarea
                v-model:value="form.description"
                placeholder="输入描述"
                :auto-size="{ minRows: 2, maxRows: 6 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可见范围">
              <a-radio-group v-model:value="form.permission" button-style="solid">
                <a-radio-button value="private">仅我可见</a-radio-button>
                <a-radio-button value="public">公开</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="monaco-editor-wrap">
      <div class="monaco-editor-header">
        <a-select
          v-model:value="form.language"
          class="monaco-editor-select"
          :dropdownStyle="{
            backgroundColor: '#2a333e',
            color: '#fff'
          }"
          placeholder="语言"
          size="small"
        >
          <a-select-option
            v-for="item in MECONFIG.languageList"
            class="monaco-editor-select-option"
            :key="item"
            :value="item"
          >{{ item }}</a-select-option>
        </a-select>
      </div>
      <monaco-editor
        v-model="form.content"
        :language="form.language"
      />
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue"
import MonacoEditor from "./monaco-editor.vue";
import MECONFIG from "../monaco-editor-config";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:visible'])
const visible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val)
})

// 备用字段：浏览量、点赞量、收藏量、创建时间、更新时间、是否删除、代码主题色
const formInit = () => ({
  title: '',
  content: '',
  language: 'plaintext',
  tags: [],
  description: '',
  /**可见范围 public, private */
  permission: 'private'
})
const form = reactive(formInit())


function onModalClose() {
  visible.value = false;
  Object.assign(form, formInit())
}

function onSubmit() {
  console.log('form', form)
}

const isTitleEditing = ref(false)
const titleInputRef = ref()
/**双击标题 */
function onTitleClick() {
  isTitleEditing.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
  })
}
/**标题失去焦点 */
function onTitleBlur() {
  isTitleEditing.value = false
}
</script>
<style lang="scss">
:root {
  --editor-background-color: #18212d;
  --editor-text-color: rgab(255, 255, 255, .7);
}
.snippet-edit-modal {
  width: 100vw!important;
  height: 100vh;
  max-width: 100vw;
  top: 0;
  padding-bottom: 0;
  .ant-modal-content {
    border-radius: 0;
    height: 100vh;
    background-color: var(--editor-background-color);
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-form-item-label > label {
    color: #fff;
  }
}
.monaco-editor-select-option {
  color: var(--editor-text-color)!important;
  &.ant-select-item-option-active {
    background-color: #3b434d!important;
  }
  /* 4596ff */
  &.ant-select-item-option-selected {
    background-color: transparent!important;
    color: #4596ff!important;
  }
}
</style>
<style scoped lang="scss">
.snippet-edit-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &-title {
    color: #fff;
    max-width: 60%;
    overflow: hidden;
    height: 32px;
    flex: 1;
    display: flex;
    align-items: center;
    h4 {
      font-weight: bold;
      cursor: pointer;
      font-size: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ant-input {
      width: 100%;
      color: #fff;
      background-color: var(--editor-background-color);
      border-color: var(--qt-primary-color);
      padding: 0 10px;
      height: 100%;
      &::placeholder {
        color: #4d4d4d;
      }
    }
  }
  &-operation {
    margin-left: auto;
    display: flex;
    align-items: center;
    column-gap: 20px;
    flex-shrink: 0;
  }
}
.snippet-edit-form {
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #434343;
}
.monaco-editor-wrap {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #434343;
}
.monaco-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #18212d;
  margin-bottom: 10px;
}
.monaco-editor-select {
  width: 100px;
}
:deep(.monaco-editor-select) {
  .ant-select-selector {
    background-color: #343c47;
    color: rgba(255, 255, 255, .7);
    border-radius: 0;
    border: none;
  }
  .ant-select-selection-item {
    color: rgba(255, 255, 255, .7);
  }
  .ant-select-arrow {
    color: rgba(255, 255, 255, .7);
    transition: transform .3s;
    font-size: 8px;
  }
  &.ant-select-open {
    .ant-select-selection-item {
      color: rgba(255, 255, 255, .7)!important;
    }
    .ant-select-arrow {
      transform: rotate(180deg);
    }
  }
}

</style>