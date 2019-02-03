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

composer.addPass(new POST.RenderPass(scene, camera));
composer.addPass(effectPassGlitch);
//composer.addPass(effectPassPixel);
/**
 * Loop
 */
const loop = () =>
{
    window.requestAnimationFrame(loop)
    composer.render(clock.getDelta())
    for (let j = 0; j < objects.length; j++) {
        objects[j].rotation.y += 0.01
        objects[j].rotation.z += 0.01
        objects[j].rotation.x += 0.01
        objects[j].position.z += 5
        if(objects[j].position.z > 200){
            objects[j].position.z = (10000 + (Math.random() * 100)) * -1
        }
    }


    // Renderer
    renderer.render(scene, camera)
    
}
loop()

