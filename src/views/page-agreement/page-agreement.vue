<template>
  <div>
    <component :is="current" />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import PrivacyPolicy from './components/privacy-policy.vue';
import UserAgreement from './components/user-agreement.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const agreementComponent: { [key: string]: Component } = {
  'user': UserAgreement,
  'privacy': PrivacyPolicy
}
const current = computed(() => agreementComponent?.[route.query.type as string ?? 'user'])
</script>