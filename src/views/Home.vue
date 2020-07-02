<template>
  <div id="hee">
    <div class="main">
      <div class="sticker">
        <div v-if="sticker.taiyaki" class="animate__animated animate__zoomIn">
          <img src="@/assets/character_taiyaki.png" alt="">
        </div>
      </div>
      <div class="canvas"></div>
      <audio id="audio" preload="metadata" controls>
        <source src="@/assets/taiyaki.mp3" type="audio/mp3">
      </audio>
    </div>

    <div class="control" v-if="showMenu">
      [ESC]で開閉
      <button class="btn" @click="taiyaki100">よみたい焼き</button>
      <button class="btn" @click="resetCount">リセット</button>
      <div class="remote">
        <div class="center">リモート<br>コントロールにする</div>
        <div class="center">
          <button class="remote-btn" @click="generateControlUrl">リモコンページを<br>生成する</button>
          <a :href="urlControlPage" target="_blank">{{ urlControlPage }}</a>
          <img id="qrControlPage" src="" alt="">
        </div>
      </div>
      <br>
      <button @click="reload">リロード</button>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { Engine, Render, Runner, World, Bodies } from 'matter-js'

export default {
  name: 'Home',
  data() {
    return {
      point: 0,
      urlControlPage: '',
      canvas: {
        width: 1280,
        height: 720,
      },
      mattetr: {
        engine: null,
        world: null,
        render: null,
        runner: null
      },
      showMenu: true,
      isAnimation: false,
      sticker: {
        taiyaki: false,
      }
    }
  },
  watch: {
  },
  computed: {
    myPeerId() {
      return this.$store.state.myPeerId
    },
    connectPeerId() {
      return this.$store.state.connectPeerId
    },
  },
  mounted() {
    this.initWorld()
    this.initEventListener()
  },
  methods: {
    reload(){
      location.reload()
    },
    initEventListener() {
      document.addEventListener("keydown", event => {
        // ESCAPE
        if (event.keyCode == 27) {
            this.showMenu = !this.showMenu
        }
      });
    },
    generateControlUrl() {
      this.$store.state.myPeerId = this.$peer.id
      const url = location.href+'control/'+this.myPeerId
      this.urlControlPage = url
      QRCode.toDataURL(url, function (err, url) {
        document.getElementById('qrControlPage').src = url
      })
      this.receivePeer()
    },
    receivePeer() {
      const peers = this.peers
      const taiyaki100 = this.taiyaki100
      const resetCount = this.resetCount

      this.$peer.on('connection', function(conn) {
        conn.on('data', function(data){
          if(data == "connect") {
            peers()
          }
          if(data == "taiyaki100") {
            taiyaki100()
          }
          if(data == "reset") {
            resetCount()
          }
        });
      })
    },
    peers() {
      for (let [key] of Object.entries(this.$peer.connections)) {
        this.$store.state.connectPeerId.push(key);
      }
    },
    taiyaki100() {
      if(!this.isAnimation) {
        this.playAudio()
        this.dropTaiyakiPercentage(1)

        var showSticker = this.showSticker
        setTimeout(function(){
          showSticker('taiyaki')
        }, 3000)
      }
    },
    dropTaiyakiPercentage(percentage) {
      var len = Math.floor(150*percentage)
      var n = 0
      var during = 1000
      var addTaiyaki = this.addTaiyaki
      var setIsAnimation = this.setIsAnimation
      var getIsAnimation = this.getIsAnimation
      this.setIsAnimation(true)
      var interval = setInterval(function() {
        if(!getIsAnimation()) {
          clearInterval(interval)
          return
        }
        console.log(n)
        addTaiyaki()
        n++
        if(n == len) {
          clearInterval(interval)
          setIsAnimation(false)
        }
      }, during/len)
    },
    showSticker(sticker) {
      this.sticker[sticker] = true
    },
    getIsAnimation() {
      return this.isAnimation
    },
    setIsAnimation(val) {
      this.isAnimation = val
    },
    resetCount() {
      this.setIsAnimation(false)
      this.clearWorld()
      this.sticker.taiyaki = false
    },
    initWorld() {
      // create engine
      this.mattetr.engine = Engine.create()  //物理演算エンジンを生成？
      this.mattetr.world = this.mattetr.engine.world  //重力の存在する仮想世界の生成…？

      // create renderer
      this.mattetr.render = Render.create({  //レンダリングの設定？
        element: document.querySelector('.canvas'),
        engine: this.mattetr.engine,
        options: {
          width: this.canvas.width,  //ステージの横幅
          height: this.canvas.height,  //ステージの高さ
          background: '#00ff00',  //ステージの背景色
          wireframes: false  //ワイヤーフレームモードをオフ
        }
      });

      Render.run(this.mattetr.render);  //ステージを配置させる記述？

      // create runner
      this.mattetr.runner = Runner.create();
      Runner.run(this.mattetr.runner, this.mattetr.engine);  //物理エンジンを実行？

      this.defaultObject()
    },
    clearWorld() {
      World.clear(this.mattetr.world, true)
      this.defaultObject()
    },
    defaultObject() {
      //床
      var yuka = Bodies.rectangle(this.canvas.width/2, this.canvas.height+15, this.canvas.width, 30, {
        isStatic: true
      });
      var kabeRight = Bodies.rectangle(this.canvas.width+15, this.canvas.height/2, 30, this.canvas.height, {
        isStatic: true
      });
      var kabeLeft = Bodies.rectangle(-15, this.canvas.height/2, 30, this.canvas.height, {
        isStatic: true
      });
      World.add(this.mattetr.world, [  //作成した図形をステージに追加して描画する？
        yuka,
        kabeRight,
        kabeLeft
      ]);
    },
    addTaiyaki() {
      var range = getRandomInt(-100, 100)

      var taiyaki = Bodies.circle(this.canvas.width/2+range, -100, 40, {
        density: 10, // 密度
        frictionAir: 0, // 空気抵抗
        restitution: 0.5, // 弾力性
        friction: 1, // 本体の摩擦
        render: {
          lineWidth: 5,  //線の太さ
          sprite: { //スプライトの設定
            texture: './img/character_taiyaki.png' //テクスチャ画像を指定
          }
        }
      });

      World.add(this.mattetr.world, [  //作成した図形をステージに追加して描画する？
          taiyaki
      ]);

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      }
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
  background: #efefef;
}

#hee {
  .main {
    text-align: center;
    .sticker {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    .canvas {
      position: fixed;
      width: 100%;
      height: 100%;
      line-height: 0;
      canvas {
        width: 100%;
        height: 100%;
      }
    }
  }

  .control {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    padding: 30px;
    background: #efefef;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .btn {
      margin-top: 10px;
      width: 200px;
      height: 100px;
      font-size: 2em;
      background: #ffffff;
      box-shadow:2px 2px 9px -2px #969696;
      border-radius:6px;
      border:1px solid #cccccc;
      color: inherit;
      text-decoration: none;
    }
    .remote {
      margin-top: 10px;
      padding: 10px;
      width: 200px;
      box-sizing: border-box;
      background: #ff9bcd;
      box-shadow:2px 2px 9px -2px #969696;
      border-radius:6px;
      border:1px solid #cccccc;
      color: inherit;
      text-decoration: none;
      word-wrap: break-word;
    }
  }

  audio {
    display: none;
  }
}
</style>