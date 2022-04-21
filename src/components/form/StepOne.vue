<template>
  <div v-if="currentStep === 1 && metamask" class="btn">
    <button @click="connectButtonClicked" class="connect">connect wallet</button>
  </div>
  <!-- Success modal  -->
  <div v-if="!metamask" class="success-modal">
    <!-- Wraper  -->
    <div class="wraper">
      <!-- Heading  -->
      <h1 class="heading">No MetaMask installed!</h1>
      <!-- Sub heading  -->
      <h2 class="sub-heading">
        You have to install MetaMask to use this dApp!!!
      </h2>
      <!-- See more btn -->
      <button @click="router.push('/')" class="see-btn">Go Back</button>
    </div>
    <div>
      <p>This is a prototype, please use with caution! Theta Sender is not reliable for losses!</p>
    </div>
  </div>
</template>

<script>
// Importing thing we need
import { ref, watch } from "vue";
import {ethers} from 'ethers';
import {useRouter} from "vue-router";
import {NETWORK_OPTIONS} from "@/Config";
export default {
  name: "StepOne",
  emits: ["nextStep"],
  props: ["currentStep"],
  data() {
    return {
      metamask: true,
    };
  },
  methods: {
    async connectButtonClicked(){
      try {
        let chainId = await window.ethereum.request({ method: 'eth_chainId' })
        if(chainId !== NETWORK_OPTIONS.chainId) {
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NETWORK_OPTIONS],
          });
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.$store.commit('SetUserAddress', accounts[0]);
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        this.nextStep()
      } catch (e) {
        this.metamask = false
        // alert("No Metamask installed");
      }
    }
  },
  setup(props, { emit }) {
    // Variables
    const currentStep = ref(props.currentStep);
    const router = useRouter();
    // Function
    const nextStep = () => {
      // e.preventDefault();
      emit("nextStep");
    };

    // Watcher
    watch(
      () => props.currentStep,
      () => {
        currentStep.value = props.currentStep;
      }
    );

    // Returning data
    return { currentStep, nextStep, router };
  },
};
</script>

<style lang="scss" scoped>
// Btn styles
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  // connect style
  .connect {
    text-transform: capitalize;
    margin: 50px auto;
    padding: 7px 40px;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    text-decoration: none;
    background: transparent linear-gradient(90deg, #03b3e7 0%, #02e9b5 100%) 0%
      0% no-repeat padding-box;
    color: #fff;
    border: 0px;
    cursor: pointer;
  }
}
.success-modal {
  display: grid;
  place-items: center;
  //position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  .wraper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //background: #fff;
    background: black;
    color: white;
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
</style>
