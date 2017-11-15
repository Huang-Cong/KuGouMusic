<template>
  <div id="app">
    <Head></Head>
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <Player></Player>
    <DetailPlayer></DetailPlayer>
  </div>
</template>

<script>
  import Head from './components/header/Head'
  import Player from './components/musicDetails/Play'
  import DetailPlayer from './components/musicDetails/DetailPlayer'
  export default {
    components: {
      Head,
      Player,
      DetailPlayer
    }
  }
</script>

