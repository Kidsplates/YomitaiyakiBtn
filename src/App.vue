<template>
  <div id="app">
    <div class="panel">
      <img src="@/assets/bar-bg.png" alt="">
      <div id="bar" class="bar">
      <img src="@/assets/bar.png" alt="">
      </div>
    </div>
    <div class="count">
      <img src="@/assets/count.png" alt="">
      <span>{{ count }}</span>
    </div>
    <audio id="audio" preload="metadata" controls>
      <source src="@/assets/hee.mp3" type="audio/mp3">
    </audio>
    <button class="btn" @click="pushBtn">へえ</button>
    <button class="btn" @click="resetBtn">リセット</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      count: 0,
      max: 20
    }
  },
  watch: {
    'count': {
      handler: function() {
        let percent = (this.count/this.max) * 100
        console.log(percent)
        document.getElementById('bar').style.height = percent + "%"
      }
    }
  },
  methods: {
    pushBtn() {
      if (this.count < this.max) {
        this.count++
      }
      this.playAudio()
    },
    resetBtn() {
        this.count = 0
    },
    playAudio() {
      const audio = document.getElementById("audio").cloneNode(true)
      audio.play()
    },
  },
}
</script>

<style lang="scss">
body {
  background: #00ff00;
}
img {
  vertical-align: top;
}
#app {
  text-align: center;

  .panel {
    position: relative;
    margin: 0 auto 1em;
  }
  .bar {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    overflow: hidden;
    img {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .btn {
    position: relative;
    z-index: 100;
    margin-top: 20px;
    background: #000000;
    color: #ffffff;
    border: 1px solid #ffffff;
    padding: 4px 12px;
  }
  .count {
    position: relative;
    margin: 0 auto;
    span {
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 200px;
    }
  }
  audio {
    display: none;
  }
}
</style>
