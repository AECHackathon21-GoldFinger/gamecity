<script setup>
import { ref } from "vue";
</script>

<template>
  <div>
    <header class="bg-white shadow-lg select-none cursor-pointer">
      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 class="text-3xl font-extrabold leading-tight text-indigo-500">Gamecity</h1>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
