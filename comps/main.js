import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import './vuwi.css';
import maska from 'maska';
const app = createApp(App);
app.use(maska);
app.mount('#app');
