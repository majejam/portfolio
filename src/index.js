import './css/style.styl'

import './css/reset.styl'

import * as THREE from 'three'

import * as POST from "postprocessing" 


/**
 * Custom cursor
 */


function drawCursor(x, y, radius) {
    this.context.beginPath();
    this.context.fillStyle = '#8A1538';
    this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.context.fill();
  }

function updateCursor() {
    this.context.clearRect(0, 0, this.sizes.width, this.sizes.height);
    this.drawBall(this.pos.x, this.pos.y, 30);
    this.pos.x = this.lerp(this.pos.x, this.pos.endX, 0.1);
    this.pos.y = this.lerp(this.pos.y, this.pos.endY, 0.1);
  }


/**
 * Dom content
 */
let show = false
let ratio =0
const link = document.querySelector('.container-projects')
const intro = document.querySelector('.introduction')
const myProjectBtn = document.querySelector('.projects')
const container = document.querySelector('.container-home')
const project_container = document.querySelector('.projects-container')
const projects = document.querySelectorAll('.project')
const scroll__bar = document.querySelector('.scroll__bar')
const close_button = document.querySelector('.close_button')


const cursor_hold = document.querySelector('.cursor-hold')
const sml_bar = document.querySelector('.sml-bar')


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
let isScrolling
let scrollspeed = 0
project_container.addEventListener( 'wheel', onMouseWheel, false );
project_container.addEventListener( 'scroll', onMouseWheel, false );
function onMouseWheel( event ) {
    //event.preventDefault();
    //posc += event.deltaY * 0.003;

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
    scroll__bar.style.transform = `translateY(${-((position_container/(project_container.offsetHeight - sizes.height)) * (sizes.height - (sizes.height * ((100/ratio)/100))))}px)`
    project_container.style.transform = `translateY(${position_container}px)`
    window.clearTimeout( isScrolling );

	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function() {

		// Run the callback
    
        for (let index = 0; index < projects.length; index++) {
            projects[index].style.transform = `matrix(1, 0, 0, 1, 0, 0)`
        }

	}, 66);
    
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
 * Cursor
 */
const cursor_m = {}
cursor_m.x = 0
cursor_m.y = 0

window.addEventListener('mousemove', (_event) =>
{
    cursor_m.x = _event.clientX / sizes.width 
    cursor_m.y = _event.clientY / sizes.height 

})

const touchpos = {}
touchpos.x = 0
touchpos.y = 0
window.addEventListener('touchestart', (_event) =>
{
    touchpos.x = _event.touches[0].clientX/sizes.width ;
    touchpos.y = _event.touches[0].clientY/ sizes.height;
    cursor_hold.style.left = `${(touchpos.x*100)-10}%`
    cursor_hold.style.top = `${(touchpos.y*100)-10}%`    
})
window.addEventListener('touchmove', (_event) =>
{
    touchpos.x = _event.touches[0].clientX/sizes.width ;
    touchpos.y = _event.touches[0].clientY/ sizes.height;
    cursor_hold.style.left = `${(touchpos.x*100)-10}%`
    cursor_hold.style.top = `${(touchpos.y*100)-10}%` 
})

/**
 * Ease in 
 */
let EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
  }
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

document.addEventListener('touchstart', ()=>{
    mouse_hold = true
})
document.addEventListener('touchend', ()=>{
    mouse_hold = false
})

let str_x = effectPassGlitch.effects[0].strength.x
let str_y = effectPassGlitch.effects[0].strength.y

let dly_x = effectPassGlitch.effects[0].delay.x
let dly_y = effectPassGlitch.effects[0].delay.y
/**
 * Loop
 */
let increment = 0
let speed = 5

const loop = () =>
{
    window.requestAnimationFrame(loop)
    composer.render(clock.getDelta())

    cursor_hold.style.left = `${(cursor_m.x*100)+1.5}%`
    cursor_hold.style.top = `${(cursor_m.y*100)+2}%`
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
        increment += 0.1
        speed = speed + increment
        
        sml_bar.style.transform = `scaleX(${(speed - 5)/235})`

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
    else if(!mouse_hold && increment > 0){
        increment -= 0.1
        speed = speed - increment
        sml_bar.style.transform = `scaleX(${(speed - 5)/235})`
        effectPassGlitch.effects[0].strength.x = str_x
        effectPassGlitch.effects[0].strength.y = str_y
        if(effectPassGlitch.effects[0].delay.y >= 0){
            effectPassGlitch.effects[0].delay.x = dly_x
            effectPassGlitch.effects[0].delay.y = dly_y
        }
    }
    
    if(speed > 100 && speed < 240){
        camera.fov = camera.fov - 1;
        camera.updateProjectionMatrix();
        
    }
    else{
        camera.fov = 175
        camera.updateProjectionMatrix();
    }

    if(speed > 240){
        for (let i = 0; i < objects.length; i++) {
            objects[i].visible = false
        }
        close_button.style.display = 'flex'
        scroll__bar.style.display = 'flex'
        container.style.opacity = '0';
        project_container.style.transform = 'translateY(0%)'
        for (let index = 0; index < projects.length; index++) {
            projects[index].style.animationName = 'appear-text'
        } 
        setTimeout(() => {
            container.style.display = 'none';
            project_container.style.display = 'flex';
        }, 50);
        setTimeout(() => {
            project_container.style.transitionDuration = '0.1s'
        }, 500);
        setTimeout(() => {
            for (let index = 0; index < projects.length; index++) {
                projects[index].style.animationName = 'none'
            }
        }, 1050);
       speed = 5
       increment = 0
    }
    //ease-in 
    //camera.position.x = EasingFunctions.easeOutQuad(cursor_m.x/2 - cursor_m.x) * 400
    //camera.position.y = EasingFunctions.easeOutQuad(cursor_m.y/2 - cursor_m.y) * 400


    camera.position.x = lerp(camera.position.x, (cursor_m.x * 2 - 1)* 700, 0.05)
    camera.position.y = lerp(camera.position.y, (-cursor_m.y * 2 + 1) * 700, 0.05)


    // Scroll bar height 
    ratio = project_container.offsetHeight/sizes.height
    scroll__bar.style.height = `${100/(ratio)}%`
    // Renderer
    renderer.render(scene, camera)
    
}
loop()

function lerp(min, max, fraction) {
    return (max - min) * fraction + min;
}

close_button.addEventListener('click', () =>{
    for (let i = 0; i < objects.length; i++) {
        objects[i].visible = true
    }
    speed = 5
    project_container.style.transitionDuration = '0.5s'
    project_container.style.transform = 'translateY(100%)'
    close_button.style.display = 'none'
    scroll__bar.style.display = 'none'
   
    setTimeout(() => {
        container.style.opacity = '1';
    }, 550);

    setTimeout(() => {
        container.style.display = 'flex';
    }, 500);
    
})