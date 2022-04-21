<template>
  <form v-if="currentStep === 2" class="form">
    <!-- Form control  -->
    <div class="form-control">
      <!-- label  -->
      <label>Select a token you want to send</label>
      <!-- Select  -->
      <select class="select" v-model="tokenType">
        <!-- Option one -->
        <option value="tfuel">tfuel</option>
        <!-- Option two -->
        <option value="tnt20">tnt20</option>
        <!-- Option three -->
        <option value="tnt721">tnt721</option>
      </select>
    </div>
    <!-- Form control  -->
    <div class="form-control">
      <!-- Form groups  -->
      <div class="form-groups">
        <!-- Group one  -->
        <div class="group-one">
          <!-- label  -->
          <label v-if="tokenType !== 'tnt721'">Fixed amount of tokens per address?</label>
          <label v-if="tokenType === 'tnt721'">Send all NFTs to one address?</label>
          <!-- Select  -->
          <select class="select" v-model="isFixed">
            <!-- option one  -->
            <option value="yes">yes</option>
            <!-- option two  -->
            <option value="no">no</option>
          </select>
        </div>
        <!-- Group two  -->
        <div class="group-two" v-if="isFixed === 'yes'">
          <!-- Label  -->
          <label v-if="tokenType !== 'tnt721'">Enter amount of tokens per address</label>
          <label v-if="tokenType === 'tnt721'">Enter the receiving wallet address</label>
          <!-- Input  -->
          <input v-if="tokenType !== 'tnt721'" type="number" v-model="fixedAmount"/>
          <input v-if="tokenType === 'tnt721'" type="text" v-model="fixedAddress"/>
        </div>
      </div>
    </div>
    <div class="form-control" v-if="(tokenType === 'tnt721' && isFixed === 'no') || tokenType === 'tnt20'">
      <!-- label  -->
      <label>Enter the token address</label>
      <!-- Input  -->
      <input type="text" style="min-width: 100%;padding: 5px 0px;border: 1px solid #222;border-radius: 5px;text-transform: capitalize;text-indent: 10px;" v-model="tokenAddress"/>
    </div>
    <!-- Form control  -->
    <div class="form-control" v-if="tokenType !== 'tnt721' || isFixed === 'no'">
      <!-- Sub heading  -->
      <h3 v-if="tokenType === 'tnt721'" class="sub-heading">Download TNT721 CSV example file<a href="CSV/TNT721.csv"> here</a></h3>
      <h3 v-else-if="isFixed === 'yes'" class="sub-heading">Download TFuel/TNT20 with fixed amount CSV example file<a href="CSV/TFuelFixed.csv"> here</a></h3>
      <h3 v-else class="sub-heading">Download TFuel/TNT20 CSV example file<a href="CSV/TFuel.csv"> here</a></h3>
      <!-- Label  -->
      <label>Upload CSV file here</label>
      <!-- Drag & drop   -->
      <div v-if="!showFileData" id="drop_zone" @drop="dropHandler" @dragenter="checkDrop" @dragover="checkDrop">
        <label class="drag-drop" >
          <input  type="file" id="csvFile" name="csvFile" accept="text/csv" @change="selectHandler">
          <!-- Span  -->
          <span>darg & drop file here</span>
          <p style="color: red" v-if="uploadError">{{uploadError}}</p>
        </label>
      </div>
      <div class="table-border" v-else>
        <!-- Table  -->
        <table class="token-table">
          <thead>
          <tr>
            <th>Recipient wallet address</th>
            <th v-if="tokenType!=='tnt721' && isFixed==='no'">Amount</th>
            <th v-if="tokenType==='tnt721'">Token Id</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(data, n) in fileData" :key="n">
            <td>{{data.address}}</td>
            <td v-if="tokenType!=='tnt721' && isFixed==='no'">{{ data.amount }}</td>
            <td v-if="tokenType==='tnt721'">{{ data.tokenId }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Form control Select own tokens -->
    <div class="form-control" v-else>
      <!-- Label  -->
      <label>Select tokens from your wallet</label>
      <div class="drag-drop" v-if="!myTokens.length">
        <!-- load Button  -->
        <button v-if="!loading" @click.native.prevent="loadMyTokens()" class="next-btn">Load My NFTs</button>
        <pulse-loader v-else :loading="loading"></pulse-loader>
      </div>
      <!-- Table border   -->
      <div class="table-border" v-else>
        <!-- Table  -->
        <table class="token-table">
          <thead>
            <tr>
              <th @click="sortTable('project')">Project</th>
              <th @click="sortTable('name')">Token Name</th>
              <th @click="sortTable('id')">Id</th>
              <th @click="sortTable('send')">Send</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(token, n) in myTokens" :key="n">
              <td>{{token.project}}</td>
              <td>{{ token.name }}</td>
              <td>{{ token.tokenId }}</td>
              <td><input type="checkbox" v-model="token.checked"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Form control  -->
    <div class="form-control">
      <!-- NExt btn  -->
      <button @click.native.prevent="nextButtonClicked()" class="next-btn">next</button>
    </div>
  </form>
</template>

<script>
// Importing thing we need
import {ref, watch} from "vue";
import axios from "axios";
import API_URL, {ABI_TNT721} from "../../Config";
import {ethers} from "ethers";
// import csvTFuel from "../../assets/CSV/TFuel.csv"
import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min.js'


export default {
  name: "StepTwo",
  emits: ["nextStep"],
  props: ["currentStep"],
  data() {
    return {
      tokenType: 'tfuel',
      isFixed: 'no',
      fixedAmount: null,
      fixedAddress: '',
      tokenAddress: '',
      myTokens: [],
      showFileData: false,
      fileData: [],
      uploadError: null,)
      loading: false
    };
  },
  components: {
    PulseLoader,
  },
  setup(props, {emit}) {
    // Variables
    const currentStep = ref(props.currentStep);

    // Function
    const nextStep = (e) => {
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
    return {currentStep, nextStep};
  },
  methods: {
    csvJSON(csv){
      let lines=csv.split(/\r?\n/);
      let result = [];
      let headers=lines[0].split(",");

      for(let i=1;i<lines.length;i++){

        let obj = {};
        let currentline=lines[i].split(",");

        for(let j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }

        result.push(obj);
      }
      //return result; //JavaScript object
      return result; //JSON
    },
    displayError(row, type){
      console.log("error "+type+":",row)
      this.uploadError = "ERROR "+type+", Row: " + row
    },
    checkJson(json) {
      if(this.tokenType === "tfuel" || this.tokenType === "tnt20"){
        if(this.isFixed === "no") {
          for(let i=0; i<json.length; i++){
            try{
              ethers.utils.getAddress(json[i].address)
            } catch {
              this.displayError(i+1, "address")
              return
            }
            try{
              json[i].amount = parseFloat(json[i].amount)
              if(!json[i].amount) {
                this.displayError(i+1, "amount")
                return
              }
            } catch {
              this.displayError(i+1, "amount")
              return
            }
          }
          this.fileData = json
          this.showFileData = true
        } else {
          for(let i=0; i<json.length; i++) {
            try {
              ethers.utils.getAddress(json[i].address)
            } catch {
              this.displayError(i+1, "address")
              return;
            }
          }
          this.fileData = json
          this.showFileData = true
        }
      } else if(this.tokenType === "tnt721"){
        if(this.isFixed === "no") {
          for(let i=0; i<json.length; i++){
            try{
              ethers.utils.getAddress(json[i].address)
            } catch {
              this.displayError(i+1, "address")
              return
            }
            try{
              json[i].tokenId = parseInt(json[i].tokenId)
              if(!json[i].tokenId) {
                this.displayError(i+1, "tokenId")
                return
              }
            } catch {
              this.displayError(i+1, "tokenId")
              return
            }
          }
          this.fileData = json
          this.showFileData = true
        }
      } else {
        console.log("error checking JSON")
      }
    },
    checkDrop(e) {
      e.preventDefault()
    },
    selectHandler(){
      let name = document.getElementById('csvFile');
      let reader = new FileReader();

      reader.onload = function (event) {
        let json = this.csvJSON(event.target.result)
        this.checkJson(json)
      }.bind(this);
      reader.readAsText(name.files.item(0));
    },
    dropHandler(event) {
      event.stopPropagation();
      event.preventDefault()
      if(event.dataTransfer.files[0].type === "text/csv"){
        let file = event.dataTransfer.files[0]
        let reader = new FileReader();

        reader.onload = function (event) {
          let json = this.csvJSON(event.target.result)
          this.checkJson(json)
        }.bind(this);
        reader.readAsText(file);
      }

    },
    sortTable(type) {
      if(type === "project"){
        this.myTokens = this.myTokens.sort(function(a,b) {
          if ( a.project < b.project ){
            return -1;
          }
          if ( a.project > b.project ){
            return 1;
          }
          return 0;
        })
      }
      if(type === "name"){
        this.myTokens = this.myTokens.sort(function(a,b) {
          if ( a.name < b.name ){
            return -1;
          }
          if ( a.name > b.name ){
            return 1;
          }
          return 0;
        })
      }
      if(type === "id") {
        this.myTokens = this.myTokens.sort(function (a, b) {
          return a.tokenId - b.tokenId
        })
      }
      if(type === "send"){
          this.myTokens = this.myTokens.sort(function(a,b) {
            if ( a.checked && !b.checked ){
              return -1;
            }
            if ( !a.checked && b.checked ){
              return 1;
            }
            return 0
          })
      }
    },
    errorFinalCheck(type, error){
      console.log(type, error)
    },
    async nextButtonClicked() {
      let type = {}
      type["type"] = this.tokenType
      if(this.isFixed === "yes"){
        type["type"] = type["type"] + "_fixed"
      }
      switch (type["type"]) {
        case "tfuel":
          type["totalAmount"] = 0
          for(let i=0; i<this.fileData.length; i++){
            type["totalAmount"] = type["totalAmount"] + this.fileData[i].amount
          }
          break
        case "tfuel_fixed":
          try {
            let amount = parseFloat(this.fixedAmount)
            if(amount){
              type["amount"] = amount
              type["totalAmount"] = amount * this.fileData.length
            } else {
              return
            }
          } catch {
            this.errorFinalCheck(type, "amount")
            return
          }
          break
        case "tnt20":
          try {
            type["tokenAddress"] = ethers.utils.getAddress(this.tokenAddress)
            type["totalAmount"] = 0
            for(let i=0; i<this.fileData.length; i++){
              type["totalAmount"] = type["totalAmount"] + this.fileData[i].amount
            }
          } catch {
            this.errorFinalCheck(type, "tokenAddress")
            return
          }
          break
        case "tnt20_fixed":
          try {
            type["tokenAddress"] = ethers.utils.getAddress(this.tokenAddress)
            let amount = parseFloat(this.fixedAmount)
            if(amount){
              type["amount"] = amount
              type["totalAmount"] = amount * this.fileData.length
            } else {
              return
            }
          } catch {
            this.errorFinalCheck(type, "amount")
            return
          }
          break
        case "tnt721":
          try {
            type["tokenAddress"] = ethers.utils.getAddress(this.tokenAddress)
          } catch {
            this.errorFinalCheck(type, "tokenAddress")
            return
          }
          break
        case "tnt721_fixed":
          try {
            type["receiverAddress"] = ethers.utils.getAddress(this.fixedAddress)
            let data = []
            for(let i=0; i<this.myTokens.length; i++){
              if(this.myTokens[i].checked){
                data.push({"address": this.myTokens[i].tokenAddress, "tokenId": this.myTokens[i].tokenId})
              }
            }
            this.fileData = data
          } catch {
            this.errorFinalCheck(type, "receiverAddress")
            return
          }
          break
      }
      if(!this.fileData.length) {
        this.errorFinalCheck(type, "noToken")
        return
      }
      this.$store.commit('SetSendData', this.fileData);
      this.$store.commit('SetSendType', type);
      this.nextStep()
    },
    async loadMyTokens() {
      this.loading = true
      let userAddress = this.$store.state.UserAddress;
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let response = await axios.get(`${API_URL}projects`)
      let allProjects = response.data
      // let allProjects = [
      //   {
      //     "contract": "0x34b4e50600cd2ee72fa01ba9a68cd49282858eaf",
      //     "name": "Test",
      //   }
      // ]
      let promisesNFTProjects = []

      for (let j = 0; j < allProjects.length; j++) {
        promisesNFTProjects.push(this.getNFTs(allProjects[j], userAddress, provider))
      }
      await Promise.all(promisesNFTProjects)

      this.loading = false
    },

    async getNFTs(project, userAddress, provider) {
      let projectAddress = project.contract
      const contractObject = new ethers.Contract(
          projectAddress,
          ABI_TNT721,
          provider
      );
      // console.log(this.provider);
      let balance = await contractObject.balanceOf(userAddress).catch((error) => {
        console.log(error);
      });
      // console.log(balance);
      balance = balance.toNumber()
      if (balance > 0) {
        for (let i = 0; i < balance; i++) {
          let tokenID = await contractObject.tokenOfOwnerByIndex(userAddress, i).catch((error) => {
            console.log(error);
          });
          // console.log(tokenID);
          let nftURI = await contractObject.tokenURI(tokenID).catch((error) => {
            console.log(error);
          });
          if (nftURI.slice(0, 4) === 'ipfs') {
            nftURI = 'https://ipfs.io/ipfs/' + nftURI.substring(7)
          }
          let nft = await axios.get(nftURI);
          this.myTokens.push({project: project.name, name: nft.data.name, tokenId: tokenID, checked: false, tokenAddress: projectAddress})
        }
      }
    }
  },
  watch: {
    isFixed(){
      this.fileData = []
      this.showFileData = false
      this.uploadError = null
    },
    tokenType(){
      this.fileData = []
      this.showFileData = false
      this.uploadError = null
    }
  }
};
</script>

<style lang="scss" scoped>
.ZoneSpinner {
  text-align: center;
}

.ZoneSpinner .spinner-border {
  width: 5rem;
  height: 5rem;
  color: #18E5E7;
}
.form {
  max-width: 640px;
  margin: auto;
  padding: 0px 10px;
  min-height: 400px;
  // form-control styles
  .form-control {
    min-width: 100%;
    // label styles
    label {
      display: block;
      font-size: 0.8rem;
      font-weight: bold;
      padding: 5px 10px;
    }

    // select styles
    .select {
      min-width: 100%;
      padding: 6px 10px;
      border: 1px solid #222;
      border-radius: 5px;
      text-transform: uppercase;
      font-weight: bold;
      cursor: pointer;
    }

    // form-groups styles
    .form-groups {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 100%;
      gap: 20px;
      // group-one style
      .group-one {
        min-width: 50%;
      }

      // group-two style
      .group-two {
        min-width: 50%;
        // input styles
        input {
          min-width: 93%;
          padding: 5px 0px;
          border: 1px solid #222;
          border-radius: 5px;
          text-transform: capitalize;
          text-indent: 10px;
        }
      }
    }

    // sub-heading styles
    .sub-heading {
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      padding: 10px;

      a {
        color: #000;
        font-weight: bold;
      }
    }

    // drag-drop styles
    .drag-drop {
      display: grid;
      place-items: center;
      padding: 20px;
      border: 1px solid #222;
      border-radius: 5px;
      min-height: 200px;
      // span styles
      width: 100%;
      span {
        text-transform: capitalize;
        font-size: 1.2rem;
        font-weight: bold;
      }
      input {
        display: none;
      }
    }

    // next-btn styles
    .next-btn {
      background: #30d0a5;
      padding: 5px 40px;
      font-size: 1.2rem;
      font-weight: bold;
      text-transform: capitalize;
      color: #fff;
      margin: 30px 0px;
      border: 0px;
      border-radius: 10px;
      cursor: pointer;
    }

    // table style
    .table-border {
      display: grid;
      overflow-y: auto;
      //place-items: top;
      padding: 0;
      border: 1px solid #222;
      border-radius: 5px;
      height: 200px;
    }

    .token-table {
      border-collapse: collapse;
      margin: 0;
      font-size: 0.9em;
      width: 100%;

      thead tr {
        background-color: #222;
        color: #ffffff;
        text-align: left;
        font-weight: bold;
      }

      th, td {
        padding: 8px 10px;
      }

      tbody {
        overflow-y: scroll;
        max-height: 200px;
      }

      tbody tr {
        border-bottom: 1px solid #dddddd;
      }
      tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
      }
    }
  }
}

@media only screen and(max-width: 500px) {
  // send-token styles
  .send-token {
    // process styles
    .process {
      .form {
        // form-control styles
        .form-control {
          // form-groups styles
          .form-groups {
            flex-direction: column;
            // group-one style
            .group-one {
              min-width: 100%;
            }

            // group-two style
            .group-two {
              min-width: 100%;
              // input styles
              input {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
