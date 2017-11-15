import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    audio: {
      songUrl: '',
      imgUrl: 'http://m.kugou.com/v3/static/images/index/logo_kugou.png',
      title: '',
      singer: '',
      currentLength: 0,
      songLength: 0,
      currentFlag: false
    },
    head: {
      toggle: false,
      title: '',
      style: {'background': 'rgba(43,162,251,0)'}
    },
    headNav: 'head-nav1',
    audioLoading: false,
    detailPlayerFlag: false,
    showPlayer: false,
    listenCount: 0,
    isPlay: false,
    musicArr: [],
    listInfo: {
      songList: [],
      songIndex: 0
    }
  },
  getters: {
    headNav: state => state.headNav,
    audio: state => state.audio,
    head: state => state.head,
    audioLoading: state => state.audioLoadding,
    detailPlayerFlag: state => state.detailPlayerFlag,
    showPlayer: state => state.showPlayer,
    isPlay: state => state.isPlay
  },
  mutations: {
    setAudio(state, audio){
      if (!state.listenCount) {
        state.showPlayer = true
      }
      state.listenCount++
      state.audio = {...(state.audio), ...audio}
    },
    setAudioTime(state, time){
      state.audio.currentLength = time
    },
    setCurrent(state, flag){
      state.audio.currentFlag = flag
    },
    showHead(state, flag){
      state.head.toggle = flag
    },
    setHeadTitle(state, title){
      state.head.title = title
    },
    setHeadStyle(state, style){
      state.head.style = style
    },
    resetHeadStyle: state => {
      state.head.style = {'background': 'rgba(43,162,251,0)'}
    },
    toggleAudioLoading: (state, flag) => {
      state.audioLoading = flag
    },
    setHeadNav: (state, nav) => {
      state.headNav = nav
    },
    showDetailPlayer: (state, flag) => {
      state.detailPlayerFlag = flag
    },
    showPlayer: (state, flag) => {
      state.showPlayer = flag
    },
    isPlay: (state, flag) => {
      state.isPlay = flag
    },
    setLrc: (state, lrc) => {
      state.audio = {...(state.audio), lrc}
    },
    setListInfo: (state, {list, index}) => {
      state.listInfo.songList = list
      state.listInfo.songIndex = index
    }
  },
  actions: {
    getSong({commit, state}, hash){
      commit('toggleAudioLoading', true)
      axios.get(`/bproxy/yy/index.php?r=play/getdata&hash=${hash}`).then(({data}) => {
        data = data.data
        const songUrl = data.play_url
        const imgUrl = data.img
        const title = data.audio_name
        const songLength = data.timelength / 1000
        const singer = data.author_name
        const currentLength = 0;
        const lrc = data.lyrics
        const audio = {songUrl, imgUrl, title, singer, songLength, currentLength}
        commit('setAudio', audio)
        commit('setLrc', lrc)
        commit('toggleAudioLoading', false)
      })
    },
    prev({dispatch, state}){
      let list = state.listInfo.songList
      state.musicArr = list
      if (state.listInfo.songIndex === 0) {
        state.listInfo.songIndex = list.length
      } else {
        state.listInfo.songIndex--
      }
      if (state.musicArr.length) {
        let hash = list[state.listInfo.songIndex].hash
        dispatch('getSong', hash)
        // dispatch('getLrc', hash)
      }
    },
    next({dispatch, state}){
      let list = state.listInfo.songList
      state.musicArr = list
      if (state.listInfo.songIndex === list.length - 1) {
        state.listInfo.songIndex = 0
      } else {
        state.listInfo.songIndex++
      }
      if (state.musicArr.length) {
        let hash = list[state.listInfo.songIndex].hash
        dispatch('getSong', hash)
        // dispatch('getLrc', hash)
      }
    },
    playAudio({commit, dispatch, state}, {index, songList}){
      state.showPlayer = true
      state.isPlay = true
      this.musicArr = songList
      state.listInfo.songList = songList
      let hash = state.listInfo.songList[index].hash
      let info = {
        list: state.listInfo.songList,
        index: index
      }
      commit('setListInfo', info)
      dispatch('getSong', hash)
    }
  },
})

export default store
