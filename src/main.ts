import { createApp } from 'vue-demi'
import App from './playground/App.vue'
import 'virtual:windi.css'
import './index.css'
import maska from 'maska'

const app = createApp(App)
app.use(maska)
app.mount('#app')
