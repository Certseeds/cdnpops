<script setup lang="ts" xmlns="">
import {doh_list_str} from '~/logic/storage'
import logo from "~/assets/cdn-32.png";

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const openDoh = ref(false);
const doh_list = ref<string[]>([]);
watch(doh_list_str, (newValue) => {
  openDoh.value = newValue.length > 0;
  doh_list.value = newValue.split('\n').filter(x => x.length > 2);
})
</script>

<template>
  <main class="w-full px-4 py-5 text-center text-gray-700">
    <img :src="logo" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <div>Sidepanel</div>
    <SharedSubtitle/>

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div></div>
    <div class="mt-2">
      <span>DOH status: {{ openDoh }}</span>
      <dl>
        <li v-for="doh in doh_list" v-key="doh">{{ doh }}</li>
      </dl>
      <div></div>
    </div>
  </main>
</template>
