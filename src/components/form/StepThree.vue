<template>
  <div v-if="currentStep === 3" class="send">
    <!-- Info  -->
    <h3 class="info" v-if="errorMessage" style="color: red">{{errorMessage}}</h3>
    <h3 class="info" v-else>Almost there! Here’s your transaction overview:</h3>
    <!-- List  -->
    <ul class="list">
      <!-- Items  -->
      <li class="item" v-if="type.slice(0,5)==='tnt20' || type.slice(0,6)==='tnt721'"><span>{{tokenAddress}}</span></li>
      <li class="item" v-if="type.slice(0,6)==='tnt721'">Total NFTs: <span>{{totalAmount}}</span></li>
      <li class="item" v-if="type.slice(0,5)==='tfuel' || type.slice(0,5)==='tnt20'">Total addresses: <span>{{totalAddresses}}</span></li>
      <li class="item" v-if="type.slice(0,5)==='tfuel' || type.slice(0,5)==='tnt20'">Total amount of token to send: <span>{{totalAmount}}</span></li>
      <li class="item">Transactions needed: <span>{{transactionsNeeded}}</span></li>
      <li class="item" v-if="type.slice(0,5)==='tfuel' || type.slice(0,6)==='tnt721'">Platform fee: <span>{{fee}} TFUEL</span></li>
      <li class="item" v-if="type.slice(0,5)==='tnt20'">Platform fee: <span>{{fee}} Tokens</span></li>
    </ul>
    <!-- Btn  -->
    <div class="btn">
      <!-- Next btn  -->
      <pulse-loader v-if="loading" :loading="loading"></pulse-loader>
      <button v-else-if="!dataChecked && !errorMessage" @click.native="checkData" class="send-btn">Check Data</button>
      <button v-else-if="errorMessage" @click="previousStep" class="send-btn">Cancel</button>
      <button v-else-if="!isApproved && type.slice(0,5) !== 'tfuel'" @click="approveTokens" class="send-btn">Approve</button>
      <button v-else @click="sendTokens" class="send-btn">Send Now</button>
    </div>
  </div>
</template>

<script>
// Importing thing we need
import { ref, watch } from "vue";
import {ethers} from "ethers";
import {ABI_TNT721, ABI_SENDER, SENDER_ADDRESS, ABI_TNT20} from "@/Config";
import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min.js'

export default {
  name: "StepThree",
  emits: ["nextStep", "previousStep"],
  props: ["currentStep"],
  components: {
    PulseLoader,
  },
  data() {
    return {
      type: '',
      totalAddresses: 0,
      totalAmount: 0,
      receiverAddress: '',
      tokenAddress: '',
      fee: 0,
      transactionsNeeded: 0,
      numberOfContracts: 0,
      dataChecked: false,
      errorMessage: null,
      isApproved: false,
      loading: false
    };
  },
  methods: {
    sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    toBigNumber(number) {
      return ethers.BigNumber.from(Math.ceil(number*10000)).mul(
          ethers.BigNumber.from("100000000000000"))
    },
    async sendTokens() {
      this.loading = true
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractMultiSend = new ethers.Contract(
          SENDER_ADDRESS,
          ABI_SENDER,
          signer
      );
      let addresses = []
      let amounts = []
      let tokenIds = []
      let overrides
      let sendData = this.$store.state.SendData
      let generalData = this.$store.state.SendType
      let counter = 0
      let transactionAmount = 0
      let transactionFee = 0
      let topic
      switch (this.type) {
        case "tfuel":
          for(let i=0;i<sendData.length; i++) {
            addresses.push(sendData[i].address);
            amounts.push(this.toBigNumber(sendData[i].amount));
            transactionAmount += sendData[i].amount
            counter ++
            if(counter >= 250){
              transactionFee = (await contractMultiSend.senderTFuelSendFee(this.toBigNumber(transactionAmount))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
              overrides = {
                value: this.toBigNumber(transactionAmount + transactionFee),
              };
              contractMultiSend.bulkSendTFuel(addresses,amounts,overrides)
              addresses = [];
              amounts = []
              counter = 0
              transactionAmount = 0
              transactionFee = 0
            }
          }
          transactionFee = (await contractMultiSend.senderTFuelSendFee(this.toBigNumber(transactionAmount))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          overrides = {
            value: this.toBigNumber(transactionAmount + transactionFee),
          };
          contractMultiSend.bulkSendTFuel(addresses,amounts,overrides)
          topic = ethers.utils.id("BulkSendTFuel(uint256,uint256,bool,uint256)");
          break
        case "tfuel_fixed":
          for(let i=0;i<sendData.length; i++) {
            addresses.push(sendData[i].address);
            transactionAmount += generalData.amount
            counter ++
            if(counter >= 250){
              transactionFee = (await contractMultiSend.senderTFuelSendFee(this.toBigNumber(transactionAmount))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
              overrides = {
                value: this.toBigNumber(transactionAmount + transactionFee),
              };
              await contractMultiSend.bulkSendTFuelFixed(addresses, this.toBigNumber(generalData.amount),overrides)
              addresses = [];
              amounts = []
              counter = 0
              transactionAmount = 0
              transactionFee = 0
            }
          }
          transactionFee = (await contractMultiSend.senderTFuelSendFee(this.toBigNumber(transactionAmount))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          overrides = {
            value: this.toBigNumber(transactionAmount + transactionFee),
          };
          await contractMultiSend.bulkSendTFuelFixed(addresses, this.toBigNumber(generalData.amount),overrides)
          topic = ethers.utils.id("BulkSendTFuel(uint256,uint256,bool,uint256)");
          break
        case "tnt20":
          for(let i=0;i<sendData.length; i++) {
            addresses.push(sendData[i].address);
            amounts.push(this.toBigNumber(sendData[i].amount));
            counter ++
            if(counter >= 250){
              await contractMultiSend.bulkSendTNT20(generalData.tokenAddress,addresses,amounts)
              addresses = [];
              amounts = []
              counter = 0
            }
          }
          await contractMultiSend.bulkSendTNT20(generalData.tokenAddress,addresses,amounts)
          topic = ethers.utils.id("BulkSendTNT20(address,uint256,uint256,bool,uint256)");
          break
        case "tnt20_fixed":
          for(let i=0;i<sendData.length; i++) {
            addresses.push(sendData[i].address);
            counter ++
            if(counter >= 250){
              await contractMultiSend.bulkSendTNT20Fixed(generalData.tokenAddress,addresses,this.toBigNumber(generalData.amount))
              addresses = [];
              counter = 0
            }
          }
          await contractMultiSend.bulkSendTNT20Fixed(generalData.tokenAddress,addresses,this.toBigNumber(generalData.amount))
          topic = ethers.utils.id("BulkSendTNT20(address,uint256,uint256,bool,uint256)");
          break
        case "tnt721":
          for(let i=0;i<sendData.length; i++) {
            addresses.push(sendData[i].address);
            tokenIds.push(sendData[i].tokenId);
            counter ++
            if(counter >= 90){
              transactionFee = (await contractMultiSend.senderTNT721SendFee(tokenIds.length)).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
              overrides = {
                value: this.toBigNumber(transactionFee),
              };
              await contractMultiSend.bulkSendTNT721Fixed(generalData.tokenAddress,addresses,tokenIds,overrides)
              addresses = [];
              tokenIds = []
              counter = 0
            }
          }
          transactionFee = (await contractMultiSend.senderTNT721SendFee(tokenIds.length)).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          overrides = {
            value: this.toBigNumber(transactionFee),
          };
          await contractMultiSend.bulkSendTNT721Fixed(generalData.tokenAddress,addresses,tokenIds,overrides)
          topic = ethers.utils.id("BulkSendTNT721Fixed(address,uint256,uint256)");
          break
        case "tnt721_fixed":
          let tokenAddresses = []
          for(let i=0;i<sendData.length; i++) {
            tokenAddresses.push(sendData[i].address);
            tokenIds.push(sendData[i].tokenId);
            addresses.push(generalData.receiverAddress)
            counter ++
            if(counter >= 90){
              transactionFee = (await contractMultiSend.senderTNT721SendFee(tokenIds.length)).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
              overrides = {
                value: this.toBigNumber(transactionFee),
              };
              await contractMultiSend.bulkSendTNT721(tokenAddresses,addresses,tokenIds,overrides)
              addresses = [];
              tokenIds = []
              tokenAddresses = []
              counter = 0
            }
          }
          transactionFee = (await contractMultiSend.senderTNT721SendFee(tokenIds.length)).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          overrides = {
            value: this.toBigNumber(transactionFee),
          };
          await contractMultiSend.bulkSendTNT721(tokenAddresses,addresses,tokenIds,overrides)
          topic = ethers.utils.id("BulkSendTNT721(uint256,uint256,uint256)");
          break
      }
      let filter = {
        address: SENDER_ADDRESS,
        topics: [ topic ]
      }

      provider.on(filter, () => {
        this.loading = false
        this.nextStep()
      });
    },
    async approveTokens() {
      this.loading = true
      let generalData = this.$store.state.SendType
      let sendData = this.$store.state.SendData
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let doSleep = false
      const signer = provider.getSigner();
      if(this.type.slice(0,5) === 'tnt20'){
        const contractTNT20 = new ethers.Contract(
            generalData.tokenAddress,
            ABI_TNT20,
            signer
        );
        let allowance = (await contractTNT20.allowance(this.$store.state.UserAddress, SENDER_ADDRESS)).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000
        if(allowance >= (this.totalAmount+this.fee)){
          this.isApproved = true
        } else {
          doSleep = await contractTNT20.approve(SENDER_ADDRESS, this.toBigNumber((this.totalAmount+this.fee)))
          if(doSleep) await this.sleep(6000)
          this.isApproved = doSleep
        }
      }
      if(this.type === 'tnt721'){
        const contractTNT721 = new ethers.Contract(
            generalData.tokenAddress,
            ABI_TNT721,
            signer
        );
        if(!(await contractTNT721.isApprovedForAll(this.$store.state.UserAddress, SENDER_ADDRESS))) {
          this.isApproved = await contractTNT721.setApprovalForAll(SENDER_ADDRESS, true)
          await this.sleep(6000)
        } else {
          this.isApproved = true
        }
      }
      if(this.type === 'tnt721_fixed'){
        let uniqueAddresses = [...new Set(sendData.map(item => item.address))]

        for(let i=0; i<uniqueAddresses.length; i++) {
          const contractTNT721 = new ethers.Contract(
              uniqueAddresses[i],
              ABI_TNT721,
              signer
          );
          if(!(await contractTNT721.isApprovedForAll(this.$store.state.UserAddress, SENDER_ADDRESS))) {
            if(!(await contractTNT721.setApprovalForAll(SENDER_ADDRESS, true))) {
              console.log("error");
              return;
            } else {
              doSleep = true
            }
          }
        }
        if(doSleep) await this.sleep(6000)
        this.isApproved = true
      }
      this.loading = false
    },
    async checkData() {
      this.loading = true
      let sendData = this.$store.state.SendData
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let generalData = this.$store.state.SendType
      switch (this.type.slice(0,5)) {
        case "tfuel":
          let balance = ethers.utils.formatEther(await provider.getBalance(this.$store.state.UserAddress))
          if(balance > this.totalAmount + this.fee) {
            this.dataChecked = true
          } else {
            this.errorMessage = "Not enough Tokens"
          }
          break
        case "tnt20":
          const contractTNT20 = new ethers.Contract(
              generalData.tokenAddress,
              ABI_TNT20,
              provider
          );
          try {
            let balance = ethers.utils.formatEther(await contractTNT20.balanceOf(this.$store.state.UserAddress))
            if(balance > this.totalAmount + this.fee) {
              this.dataChecked = true
            } else {
              this.errorMessage = "Not enough Tokens"
            }
          } catch {
            this.errorMessage = "Error getting token balance"
            return
          }
          break
        case "tnt72":
          if(this.type === "tnt721") {
            for(let i=0; i<sendData.length;i++){
              const contractTNT721 = new ethers.Contract(
                  generalData.tokenAddress,
                  ABI_TNT721,
                  provider
              );
              try{
                let owner = await contractTNT721.ownerOf(sendData[i].tokenId)
                if(owner.toLowerCase() !== this.$store.state.UserAddress.toLowerCase()){
                  this.errorMessage = "You are not owning all NFTs"
                  this.dataChecked = false
                  return
                }
              } catch {
                this.errorMessage = "Error getting token owner"
                this.dataChecked = false
                return

              }
            }
          } else {
            for(let i=0; i<sendData.length;i++){
              const contractTNT721 = new ethers.Contract(
                  sendData[i].address,
                  ABI_TNT721,
                  provider
              );
              try{
                let owner = await contractTNT721.ownerOf(sendData[i].tokenId)
                if(owner.toLowerCase() !== this.$store.state.UserAddress.toLowerCase()){
                  this.errorMessage = "You are not owning all NFTs"
                  this.dataChecked = false
                  return
                }
              } catch {
                this.errorMessage = "Error getting token owner"
                this.dataChecked = false
                return

              }
            }
          }

          this.dataChecked = true
          break
      }
      this.loading = false
    },
    async getData() {
      this.loading = true
      this.errorMessage = null
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(SENDER_ADDRESS)
      const contractMultiSend = new ethers.Contract(
          SENDER_ADDRESS,
          ABI_SENDER,
          provider
      );
      let generalData = this.$store.state.SendType
      let sendData = this.$store.state.SendData
      this.type = generalData.type
      let amount = 0
      switch (this.type) {
        case "tfuel":
          amount = 0
          for(let i=0; i<sendData.length; i++){
            amount += sendData[i].amount
          }
          this.totalAmount = amount
          this.totalAddresses = sendData.length;
          this.transactionsNeeded = Math.ceil(this.totalAddresses / 250)
          this.fee = (await contractMultiSend.senderTFuelSendFee(ethers.BigNumber.from(Math.ceil(this.totalAmount * 10000)).mul(
              ethers.BigNumber.from("100000000000000")))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          break
        case "tfuel_fixed":
          this.totalAmount = generalData.totalAmount;
          this.totalAddresses = sendData.length;
          this.transactionsNeeded = Math.ceil(this.totalAddresses / 250)
          this.fee = (await contractMultiSend.senderTFuelSendFee(ethers.BigNumber.from(Math.ceil(this.totalAmount * 10000)).mul(
              ethers.BigNumber.from("100000000000000")))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          break
        case "tnt20":
          amount = 0
          for(let i=0; i<sendData.length; i++){
            amount += sendData[i].amount
          }
          this.totalAmount = amount
          this.tokenAddress = generalData.tokenAddress
          this.totalAddresses = sendData.length;
          this.transactionsNeeded = Math.ceil(this.totalAddresses / 250)
          this.fee = (await contractMultiSend.senderTNT20SendFee(ethers.BigNumber.from(Math.ceil(this.totalAmount * 10000)).mul(
              ethers.BigNumber.from("100000000000000")))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          break
        case "tnt20_fixed":
          this.totalAmount = generalData.totalAmount;
          this.totalAddresses = sendData.length;
          this.tokenAddress = generalData.tokenAddress
          this.transactionsNeeded = Math.ceil(this.totalAddresses / 250)
          this.fee = (await contractMultiSend.senderTNT20SendFee(ethers.BigNumber.from(Math.ceil(this.totalAmount * 10000)).mul(
              ethers.BigNumber.from("100000000000000")))).div(ethers.BigNumber.from("100000000000000")).toNumber() / 10000;
          break
        case "tnt721":
          this.tokenAddress = generalData.tokenAddress;
          this.totalAmount = sendData.length;
          this.fee = (await contractMultiSend.senderTNT721SendFee(this.totalAmount)).div(ethers.BigNumber.from("1000000000000000000")).toNumber();
          this.transactionsNeeded = Math.ceil(this.totalAmount / 90) + 1
          break
        case "tnt721_fixed":
          console.log(sendData)
          this.tokenAddress = generalData.receiverAddress;
          this.totalAmount = sendData.length;
          this.fee = (await contractMultiSend.senderTNT721SendFee(this.totalAmount)).div(ethers.BigNumber.from("1000000000000000000")).toNumber();
          this.numberOfContracts = [...new Set(sendData.map(item => item.address))].length;
          this.transactionsNeeded = Math.ceil(this.totalAmount / 90) + this.numberOfContracts
          break
      }
      this.loading = false
    }
  },
  watch: {
    currentStep(step) {
      if(step === 3) {
        this.getData()
      }
    }
  },
  setup(props, { emit }) {
    // Variables
    const currentStep = ref(props.currentStep);

    // Function
    const nextStep = (e) => {
      emit("nextStep");
    };

    const previousStep = (e) => {
      e.preventDefault();
      emit("previousStep");
    };

    // Watcher
    watch(
      () => props.currentStep,
      () => {
        currentStep.value = props.currentStep;
      }
    );

    // Returning data
    return { currentStep, nextStep, previousStep };
  },
};
</script>

<style lang="scss" scoped>
// send styles
.send {
  margin-top: 50px;
  min-height: 350px;
  // info styles
  .info {
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
    padding: 10px;
  }
  // ul styles
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    list-style: none;
    gap: 20px;
    margin-top: 30px;
    // li styles
    li {
      text-align: center;
      font-size: 1.2rem;
      // span styles
      span {
        font-weight: bold;
        padding: 0px 5px;
      }
    }
  }
  // Btn styles
  .btn {
    min-height: 0vh;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    // send-btn styles
    .send-btn {
      background: #30d0a5;
      padding: 10px 20px;
      font-size: 1.2rem;
      font-weight: bold;
      text-transform: capitalize;
      color: #fff;
      border: 0px;
      border-radius: 15px;
      cursor: pointer;
    }
  }
}
</style>
