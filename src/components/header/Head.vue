<template>
  <div class="header">
    <HeadLogo></HeadLogo>
    <RankHead v-if="head.toggle" :title="head.title" :cStyle="head.style"></RankHead>
    <HeadNav v-else></HeadNav>
  </div>
</template>

<script>
  import HeadLogo from './HeadLogo';
  import HeadNav from './HeadNav'
  import RankHead from './RankHead'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters(['head'])
    },
    components: {HeadLogo, HeadNav, RankHead}
  }
</script>
