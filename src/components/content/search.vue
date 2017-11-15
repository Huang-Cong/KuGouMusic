<template>
  <transition :name="transitionName">
    <div class="search-view">
      <div @click="goBack" class="search-head">
        <p class="search-title">搜索</p>
        <img src="http://m.kugou.com/v3/static/images/index/goback.png" alt="" width="15" height="25"
             style="margin-left: 10px; margin-top: -8px">
      </div>

      <div class="search-content">
        <div class="search-panel child-view-search">
          <div class="search-input">
            <span class="search-icon"></span>
            <input type="text" v-model="keyword" placeholder="歌手/歌名/拼音" @keydown.enter="search">
          </div>
          <a href="javascript:" @click="search" class="search-btn">搜索</a>
        </div>

        <div class="search-list" v-show="togglePanel">
          <div class="search-list-title">最近热门</div>
          <mt-cell v-for="(item,index) in hotList" :title="item.keyword" @click.native="replaceInput(index)"
                   :key="index"></mt-cell>
        </div>

        <div class="songs-list" v-show="!togglePanel">
          <div class="search-total">
            共有{{total}}条搜索结果
          </div>
          <mt-cell v-for="(item,index) in songList" :title="item.filename" @click.native="Audio(index)"
                   :key="index">
            <img src="../../assets/images/download_icon.png" width="20" height="20">
          </mt-cell>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {Indicator} from 'mint-ui'
  import {mapActions} from 'vuex'
  export default {
    data(){
      return {
        transitionName: 'slide-left',
        keyword: '',
        hotList: [],
        togglePanel: true,
        total: null,
        songList: []
      }
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
      next()
    },
    created(){
      this.getList()
    },
    methods: {
      ...mapActions(['playAudio']),
      Audio(index) {
        this.playAudio({index: index, songList: this.songList})
      },
      goBack () {
        this.$router.goBack()
      },
      getList(){
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        });
        this.$http.get('/aproxy/api/v3/search/hot?format=json&plat=0&count=30').then(({data}) => {
          Indicator.close();
          this.hotList = data.data.info
        });
      },
      replaceInput(index){
        this.keyword = this.hotList[index].keyword
        this.search()
      },
      search(){
        this.togglePanel = false
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
        if (this.keyword)
          this.$http.get(`/aproxy/api/v3/search/song?format=json&keyword=${this.keyword}&page=1&pagesize=30&showtype=1`).then(({data}) => {
            this.songList = data.data.info
            this.total = data.data.total
            Indicator.close()
          })
      }
    }
  }
</script>

<style>
  .child-view-search {
    position: absolute;
    width: 100%;
    transition: all .8s cubic-bezier(.55, 0, .1, 1);
  }

  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }

  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
</style>
