import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from  './router';
import { createPinia } from 'pinia' 

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')


/*
//import {createRouter, createWebHistory} from 'vue-router';


//Definir las rutas
const routes = [{
    path: '/',
    component: Home
}];

//Crear una instacia del router y pasarle las rutas
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Hooks para ejecutar antes de ir hacia cada ruta.
// router.beforeEach((to,from,next)=>{

// })

const app = createApp({});
app.use(router);
App.mount('#app');*/
