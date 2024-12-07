<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import logo from '~/assets/cdn-32.png'
import {doh_list_str} from '~/logic/storage'
import doh from "~/assets/doh.json";

const removePostfix = (str: string, postfix: string) => {
  const regex = new RegExp(`(${postfix})+$`);
  return str.replace(regex, '');
}
const selectedOptions = ref<string[]>([])
watch(selectedOptions, (newValue) => {
  const filterNew = newValue.filter(x => x.length > 2);
  const filterOld = doh_list_str.value
      ?.split('\n')
      ?.map(x => removePostfix(x, ";"))
      ?.filter(x => x.length > 2)
    ?? [];
  const inputSet = new Set(filterNew);
  const oldSet = new Set([...inputSet, ...filterOld]);
  doh_list_str.value = Array.from(oldSet)
    .sort((a, b) => {
      return a.localeCompare(b)
    })
    .join(';\n')
})
</script>


<template>

  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <img :src="logo" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <SharedSubtitle/>
    <div>{{先}}</div>
    <label for="dns-list">请填写DNS Over HTTPS服务器地址, 多个请用分号隔开, 默认为空, 清空则关闭DOH功能</label>
    <div></div>
    <textarea id="dns-list"
              v-model="doh_list_str"
              class="border border-gray-400 rounded px-4 py-2 mt-4"
              minlength="140"
              rows="8"
              cols="60"
              placeholder="请填写DNS Over HTTPS服务器地址, 多个请用分号隔开, 可以从下面的多选框中选择"
    ></textarea>
    <div></div>

    <div v-for="selectOption in selectedOptions" v-key="selectOption">
      {{ selectOption }};
    </div>

    <label for="dns-select">按Ctrl键后可以多选</label>
    <div></div>
    <select id="dns-select" v-model="selectedOptions"
            name="choose multiply doh server addr"
            multiple=true
            size="50"
            class="border border-gray-400 rounded px-4 py-2 mt-4">

      <optgroup v-for="(options, label) in doh" :label="label" :key="label">
        <option v-for="option in options" :value="option.url" :key="option.url">{{ option.name }}</option>
      </optgroup>
    </select>
    <div>get more info via
      <a href="https://github.com/paulmillr/encrypted-dns/blob/master/README.cmn-CN.md">
        <button color="blue">
          Github LINK
        </button>
      </a>
    </div>
    <div class="mt-4">
      Powered by Vite
      <pixelarticons-zap class="align-middle inline-block"/>
    </div>
  </main>
</template>
