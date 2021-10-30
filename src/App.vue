<script setup>
import { ref } from "vue";
import Topbar from './components/Topbar.vue'
</script>

<template>
  <div>
    <Topbar/>
    <main>
      <router-view />
    </main>
  </div>
</template>
