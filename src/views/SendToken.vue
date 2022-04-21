<template>
  <!-- Send token  -->
  <div class="send-token">
    <!-- Process -->
    <div v-if="currentStep <= 3" class="process">
      <!-- Process-ul  -->
      <ul class="process-ul">
        <!-- Process-item  -->
        <li class="process-item">
          <img v-if="currentStep === 1" :src="metaMask" alt="Icon" />
          <img v-else :src="metaMaskGr" alt="Icon" />
          <span :class="{ 'process-title': true, active: currentStep === 1 }">
            connect
          </span>
        </li>
        <!-- Bar  -->
        <hr />
        <!-- Process-item  -->
        <li class="process-item">
          <img v-if="currentStep === 2" :src="upload" alt="Icon" />
          <img v-else :src="uploadGr" alt="Icon" />
          <span :class="{ 'process-title': true, active: currentStep === 2 }">
            upload
          </span>
        </li>
        <!-- Bar  -->
        <hr />
        <!-- Process-item  -->
        <li class="process-item">
          <img v-if="currentStep === 3" :src="share" alt="Icon" />
          <img v-else :src="shareGr" alt="Icon" />
          <span :class="{ 'process-title': true, active: currentStep === 3 }">
            send
          </span>
        </li>
      </ul>

      <!-- Form steps start from here -->

      <!-- Step two  -->
      <StepOne :currentStep="currentStep" @nextStep="nextStep" />

      <!-- Step two  -->
      <StepTwo :currentStep="currentStep" @nextStep="nextStep" />

      <!-- Step three  -->
      <StepThree :currentStep="currentStep" @nextStep="nextStep" @previousStep="previousStep"/>

      <!-- Form steps end here   -->
    </div>
    <!-- Success modal  -->
    <div v-if="currentStep === 4" class="success-modal">
      <!-- Wraper  -->
      <div class="wraper">
        <!-- Heading  -->
        <h1 class="heading">Success!</h1>
        <!-- Sub heading  -->
        <h2 class="sub-heading">
          {{message}}
        </h2>
        <!-- See more btn -->
        <button @click="router.push('/')" class="see-btn">send more</button>
      </div>
    </div>
  </div>
</template>

<script>
// Importing things we need
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
// Images
import metaMaskGr from "../assets/images/metamask-gr.svg";
import shareGr from "../assets/images/share-gr.svg";
import uploadGr from "../assets/images/upload-gr.svg";

import metaMask from "../assets/images/metamask.svg";
import share from "../assets/images/share.svg";
import upload from "../assets/images/upload.svg";

// Components
import StepOne from "../components/form/StepOne.vue";
import StepTwo from "../components/form/StepTwo.vue";
import StepThree from "../components/form/StepThree.vue";
export default {
  name: "SendToken",
  emits: ["setWallet"],
  components: { StepOne, StepTwo, StepThree },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    getData() {
      let generalData = this.$store.state.SendType
      let sendData = this.$store.state.SendData
      let type = generalData.type
      let amount = 0
      switch (type) {
        case "tfuel":
          for(let i=0; i<sendData.length; i++){
            amount += sendData[i].amount
          }
          this.message = `You successfully sent in total ${generalData.totalAmount} TFuel to ${sendData.length} addresses!`
          break;
        case "tfuel_fixed":
          this.message = `You successfully sent ${generalData.amount} TFuel to ${sendData.length} addresses each!`
          break;
        case "tnt20":
          this.message = `You successfully sent ${generalData.totalAmount} Tokens to ${sendData.length} addresses!`
          break;
        case "tnt20_fixed":
          this.message = `You successfully sent ${generalData.amount} Tokens to ${sendData.length} addresses each!`
          break;
        case "tnt721":
          this.message = `You successfully sent ${sendData.length} NFTs!`
          break;
        case "tnt721_fixed":
          this.message = `You successfully sent ${sendData.length} NFTs to ${generalData.receiverAddress.slice(0,5)} ... ${generalData.receiverAddress.slice(-3)}!`
          break;
      }
    }

  },
  watch: {
    currentStep(step) {
      if (step === 4) {
        this.getData()
      }
    }
  },
  setup(props, { emit }) {
    //  Variables
    const router = useRouter();
    const currentStep = ref(1);

    // Functions

    const nextStep = (e) => {
      currentStep.value++;
      if (currentStep.value == 2) {
        emit("setWallet");
      }
    };

    const previousStep = (e) => {
      currentStep.value --;
    };

    // Returning data
    return {
      metaMask,
      share,
      upload,
      metaMaskGr,
      shareGr,
      uploadGr,
      currentStep,
      router,
      nextStep,
      previousStep
    };
  },
};
</script>

<style lang="scss" scoped>
// send-token styles
.send-token {
  // process styles
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  margin: 10px;
  position: relative;
  .process {
    max-width: 1000px;
    margin: auto;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    min-height: 500px;
    width: 100%;
    // process-ul
    .process-ul {
      display: flex;
      align-items: center;
      list-style: none;
      justify-content: space-evenly;
      padding: 25px;
      list-style: none;
      gap: 10px;
      // process-item
      .process-item {
        text-align: center;
        display: block;
        width: 100%;
        .process-title {
          font-weight: bold;
          padding: 10px 0px;
          font-size: 1.2rem;
          color: rgb(173, 169, 169);
        }
        span {
          font-size: 1rem;
          text-transform: capitalize;
          color: #000;
          display: block;
          text-align: center;
        }
        img {
          width: 20%;
        }
      }
      hr {
        width: 100%;
        background: transparent linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%)
          0% 0% no-repeat padding-box;
        height: 3px;
        border: 0px;
      }
    }
  }
  .success-modal {
    display: grid;
    place-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    .wraper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fff;
      padding: 20px;
      min-width: 250px;
      min-height: 300px;
      max-width: 400px;
      border: 1px solid #000;
      margin: 10px;
      border-radius: 10px;
      .heading,
      .sub-heading {
        text-align: center;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 10px;
      }
      .see-btn {
        background: #30d0a5;
        padding: 10px 20px;
        font-size: 1.2rem;
        font-weight: bold;
        text-transform: capitalize;
        color: #fff;
        border: 0px;
        border-radius: 15px;
        cursor: pointer;
        margin-top: 40px;
      }
    }
  }
}

@media only screen and(max-width:640px) {
  // send-token styles
  .send-token {
    // process styles
    .process {
      padding: 20px 0px;

      // process-ul
      .process-ul {
        display: flex;
        align-items: center;
        list-style: none;
        justify-content: space-evenly;
        padding: 10px;
        list-style: none;
        // process-item
        .process-item {
          img {
            width: 30px;
          }
        }
      }
    }
  }
}

.active {
  color: #000 !important;
}
</style>
