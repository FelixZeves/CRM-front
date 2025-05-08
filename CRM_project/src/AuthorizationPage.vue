<script setup>
import AuthorizationBlank from './components/AuthorizationBlank.vue';
import AuthorizationHeader from './components/AuthorizationHeader.vue';
</script>

<template>
  <header>
    <AuthorizationHeader />
  </header>

  <main class="h-full content-center">
    <AuthorizationBlank />
  </main>
</template>

<style>
body{
  width: 100%;
  height: 100%;
}

main{
  display: flex;
  justify-content: center;
}

</style>