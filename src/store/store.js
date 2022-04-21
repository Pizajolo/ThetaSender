// import Vue from 'vue'
import { createStore } from 'vuex'

// Vue.use(Vuex)

export const store = createStore({
    state: {
        UserAddress: "",
        Provider: null,
        SendType:null,
        SendData: [],
    },
    mutations: {
        SetUserAddress(state, address){
            state.UserAddress = address;
        },
        SetProvider(state, provider){
            state.Provider = provider;
        },
        SetSendType(state, type){
            state.SendType = type;
        },
        SetSendData(state, data){
            state.SendData = data;
        }
    },
    actions: {
    },
    modules: {
    }
})