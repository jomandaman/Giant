
var layer_count = 9;
var load_counter = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    32,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 128;


var q = {
    x: null,
    y: null,
    z: null,
    w: null
};
var initial_angles = {
    alpha: null,
    beta: null,
    gamma: null
};


var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor( 0xffffff, 1);
document.body.appendChild( renderer.domElement );

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();


var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false; 
controls.enableDamping = true;
controls.minPolarAngle = (Math.PI / 2) - 0.4;
controls.maxPolarAngle = (Math.PI / 2) + 0.4;
controls.minAzimuthAngle = -Math.PI / 8;
controls.maxAzimuthAngle = Math.PI / 8;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.02;

controls.saveState();

// save current camera and controls to reset on mouseup / touchend
var camera_position = camera.position.clone();

var counter = 1;
var current_frame = 1;

var animated_layers = [];

var group = new THREE.Group();

addLayer("img/sky.png", {x: 0, y: 0, z: -21}, {x: 0, y: 0, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/moon.png", {x: 0, y: 0, z: -17}, {x: 0, y: 0, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/clouds.png", {x: 0, y: 0, z: -13}, {x: 0, y: 0, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/trees.png", {x: 0, y: 0, z: -10}, {x: 0, y: 0, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/mask.png", {x: 0, y: 0, z: -5}, {x: 0, y: 0, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/body.png", {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/light.png", {x: -0.5, y: 0.75, z: 4.5}, {x: 0, y: 0.15, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
addLayer("img/hogarth.png", {x: 0, y: 0.1, z: 1.75}, {x: -0.2, y: 0, z: 0.01}, 1, 1, 3, THREE.NormalBlending, false);
addLayer("img/arm.png", {x: 0.75, y: 0, z: 9}, {x: 0, y: 0.25, z: 0}, 1, 1, 2, THREE.NormalBlending, false);
/*
var backdrop_geometry = new THREE.PlaneGeometry(26, 14.943 * 2.6);
var backdrop_material = new THREE.MeshBasicMaterial({
    color: 0x292933,
    clippingPlanes: [clip_layer],
    transparent: true
});
var backdrop_layer = new THREE.Mesh( backdrop_geometry, backdrop_material );
backdrop_layer.position.z = -5;
backdrop_layer.renderOrder = 2;
group.add( backdrop_layer );			
*/

scene.add( group );
controls.update();

function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    controls.update();

    var new_frame = Math.ceil(counter / 15);
    if (new_frame !== current_frame) {
        var offset = (new_frame - 1) / 5;

        // change position for animated layers
        animated_layers.forEach(function(layer, index) {
            layer.material.map.offset.x = offset;
        });

        current_frame += 1;
        if (current_frame > 5) {
            current_frame = 1;
        }

    }

    counter += 1;

    if (counter > 75) {
        counter = 1;
    }

    renderer.render( scene, camera );
}
animate();

function addLayer(layer_name, position, rotation, scale, opacity, render_order, blendMode, animation) {
    var geometry = new THREE.PlaneGeometry (80, 80);
    var texture = new THREE.TextureLoader().load( layer_name, function() {
        load_counter += 1;
        if (load_counter >= layer_count) {
            var loading_mask = document.getElementById('loading');
            loading_mask.style.opacity = 0;
            loading_mask.style.visibility = 'hidden';
        }
    });
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: opacity,
        blending: blendMode,
        depthWrite: false,
        depthTest: false
    })
    material.map.minFilter = THREE.LinearFilter;
    var layer = new THREE.Mesh( geometry, material );
    if (animation === true) {
        layer.material.map.wrapS = THREE.RepeatWrapping;
        layer.material.map.repeat.set(0.2, 1);
    }
    layer.material.wrapS = THREE.RepeatWrapping;
    layer.material.wrapT = THREE.RepeatWrapping;
    layer.position.z = position.z;
    layer.position.x = position.x;
    layer.position.y = position.y;
    layer.scale.x = scale;
    layer.scale.y = scale;
    layer.rotation.x = rotation.x;
    layer.rotation.y = rotation.y;
    layer.rotation.z = rotation.z;
    layer.renderOrder = render_order;
    if (animation) {
        animated_layers.push(layer);
    }
    group.add( layer );
}

var rad = Math.PI / 180;

var motion_button = document.querySelector('.allow-motion-button');

window.addEventListener("deviceorientation", function(event) {

    motion_button.classList.remove('visible');

    // if (initial_angles.alpha === null) {
    // 	initial_angles.alpha = event.alpha;
    // 	initial_angles.beta = event.beta;
    // 	initial_angles.gamma = event.gamma;
    // }
    // q = Quaternion.fromEuler(
    // 	(event.alpha - initial_angles.alpha) * rad,
    // 	(event.beta - initial_angles.beta) * rad,
    // 	(event.gamma - initial_angles.gamma) * rad,
    // 	'ZXY');

    // scene.quaternion.x = q.x;
    // scene.quaternion.y = q.y;
    // //scene.quaternion.z = q.z;
    // scene.quaternion.w = q.w;

    // if (window.orientation === 90) {
    // 	scene.quaternion.x = -q.y;
    // 	scene.quaternion.y = q.x;
    // } else if (window.orientation === -90) {
    // 	scene.quaternion.x = q.y;
    // 	scene.quaternion.y = -q.x;
    // } else if (window.orientation === 180) {
    // 	scene.quaternion.x = -q.x;
    // 	scene.quaternion.y = -q.y;
    // }

}, true);

var alpha = 0;
var beta = 0;
var total_x = 0;
var total_y = 0;
var max_offset = 2000;

window.addEventListener("devicemotion", function(e) {

    motion_button.classList.remove('visible');

    alpha = e.rotationRate.alpha;
    beta = e.rotationRate.beta;

    total_x += beta;
    total_y += alpha;

    if (Math.abs(total_x) > max_offset) {
        total_x = max_offset * Math.sign(total_x);
    }
    if (Math.abs(total_y) > max_offset) {
        total_y = max_offset * Math.sign(total_y);
    }

    var x_offset = -total_x / 3000;
    var y_offset = total_y / 3000;

    scene.rotation.x = x_offset;
    scene.rotation.y = y_offset;

    if (window.orientation === 90) {
        scene.rotation.x = x_offset;
        scene.rotation.y = y_offset;
    } else if (window.orientation === -90) {
        scene.rotation.x = -x_offset;
        scene.rotation.y = -y_offset;
    } else if (window.orientation === 180) {
        scene.rotation.x = -y_offset;
        scene.rotation.y = x_offset;
    } else if (window.orientation === 0) {
        scene.rotation.x = y_offset;
        scene.rotation.y = -x_offset;
    }

});

function snapBack() {
    controls.enableDamping = false;
    TWEEN.removeAll();
    var tween = new TWEEN.Tween(camera.position).to(camera_position, 200).easing(TWEEN.Easing.Back.Out).start();
}

window.addEventListener('mousedown', function(event) {
    controls.enableDamping = true;
});
window.addEventListener('touchstart', function(event) {
    controls.enableDamping = true;
});

window.addEventListener('mouseup', function(event) {
    snapBack();
});

window.addEventListener('touchend', function(event) {
    snapBack();
});

window.addEventListener('orientationchange', function(event) {
    initial_angles.alpha = null;
    initial_angles.beta = null;
    initial_angles.gamma = null;
    total_x = 0;
    total_y = 0;
    setTimeout(function () {
        resizeCanvas();
    }, 150);
});

window.addEventListener('resize', function() {
    resizeCanvas(); // weird zoom in bug on mobile safari?				
});

function resizeCanvas() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
    motion_button.classList.add('visible');
}

function enableMotion() {
    DeviceOrientationEvent.requestPermission();
    motion_button.classList.remove('visible');
}