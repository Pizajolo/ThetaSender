<template>
  <!-- Container  -->
  <div class="container">
    <!-- Navbar  -->
    <Navbar :wallet="wallet" />
    <!-- View  -->
    <router-view @setWallet="wallet = true" />
  </div>
  <!-- Container  -->
</template>

<script>
// Importing thing we need
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
// Components
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: { Navbar },
  setup() {
    // Variables
    const route = useRoute();
    const wallet = ref(false);

    // Watcher 
    watch(
      () => route.name,
      () => {
        if (route.name == "Home") {
          wallet.value = false;
        }
      }
    );

    // Returning data
    return { wallet };
  },
};
</script>

<style lang="scss">
// Importing font family
@font-face {
  font-family: InterFace;
  src: url("./assets/fonts/InterFace-Regular.woff");
  font-weight: normal;
  font-style: normal;
  font-display: fallback;
}
// Importing font family
@font-face {
  font-family: InterFace;
  src: url("./assets/fonts/InterFace-Bold.woff2");
  font-weight: bold;
  font-style: normal;
  font-display: fallback;
}

* {
  // Changing default styles
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: InterFace;
  font-weight: normal;
}
// body styles
body {
  background: #000;
}
// container styles
.container {
  min-height: 100vh;
}
</style>
