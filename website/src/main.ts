import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { initialTheme } from './theme'
import './styles/main.css'
// App só usa offcanvas + collapse (sem dropdown/tooltip/popover → sem Popper),
// então importamos o pacote em vez do bundle: mesma instância de módulo que
// Offcanvas.getInstance() nos componentes (senão o hide() vira no-op).
import 'bootstrap'

// aplica o tema (salvo ou padrão) antes do mount (sem flash)
document.documentElement.setAttribute('data-theme', initialTheme())

createApp(App).use(router).mount('#app')
