<template>
  <div v-show="showPlayer" class="audio-view">
    <audio :src="audio.songUrl" autoplay id="audioPlay" @timeupdate="change()" @ended="next()" @error="next()"></audio>
    <div class="audio-panel">
      <img alt="" class="player-img" :src="audio.imgUrl" @click="showDetailPlayer()">
      <div class="player-status" @click="showDetailPlayer()">
        <p class="player-title ellipsis">{{audio.title.split(' ')[2]}}</p>
        <p class="player-singer ellipsis">{{audio.singer}}</p>
      </div>
      <div class="player-controls">
        <span class="player-Play" @click="toggleStatus()" :class="{'player-Pause':isPlay}"></span>
        <span class="player-nextSong" @click="next()"></span>
        <span class="player-download">
          <img src="../../assets/images/download_icon.png" alt="" width="20" height="20">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'play',
    data(){
      return {}
    },
    computed: {
      ...mapGetters(['audio', 'audioLoading', 'showPlayer', 'isPlay'])
    },
    methods: {
      toggleStatus(){
        if (this.isPlay) {
          document.getElementById('audioPlay').pause();
        } else {
          document.getElementById('audioPlay').play();
        }
        this.$store.commit('isPlay', !this.isPlay);
      },
      showDetailPlayer(){
        if (this.showPlayer) {
          this.$store.commit('showDetailPlayer', true);
        }
      },
      change(){
        let time = document.getElementById('audioPlay').currentTime
        if (this.audio.currentFlag) {
          document.getElementById('audioPlay').currentTime = this.audio.currentLength;
          this.$store.commit('setCurrent', false);
        } else {
          this.$store.commit('setAudioTime', time);
        }
      },
      next(){
        this.$store.dispatch('next');
      }
    }
  }
</script>

