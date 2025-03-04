<template>
  <div class="category-item">
    <a-skeleton :paragraph="{ rows }" active />
  </div>
</template>

<script setup lang="ts">
defineProps({
  rows: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped lang="scss">
.category-item {
  background: radial-gradient(49% 49% at 23% 90%, rgba(51, 192, 253, .3) 0, rgba(51, 192, 253, 0) 100%), radial-gradient(122% 122% at 94% -6%, #dbe2ff 0, #f7f8fc 100%);
  border: 1px solid #e8eaf2;
  border-radius: 16px;
  width: 240px;
  padding: 16px 16px 12px;
  flex-shrink: 0;
  max-height: 100%;
  min-height: 300px;
  overflow: hidden;
}

</style>