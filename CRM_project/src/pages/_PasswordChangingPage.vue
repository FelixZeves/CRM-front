<script setup>
import AuthorizationPasswordChanging from '@/components/forms/ChangePass.vue';
import AuthorizationHeader from '@/components/layouts/AuthorizationHeader.vue';
</script>

<template>
  <header>
    <AuthorizationHeader />
  </header>

  <main>
    <AuthorizationPasswordChanging />
  </main>
</template>

<style>

main{
  display: flex;
  justify-content: center;
}

</style>