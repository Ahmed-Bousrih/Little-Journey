<script setup>
import { useRoute } from "vue-router";
import Typed from "typed.js";
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";

/* ---------------- Personalization ---------------- */
const route = useRoute();
const name = computed(() => {
  if (!route.params.name) return "The Love Of My Life";
  const raw = String(route.params.name);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
});

/* ---------------- Story Script (reactive) ---------------- */
const lines = computed(() => [
  `Some distances are measured in kilometers…`,
  `…others in the quiet spaces between heartbeats.`,
  `Time flows normally for everyone else…`,
  `…but slows when I think of you, ${name.value}.`,
  `Nights are longer without your laughter or voice around me.`,
  `I read and replay our conversations every night,`,
  `…and hold your photos close until my tears fade.`,
  `I hear your voice comforting me through your tears and when I am sick…`,
  `…and all the long date nights we shared dreaming and hearing you laugh…`
  `…and I wish I could hear it again just one more time.`,
  `Thoughts of you arrive from everywhere, reminding me of your love.`,
  `Distance is stubborn, unmoved by wishes or plans…`,
  `…yet my heart still carries you everywhere it goes.`,
  `I replay our memories softly, even if they are bittersweet.`,
  `All our low, sad moments and precious happy ones,`,
  `…because they are all part of our love story.`,
  `Every problem and obstacle we kicked together,`,
  `…and every time we lifted each other up again.`,
  `All the times you said, “I wish you good night and sweet dreams.”`,
  `It's just so hard living knowing we can't be together.`,
  `I miss you, ${name.value}, more than I can ever say.`,
  `I know this programmed message can't solve anything…`,
  `But I hope it reminds you that I love you and always will.`,
  `I wasn't the best boyfriend for you, but I hope you forgive me.`,
  `You deserve the world, and I respect your choice to leave.`,
  `I just hope you remember me fondly, not with pain.`,
  `You gave me happiness in my lowest time of my life…`,
  `…and gave me feelings after I lost all of them before you.`,
  `I am always greateful for god and for everything you brought into me.`,
  `🌙 THE END 🌙`,
]);

/* ---------------- Step + Timer ---------------- */
const step = ref(0);
const secondsLeft = ref(7);
let interval = null;

function startTimer() {
  interval = setInterval(() => {
    secondsLeft.value--;
    if (secondsLeft.value <= 0) nextStep();
  }, 1000);
}

function nextStep() {
  if (step.value < lines.value.length - 1) {
    step.value++;
    secondsLeft.value = 7;
    runTyped(lines.value[step.value]);
  } else {
    // Stop at the final "THE END" slide
    clearInterval(interval);
  }
}

/* ---------------- Typed Text ---------------- */
const typedEl = ref(null);
let typedInstance = null;

function runTyped(text) {
  if (!typedEl.value) return;
  if (typedInstance) typedInstance.destroy();
  typedInstance = new Typed(typedEl.value, {
    strings: [text],
    typeSpeed: 38,
    showCursor: false,
  });
}

/* Update typed text on step change */
watch(step, async () => {
  await nextTick();
  runTyped(lines.value[step.value]);
});

/* ---------------- Background Color ---------------- */
const bgClass = computed(() => `bg-${step.value % 5}`);

/* ---------------- Lifecycle ---------------- */
onMounted(async () => {
  await nextTick();
  runTyped(lines.value[0]);
  startTimer();
});

onUnmounted(() => clearInterval(interval));
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
      <div :key="step">
        <h1 v-if="step === 0">A small message for {{ name }}</h1>

        <!-- 💓 heartbeat scene on step 1 -->
        <div v-if="step === 1" class="heart-wrap">
          <div class="heart"></div>
          <p class="heart-text">Always beating for you</p>
        </div>

        <p ref="typedEl"></p>
      </div>
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

/* 🌈 backgrounds */
.bg-0 { background: radial-gradient(circle, #1a1a3a, #050510); }
.bg-1 { background: radial-gradient(circle, #2a1740, #090312); }
.bg-2 { background: radial-gradient(circle, #401728, #12030a); }
.bg-3 { background: radial-gradient(circle, #2a2a60, #0a0a20); }
.bg-4 { background: radial-gradient(circle, #3a1f3f, #0c0412); }

/* 🌌 star layers */
.stars { position:absolute; inset:0; background-image: radial-gradient(2px 2px white, transparent); background-size:120px 120px; opacity:0.35; animation:drift linear infinite; }
.layer1 { animation-duration:120s; }
.layer2 { animation-duration:200s; opacity:0.2; }
.layer3 { animation-duration:260s; opacity:0.1; }
@keyframes drift { from{transform:translateY(0);} to{transform:translateY(-2000px);} }

/* 💓 heartbeat */
.heart-wrap { margin:20px 0; text-align:center; }
.heart { position:relative; width:100px; height:90px; margin:0 auto; transform:scale(1); animation:beat 1.4s infinite; }
.heart::before, .heart::after { content:""; position:absolute; width:50px; height:80px; background:#ff4d6d; border-radius:50px 50px 0 0; top:0; }
.heart::before { left:50px; transform:rotate(-45deg); transform-origin:0 100%; }
.heart::after { left:0; transform:rotate(45deg); transform-origin:100% 100%; }
@keyframes beat { 0%,100%{transform:scale(1);} 50%{transform:scale(1.2);} }
.heart-text { margin-top:14px; opacity:0.8; font-size:18px; }

/* content */
.content { position:relative; z-index:2; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px; font-size:clamp(20px,4vw,34px); max-width:800px; margin:auto; }

/* fade */
.fade-enter-active,.fade-leave-active { transition:opacity .8s ease; }
.fade-enter-from,.fade-leave-to { opacity:0; }

/* timer */
.timer { position:absolute; top:14px; right:18px; opacity:.7; font-size:14px; }
</style>
