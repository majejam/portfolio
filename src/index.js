import './css/style.styl'

import './css/reset.styl'

import * as THREE from 'three'

import * as POST from "postprocessing" 

/**
 * Dom content
 */
let show = false
const link = document.querySelector('.container-projects')
const intro = document.querySelector('.introduction')
const myProjectBtn = document.querySelector('.projects')
const container = document.querySelector('.container-home')
const project_container = document.querySelector('.projects-container')
const projects = document.querySelectorAll('.project')
const scroll__bar = document.querySelector('.scroll__bar')
const close_button = document.querySelector('.close_button')
myProjectBtn.addEventListener('click', () => {
    if(show)
        show = false 
    else 
        show = true
    
    if(show == true){
        link.style.display = 'flex'
        myProjectBtn.innerHTML = 'Home'
        intro.classList.remove('show')
        link.classList.remove('hide')
        intro.classList.add('hide')
        link.classList.add('show')
    }
    else{
        intro.classList.remove('hide')
        link.classList.remove('show')
        link.classList.add('hide')
        intro.classList.add('show')
        myProjectBtn.innerHTML = 'My projects'
        setTimeout(() => {link.style.display = 'none'}, 10);
    }
})

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

/**
 * Resize
 */
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update
    renderer.setSize(sizes.width, sizes.height)
})
/**
 * Light 
 */
const ambientLight = new THREE.DirectionalLight(0xffffff, 10)
ambientLight.position.x = 0
ambientLight.position.y = 0
ambientLight.position.z = 1
scene.add(ambientLight)
let position_container = 0

let scrollspeed = 0
window.addEventListener( 'wheel', onMouseWheel, false );
window.addEventListener( 'scroll', onMouseWheel, false );
function onMouseWheel( event ) {
    //event.preventDefault();
    //posc += event.deltaY * 0.003;
    console.log(event.deltaY);
    scrollspeed = event.deltaY 
    position_container = position_container - scrollspeed
    if(position_container < 0 ){

    }
    else{
        position_container = 0
        scrollspeed = 0
    }
    if(position_container > (-project_container.offsetHeight + sizes.height)){

    }
    else{
        position_container = (-project_container.offsetHeight + sizes.height)
        scrollspeed = 0
    }
    for (let index = 0; index < projects.length; index++) {
        projects[index].style.transform = `matrix(1, ${scrollspeed/1000}, 0, ${1 - Math.abs(scrollspeed/1000)}, 0, 0)`
    }
    scroll__bar.style.transform = `translateY(${-position_container * 1.35}px)`
    project_container.style.transform = `translateY(${position_container}px)`
    
}


/**
 * Object
 */
function newObj(bool){
    let globe = {}
    globe.geometry = new THREE.DodecahedronBufferGeometry(50, 1)
    globe.material = new THREE.MeshStandardMaterial({
        color: parseInt("0x"+((1<<24)*Math.random()|0).toString(16)), 
        flatShading: true,
        metalness: 0.5,
        roughness: 0,
        //wireframe: true
    })
    globe.materialS = new THREE.MeshStandardMaterial({
        color: parseInt("0x"+((1<<24)*Math.random()|0).toString(16)), 
        flatShading: true,
        metalness: 1,
        roughness: 0,
        //wireframe: true
    })
    if(bool)
        globe.mesh = new THREE.Mesh(globe.geometry, globe.material)
    else
        globe.mesh = new THREE.Mesh(globe.geometry, globe.materialS)
    globe.mesh.position.x = (100 + Math.random() * 2000) * (Math.random() < 0.5 ? -1 : 1)
    globe.mesh.position.y = (100 + Math.random() * 2000) * (Math.random() < 0.5 ? -1 : 1)
    globe.mesh.position.z = (Math.random() * 10000) * -1
    return globe.mesh
}
let objects = new Array()
let nb_obj = 100
for (let i = 0; i < nb_obj; i++) {
    objects.push(newObj(true))
}
for (let i = 0; i < nb_obj; i++) {
    objects.push(newObj(true))
}
for (let j = 0; j < objects.length; j++) {
    scene.add(objects[j])
}
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(175, sizes.width / sizes.height)
camera.position.z = 10
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)


/**
 * Clock
 */
const clock = new THREE.Clock()


/**
 * Post processing
 */
const composer = new POST.EffectComposer(renderer);

const effectPassGlitch = new POST.EffectPass(camera, new POST.GlitchEffect());
effectPassGlitch.renderToScreen = true;

const effectPassPixel = new POST.EffectPass(camera, new POST.PixelationEffect());
effectPassPixel.renderToScreen = true;

//delay between each, if 0 & 0 then => infinite (seconde)
//effectPassGlitch.effects[0].delay.x = 0 
//effectPassGlitch.effects[0].delay.y = 0
//strength of glitch (between 0 and 10 is good)


console.log(effectPassGlitch)
effectPassGlitch.minTime = 0
effectPassGlitch.maxTime = 0
effectPassGlitch.enabled = true;
composer.addPass(new POST.RenderPass(scene, camera));
composer.addPass(effectPassGlitch);
effectPassGlitch.effects[0].delay.y = effectPassGlitch.effects[0].delay.x
//composer.addPass(effectPassPixel);
let mouse_hold = false
document.addEventListener('mousedown', ()=>{
    mouse_hold = true
})
document.addEventListener('mouseup', ()=>{
    mouse_hold = false
})

/**
 * Loop
 */
let increment = 0
let speed = 5
const loop = () =>
{
    window.requestAnimationFrame(loop)
    composer.render(clock.getDelta())
    for (let j = 0; j < objects.length; j++) {
        objects[j].rotation.y += 0.01
        objects[j].rotation.z += 0.01
        objects[j].rotation.x += 0.01
        objects[j].position.z += speed
        if(objects[j].position.z > 200){
            objects[j].position.z = (10000 + (Math.random() * 100)) * -1
        }
    }

    if(mouse_hold){
        increment += 1
        speed = speed + (increment/50)
        effectPassGlitch.effects[0].strength.x = effectPassGlitch.effects[0].strength.x + (increment/5)
        effectPassGlitch.effects[0].strength.y = effectPassGlitch.effects[0].strength.y + (increment/5)
        if(effectPassGlitch.effects[0].delay.y >= 0){
            effectPassGlitch.effects[0].delay.x = effectPassGlitch.effects[0].delay.x - (increment/50)
            effectPassGlitch.effects[0].delay.y = effectPassGlitch.effects[0].delay.y - (increment/50)
        }
        for (let i = 0; i < objects.length; i++) {
            objects[i].position.y = objects[i].position.y + (Math.random() - 0.5) * (increment*10)
            objects[i].position.x = objects[i].position.x + (Math.random() - 0.5) * (increment*10)
        }
        
    }
    if(speed > 150){
        for (let i = 0; i < objects.length; i++) {
            objects[i].visible = false
        }
        container.style.opacity = '0';
        project_container.style.transform = 'translateY(0%)'
        setTimeout(() => {
            container.style.display = 'none';
            project_container.style.display = 'flex';

        }, 100);
        setTimeout(() => {
            for (let index = 0; index < projects.length; index++) {
                projects[index].style.animationName = 'none'
            }
        }, 1050);
       
    }

    // Renderer
    renderer.render(scene, camera)
    
}
loop()

close_button.addEventListener('click', () =>{
    for (let i = 0; i < objects.length; i++) {
        objects[i].visible = true
    }
    speed = 5
    project_container.style.transform = 'translateY(100%)'
    
    setTimeout(() => {
        container.style.opacity = '1';
    }, 550);

    setTimeout(() => {
        container.style.display = 'flex';
    }, 500);
    
})