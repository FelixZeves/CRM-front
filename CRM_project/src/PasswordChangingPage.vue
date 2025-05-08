<script setup>
import AuthorizationPasswordChanging from './components/AuthorizationPasswordChanging.vue';
import AuthorizationHeader from './components/AuthorizationHeader.vue';
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