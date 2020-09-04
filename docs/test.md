# Test Vuepress

::: danger 测试 Vuepress
引入 greet.ts 并进行测试
:::

<template>
  <collapse title="查看答案">{{msg}}</collapse>
</template>

<template>
  <div>{{msg}}</div>
</template>

<script lang="ts">
  import Greeter from 'xxxLib/greet';

  const greeter = new Greeter('world');
  const msg = greeter.greet()


  export default {
    data() {
      return {
         msg
      }
    },
  }
</script>
