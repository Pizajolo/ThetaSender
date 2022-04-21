import { createApp } from 'vue/dist/vue.esm-bundler.js';
import App from './App.vue'
import router from './router'
import {store} from './store/store'


// createApp(App).use(router).mount('#app')
const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')