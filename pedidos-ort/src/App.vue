<script setup>
import {RouterLink, RouterView, useRoute} from 'vue-router';
import {ref, computed} from 'vue'

const link = ref("/")
const linksVisualizados = computed({
  
})

</script>



<template>
  <header class="">
    <RouterLink :to='link' >Home</RouterLink>
    <div class="">
      
    </div>
  </header>
  <RouterView></RouterView>
  
</template>

<style>

</style>
