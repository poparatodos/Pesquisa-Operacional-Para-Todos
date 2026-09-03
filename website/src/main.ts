import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { THEME } from './theme'
import './styles/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// aplica o tema antes do mount (sem flash)
document.documentElement.setAttribute('data-theme', THEME)

createApp(App).use(router).mount('#app')
