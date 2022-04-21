<template>
  <!-- Header  -->
  <header class="header">
    <!-- Nav  -->
    <nav class="nav">
      <!-- Nav-ul  -->
      <ul class="nav-ul">
        <!-- Nav-item | Logo  -->
        <li class="nav-item">
          <!-- Router-link | a tag  -->
          <router-link class="logo" to="/"> Theta Sender</router-link>
<!--          <h4 class="opentheta">powered by OpenTheta</h4>-->
        </li>
        <!-- Nav-link | Send tokens  -->
        <li v-if="route.name != 'SendToken'" class="nav-item">
          <!-- Router-link | a tag  -->
          <router-link class="nav-link" to="sendtoken">send tokens</router-link>
        </li>
        <!-- Nav-link | Send tokens  -->
        <li v-if="wallet && route.name == 'SendToken'" class="nav-item wallet">
          <img :src="walletImg" alt="icon" />
          <span style="padding-top: 3px;font-weight: bold;">{{address}}</span>
        </li>
      </ul>
    </nav>
  </header>
  <!-- Header  -->
</template>

<script>
// Importing things we need
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
// Image
import walletImg from "../assets/images/wallet.svg";
export default {
  name: "Navbar",
  props: ["wallet"],
  data() {
    return {
      address: '',
    };
  },
  setup(props) {
    // Varaibles
    const route = useRoute();
    const wallet = ref(props.wallet);

    // // Watcher
    watch(
      () => props.wallet,
      () => {
        wallet.value = props.wallet;
      }
    );
    // Returning data
    return {
      route,
      wallet,
      walletImg,
    };
  },
  watch: {
    wallet() {
      this.address = this.$store.state.UserAddress.slice(0,5) + ' ... ' + this.$store.state.UserAddress.slice(-3)
    }
  }
};
</script>

<style lang="scss">
// header styles
.header {
  padding: 30px 20px;
  // nav styles
  .nav {
    // nav-ul styles
    .nav-ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      list-style: none;
      color: #fff;
      max-width: 80%;
      margin: auto;
      // nav-item styles
      .nav-item {
        .logo {
          font-size: 3rem;
          text-transform: capitalize;
          font-weight: bold;
          text-decoration: none;
          background: transparent
            linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%) 0% 0% no-repeat
            padding-box;
          color: transparent;
          background-clip: text;
        }
        .opentheta {
          padding-top: -5px;
          background: transparent
          linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%) 0% 0% no-repeat
          padding-box;
          color: transparent;
          background-clip: text;
        }
        // nav-link styles
        .nav-link {
          font-size: 1.2rem;
          font-weight: bold;
          text-decoration: none;
          text-transform: capitalize;
          //background: transparent
          //  linear-gradient(90deg, #30cfd0 0%, #c43ad6 100%) 0% 0% no-repeat
          //  padding-box;
          background: transparent linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%)
          0% 0% no-repeat padding-box;
          color: #fff;
          padding: 12px 40px;
          border-radius: 10px;
        
        }
      }
      .wallet {
        display: flex;
        gap: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        text-decoration: none;
        text-transform: capitalize;
        background: transparent linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%)
          0% 0% no-repeat padding-box;
        color: #fff;
        padding: 12px 30px;
        border-radius: 10px;
        img {
          width: 30px;
        }
      }
    }
  }
}

// Media queries starting from here
@media only screen and (max-width: 655px) {
  // header styles
  .header {
    // nav styles
    .nav {
      // nav-ul styles
      .nav-ul {
        max-width: 100%;
      }
    }
  }
}

@media only screen and (max-width: 550px) {
  // header styles
  .header {
    // nav styles
    .nav {
      // nav-ul styles
      .nav-ul {
        // nav-item styles
        .nav-item {
          // nav-link styles
          .nav-link {
            display: none;
          }
          .logo {
            font-size: 2rem;
          }
        }
        .wallet {
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>
