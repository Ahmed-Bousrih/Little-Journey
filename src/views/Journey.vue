<script setup>
import { useRoute } from 'vue-router'
import Typed from 'typed.js'
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

/* ---------------- Personalization ---------------- */
const route = useRoute()
const name = computed(() => {
  if (!route.params.name) return 'The Love Of My Life'
  const raw = String(route.params.name)
  return raw.charAt(0).toUpperCase() + raw.slice(1)
})

/* ---------------- Story Script (reactive) ---------------- */
const lines = computed(() => [
  `Some distances are measured in kilometers…`,
  `…others are measured in heartbeats.`,
  `Time moves normally for the world…`,
  `but slower when I miss you, ${name.value}.`,
  `Some nights feel too quiet without you.`,
  `Some thoughts return only to you.`,
  `Distance is real…`,
  `but so is what I feel for you.`,
  `I miss you, ${name.value}.`
])

/* ---------------- Step + Timer ---------------- */
const step = ref(0)
const secondsLeft = ref(7)
let interval = null

function startTimer() {
  interval = setInterval(() => {
    secondsLeft.value--
    if (secondsLeft.value <= 0) nextStep()
  }, 1000)
}

function nextStep() {
  if (step.value < lines.value.length - 1) {
    step.value++
    secondsLeft.value = 7
  } else {
    clearInterval(interval)
  }
}

/* ---------------- Typed Text ---------------- */
const typedEl = ref(null)
let typedInstance = null

function runTyped(text) {
  if (!typedEl.value) return
  if (typedInstance) typedInstance.destroy()
  typedInstance = new Typed(typedEl.value, {
    strings: [text],
    typeSpeed: 38,
    showCursor: false
  })
}

/* Update typed text on step change */
watch(step, async () => {
  await nextTick()
  runTyped(lines.value[step.value])
})

/* ---------------- Background Color Per Step ---------------- */
const bgClass = computed(() => `bg-${step.value % 5}`)

/* ---------------- Lifecycle ---------------- */
onMounted(async () => {
  await nextTick()
  runTyped(lines.value[0])
  startTimer()
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="scene" :class="bgClass">

    <!-- 🌌 parallax stars -->
    <div class="stars layer1"></div>
    <div class="stars layer2"></div>
    <div class="stars layer3"></div>

    <!-- ⏱ countdown -->
    <div class="timer">{{ secondsLeft }}</div>

    <div class="content">
      <transition name="fade" mode="out-in">
        <div :key="step">

          <h1 v-if="step === 0">A small journey for {{ name }}</h1>

          <!-- 💓 heartbeat scene on step 2 -->
          <div v-if="step === 2" class="heart-wrap">
            <div class="heart"></div>
            <p class="heart-text">Still beating for you</p>
          </div>

          <p ref="typedEl"></p>

        </div>
      </transition>
    </div>
  </div>
</template>

<style>
.scene {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: white;
  font-family: system-ui;
  transition: background 2s ease;
}

/* 🌈 background moods */
.bg-0 { background: radial-gradient(circle,#1a1a3a,#050510); }
.bg-1 { background: radial-gradient(circle,#2a1740,#090312); }
.bg-2 { background: radial-gradient(circle,#401728,#12030a); }
.bg-3 { background: radial-gradient(circle,#2a2a60,#0a0a20); }
.bg-4 { background: radial-gradient(circle,#3a1f3f,#0c0412); }

/* 🌌 star layers */
.stars {
  position:absolute;
  inset:0;
  background-image: radial-gradient(2px 2px white, transparent);
  background-size: 120px 120px;
  opacity:.35;
  animation: drift linear infinite;
}
.layer1 { animation-duration: 120s; }
.layer2 { animation-duration: 200s; opacity:.2; }
.layer3 { animation-duration: 260s; opacity:.1; }

@keyframes drift { from { transform: translateY(0); } to { transform: translateY(-2000px); } }

/* 💓 heartbeat glow */
.heart-wrap { margin:20px 0; text-align:center; }
.heart {
  width:90px;
  height:90px;
  background:#ff4d6d;
  transform:rotate(45deg);
  margin:auto;
  animation: beat 1.4s infinite;
  box-shadow:0 0 40px #ff4d6d88;
  position: relative;
}
.heart::before,
.heart::after {
  content:"";
  width:90px; height:90px; background:#ff4d6d; border-radius:50%;
  position:absolute;
}
.heart::before { top:-45px; }
.heart::after { left:-45px; }
@keyframes beat { 0%{transform:rotate(45deg) scale(.9)}50%{transform:rotate(45deg) scale(1.15)}100%{transform:rotate(45deg) scale(.9)} }
.heart-text { margin-top:14px; opacity:.8; font-size:18px; }

/* content */
.content {
  position:relative;
  z-index:2;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:20px;
  font-size:clamp(20px,4vw,34px);
  max-width:800px;
  margin:auto;
}

/* fade */
.fade-enter-active,.fade-leave-active { transition: opacity .8s ease; }
.fade-enter-from,.fade-leave-to { opacity:0; }

/* timer */
.timer { position:absolute; top:14px; right:18px; opacity:.7; font-size:14px; }
</style>
