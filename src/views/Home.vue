<template>
  <!-- Home  -->
  <div class="home">
    <!-- Landing  -->
    <div class="landing">
      <!-- Heading  -->
      <h1 class="heading">
        Stop sending single transactions,
        <span>send multiple at once.</span>
      </h1>
      <!-- Sub-heading  -->
      <h2 class="sub-heading">
        Welcome to
        <span>Theta Sender.</span>
      </h2>
      <!-- Process  -->
      <div class="process">
        <!-- Process-ul  -->
        <ul class="process-ul">
          <!-- Process-item  -->
          <li class="process-item">
            <img :src="metaMask" alt="Icon" />
            <span class="process-title">connect</span>
            <span>your wallet</span>
          </li>
          <!-- Bar  -->
          <hr />
          <!-- Process-item  -->
          <li class="process-item">
            <img :src="upload" alt="Icon" />
            <span class="process-title">upload</span>
            <span>destination addresses</span>
          </li>
          <!-- Bar  -->
          <hr />
          <!-- Process-item  -->
          <li class="process-item">
            <img :src="share" alt="Icon" />
            <span class="process-title">send</span>
            <span>tokens</span>
          </li>
        </ul>
      </div>
      <!-- Router-link | a tag | action button  -->
      <router-link class="btn" to="sendtoken">send tokens</router-link>
    </div>
  </div>
  <!-- Home  -->
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
// Importing things we need

// Images
import metaMask from "../assets/images/metamask.svg";
import share from "../assets/images/share-wt.svg";
import upload from "../assets/images/upload-wt.svg";

export default {
  name: "Home",
  setup() {
    // Returning data
    return { metaMask, share, upload };
  },
};
</script>

<style lang="scss" scoped>
// home styles
.home {
  display: flex;
  align-items: center;
  color: #fff;
  min-height: 80vh;
  width: 80%;
  margin: auto;
  // landing styles
  .landing {
    // heading styles
    .heading {
      font-size: 3.5rem;
      color: #fff;
      font-weight: bold;
      span {
        font-weight: bold;
        display: block;
      }
    }
    // sub-heading styles
    .sub-heading {
      font-size: 5rem;
      color: #fff;
      text-shadow: 10px 10px 99px #999;
      span {
        font-weight: bold;
        background: transparent linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%)
          0% 0% no-repeat padding-box;
        color: transparent;
        background-clip: text;
      }
    }
    // process styles
    .process {
      margin-top: 120px;
      display: grid;
      place-items: center;
      position: relative;
      // process-ul
      .process-ul {
        display: flex;
        align-items: center;
        list-style: none;
        justify-content: space-evenly;
        position: absolute;
        left: -10%;
        padding: 25px;
        // process-item
        .process-item {
          text-align: center;
          display: block;
          width: 100%;
          .process-title {
            font-weight: bold;
            padding: 10px 0px;
            font-size: 1.2rem;
          }
          span {
            font-size: 1rem;
            text-transform: capitalize;
            color: #fff;
            display: block;
            text-align: center;
          }
          img {
            width: 20%;
            min-width: 30px;
          }
        }
        // Hr
        hr {
          width: 100%;
          background: transparent
            linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%) 0% 0% no-repeat
            padding-box;
          height: 3px;
          border: 0px;
        }
      }
    }
    // process-btn styles
    .btn {
      display: none;
      text-transform: capitalize;
      width: 200px;
      margin: 50px auto;
      padding: 7px 40px;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: bold;
      text-decoration: none;
      background: transparent linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%)
        0% 0% no-repeat padding-box;
      color: #fff;
    }
  }
}

// Media queries starting from here
@media only screen and (max-width: 1000px) {
  // home styles
  .home {
    // landing styles
    .landing {
      // heading styles
      .heading {
        font-size: 3rem;
      }
      // sub-heading styles
      .sub-heading {
        font-size: 4.5rem;
      }
    }
  }
}

@media only screen and (max-width: 735px) {
  // home styles
  .home {
    // landing styles
    .landing {
      // heading styles
      .heading {
        font-size: 2.5rem;
      }
      // sub-heading styles
      .sub-heading {
        font-size: 4rem;
      }
    }
  }
}

@media only screen and (max-width: 655px) {
  // home styles
  .home {
    width: 100%;
    padding: 20px;
    justify-content: center;
    // landing styles
    .landing {
      margin-top: 50px;

      // heading styles
      .heading {
        font-size: 2rem;
        padding: 0px 10px;
        span {
          display: inline-block;
        }
      }
      // sub-heading styles
      .sub-heading {
        font-size: 3rem;
        padding: 0px 10px;
      }
      // process
      .process {
        .process-ul {
          left: 0;
          padding: 10px 0px;
        }
      }
    }
  }
}

@media only screen and (max-width: 550px) {
  // home styles
  .home {
    // landing styles
    .landing {
      // process styles
      .process {
        margin-top: 50px !important;
        // process-ul styles
        .process-ul {
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative !important;
          hr {
            height: 100px !important;
            width: 3px !important;
            margin: 25px;
            background: transparent
              linear-gradient(180deg, #30cfd0 0%, #c43ad6 100%) 0% 0% no-repeat
              padding-box;
          }
        }
      }
      // process btn
      .btn {
        display: block;
      }
    }
  }
}

@media only screen and (max-width: 444px) {
  // home styles
  .home {
    width: 100%;
    // landing styles
    .landing {
      // heading styles
      .heading {
        font-size: 1.5rem;
        span {
          display: block;
        }
        padding: 20px 0px;
      }
      // sub-heading styles
      .sub-heading {
        font-size: 2rem;
        padding: 0px;
      }
    }
  }
}
</style>
