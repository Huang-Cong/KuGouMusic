<template>
  <div v-show="detailPlayerFlag" class="detailPlayerFlag">
    <div class="detail_player" :style="{backgroundImage:`url(${audio.imgUrl})`}"></div>
    <div class="detail_player"
         :style="{backgroundImage:`url(${audio.imgUrl})`,filter: 'blur(5px)', '-webkit-filter':'blur(5px)'}"></div>
    <div class="detail_player-content">
      <div class="detail_player-title container">
        <span class="detail_player-back" @click="hideDetailPlayer()"></span>
        {{audio.title.split(' ')[2]}}
      </div>
      <div class="detail_player-img">
        <img :src="audio.imgUrl">
      </div>
      <div class="detail_player-lrc">
        <div class="lrc-content" :style="{marginTop: lrcOffset + 'px' }">
          <p v-for="(item,index) in songLrc"
             :class="{isCurrentLrc:item.seconds >= audio.currentLength}">
            {{item.lrcContent}}</p>
        </div>
      </div>
      <div class="detail_player-range container">
        <span class="detail_player-time">{{audio.currentLength | time}}</span>
        <mt-range
          id="range"
          :min="0"
          :max="audio.songLength"
          v-model="audio.currentLength"
          :bar-height="3"
          @click.native="rangeChange($event)" disabled style="width: 80%"></mt-range>
        <span class="detail_player-time">{{audio.songLength | time}}</span>
      </div>
      <div class="detail_player-control player-padding">
        <i class="detail_player-btn play-prev player_btn-sm" @click="prev()"></i>
        <i class="detail_player-btn play-play player_btn-lg" :class="{'play-pause':isPlay}" @click="toggleStatus()"></i>
        <i class="detail_player-btn play-next player_btn-sm" @click="next()"></i>
      </div>
    </div>
    <div class="music-audio" @click="getAlter"><i></i>&nbsp; 下载这首歌</div>
    <div class="dialog-inner" v-show="alter">
      <div class="dialog-bd">
        <p>下载需要手机酷狗客户端支持。</p>
      </div>
      <div class="dialog-ft">
        <span class="btn btn-default js-dialog-hide" @click="getAlter">取消</span>
        <a href="javascript:;" class="btn btn-primary" id="downloadBtn">在客户端下载</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    data(){
      return {
        rangeValue: 0,
        alter: false
      }
    },
    filters: {
      time(value){
        let length = Math.floor(parseInt(value));
        let minute = Math.floor(value / 60);
        if (minute < 10) {
          minute = '0' + minute;
        }
        let second = length % 60;
        if (second < 10) {
          second = '0' + second;
        }
        return minute + ':' + second;
      }
    },
    computed: {
      ...mapGetters(['audio', 'detailPlayerFlag', 'isPlay']),
      songLrc(){
        if (this.audio.lrc) {
          let temp = this.audio.lrc.split('\r\n')
          temp = temp.splice(0, temp.length - 1)
          temp = temp.map((value) => {
            let time = value.substr(1, 5)
            let seconds = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])
            let lrcContent = value.substr(10)
            return {
              seconds,
              lrcContent
            }
          })
          return temp;
        }
      },
      lrcOffset(){
        if (this.songLrc) {
          let offset = (this.songLrc.length - document.querySelectorAll('.isCurrentLrc').length - 2) * (-20)
          return this.audio.currentLength + offset - this.audio.currentLength
        }
      }
    },
    methods: {
      getAlter() {
        this.alter = !this.alter
      },
      hideDetailPlayer(){
        this.$store.commit("showDetailPlayer", false)
      },
      rangeChange(event){
        let offset = event.offsetX
        let rangeWidth = (document.documentElement.clientWidth - 20) * 0.8 - 20
        let clickLength = Math.floor(offset * this.audio.songLength / rangeWidth)
        if (offset < rangeWidth) {
          this.$store.commit('setAudioTime', clickLength)
          this.$store.commit('setCurrent', true)
        }
      },
      toggleStatus(){
        if (this.isPlay) {
          document.getElementById('audioPlay').pause()
        } else {
          document.getElementById('audioPlay').play()
        }
        this.$store.commit('isPlay', !this.isPlay)
      },
      prev(){
        this.$store.dispatch('prev')
      },
      next(){
        this.$store.dispatch('next')
      }
    }
  }
</script>

<style>
  .music-audio {
    position: fixed;
    bottom: 60px;
    left: 22%;
    width: 56.25%;
    height: 45px;
    line-height: 45px;
    margin: 1.0714rem auto 0;
    text-align: center;
    color: #fff;
    background: #259ef7;
    font-size: 16px;
    border-radius: 5px;
    z-index: 50000;
  }

  .music-audio i {
    width: 1.6rem;
    height: 1.6rem;
    display: inline-block;
    vertical-align: text-top;
    background: url(../../assets/images/download_icon.png) no-repeat;
    background-size: 100%;
  }

  .dialog-inner {
    position: fixed;
    bottom: 250px;
    left: 6.5%;
    width: 88%;
    border-top: .25rem solid #229ef8;
    border-radius: 5px;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    font-size: 16px;
    z-index: 50000;
  }

  .dialog-bd {
    padding: 30px 20px;
    text-align: center;
  }

  .dialog-ft {
    width: 100%;
    border-top: 1px solid #ccc;
    display: box;
    display: -webkit-box;
  }

  .dialog-ft .btn-default {
    border-right: 1px solid #ccc;
    color: #828282;
    cursor: pointer;
  }

  .dialog-ft .btn {
    width: 50%;
    padding: 18px 0;
    font-size: 1rem;
    text-align: center;
    display: block;
    -webkit-box-flex: 1.0;
    box-flex: 1.0;
  }

  .dialog-ft .btn-primary {
    color: #229ef8;
    font-size: 14px;
  }
</style>
