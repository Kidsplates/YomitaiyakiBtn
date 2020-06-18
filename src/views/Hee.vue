<template>
  <div id="hee">
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
    <button class="btn" @click="addCount">へえ</button>
    <button class="btn" @click="resetCount">リセット</button>
    <router-link to="/control">リモコン</router-link>
  </div>
</template>

<script>
export default {
  name: 'Hee',
  data() {
    return {
    }
  },
  watch: {
    'count': {
      handler: function() {
        let percent = (this.count/this.max) * 100
        console.log(percent)
        document.getElementById('bar').style.height = percent + "%"
        this.playAudio()
      }
    },
  },
  computed: {
    count() {
      return this.$store.state.count
    },
    max() {
      return this.$store.state.max
    },
    myPeerId() {
      return this.$store.state.myPeerId
    },
    connectPeerId() {
      return this.$store.state.connectPeerId
    },
  },
  methods: {
    connectPeer() {
      const id = this.connectPeerId
      const conn = this.$peer.connect(id)
      const pushBtn = this.pushBtn

      console.log(this.$peer);
      conn.on('open', function() {
        console.log("connect")
      })
      this.$peer.on('connection', function(conn) {
        conn.on('data', function(data){
          if(data == "push") {
            pushBtn()
          }
        });
      })
    },
    remotePushBtn() {
      const id = this.connectPeerId
      const conn = this.$peer.connect(id)
      conn.on('open', function() {
        conn.send('push');
      })
    },
    addCount() {
      if (this.$store.state.count < this.$store.state.max) {
        this.$store.state.count += 1
      }
    },
    resetCount() {
      this.$store.state.count = 0
    },
    playAudio() {
      const audio = document.getElementById("audio").cloneNode(true)
      audio.play()
    },
  },
}
</script>

<style lang="scss">
#hee {
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