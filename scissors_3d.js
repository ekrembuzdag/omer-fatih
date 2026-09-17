const container = document.querySelector("#scissors-3d");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0.15, 8.5);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

container.appendChild(renderer.domElement);

const silver = new THREE.MeshStandardMaterial({
    color: 0xd9dde2,
    metalness: 1,
    roughness: 0.2
});

const darkSilver = new THREE.MeshStandardMaterial({
    color: 0x737981,
    metalness: 1,
    roughness: 0.24
});

const gold = new THREE.MeshStandardMaterial({
    color: 0xd4af57,
    metalness: 0.95,
    roughness: 0.22
});

const scissors = new THREE.Group();
scene.add(scissors);

function createBlade(material, mirror, depth, angle) {
    const shape = new THREE.Shape();

    shape.moveTo(-0.1, -0.05);
    shape.lineTo(-0.2, 2.3);
    shape.quadraticCurveTo(-0.16, 2.7, 0, 2.95);
    shape.quadraticCurveTo(0.18, 2.63, 0.21, 2.25);
    shape.lineTo(0.11, -0.05);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.03,
        bevelSegments: 4
    });

    geometry.translate(0, 0, -0.05);

    const blade = new THREE.Mesh(geometry, material);

    blade.scale.x = mirror ? -1 : 1;
    blade.rotation.z = angle;
    blade.position.z = depth;

    scissors.add(blade);
}

function createRod(startX, startY, endX, endY, material, depth) {
    const differenceX = endX - startX;
    const differenceY = endY - startY;
    const length = Math.hypot(differenceX, differenceY);

    const geometry = new THREE.CylinderGeometry(
        0.115,
        0.14,
        length,
        28
    );

    const rod = new THREE.Mesh(geometry, material);

    rod.position.set(
        (startX + endX) / 2,
        (startY + endY) / 2,
        depth
    );

    rod.rotation.z = -Math.atan2(differenceX, differenceY);

    scissors.add(rod);
}

function createRing(x, y, rotation, depth) {
    const geometry = new THREE.TorusGeometry(
        0.52,
        0.115,
        24,
        96
    );

    const ring = new THREE.Mesh(geometry, silver);

    ring.position.set(x, y, depth);
    ring.rotation.z = rotation;
    ring.scale.y = 1.12;

    scissors.add(ring);
}

createBlade(silver, false, 0.05, -0.075);
createBlade(darkSilver, true, -0.08, 0.075);

createRod(-0.06, -0.05, -0.53, -1.2, silver, 0.03);
createRod(0.06, -0.05, 0.53, -1.2, darkSilver, -0.03);

createRing(-0.59, -1.55, -0.12, 0.03);
createRing(0.59, -1.55, 0.12, -0.03);

const pivotBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.2, 64),
    darkSilver
);

pivotBase.rotation.x = Math.PI / 2;
pivotBase.position.z = 0.06;
scissors.add(pivotBase);

const pivotCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.225, 64),
    gold
);

pivotCap.rotation.x = Math.PI / 2;
pivotCap.position.z = 0.09;
scissors.add(pivotCap);

scene.add(
    new THREE.HemisphereLight(0xffffff, 0x17110a, 2.4)
);

const whiteLight = new THREE.DirectionalLight(0xffffff, 5);
whiteLight.position.set(4, 5, 7);
scene.add(whiteLight);

const goldLight = new THREE.DirectionalLight(0xd4af57, 4);
goldLight.position.set(-5, 1, -3);
scene.add(goldLight);

function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) {
        return;
    }

    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();

const clock = new THREE.Clock();

function animate() {
    const time = clock.getElapsedTime();

    scissors.rotation.y = time * 0.42;
    scissors.rotation.z = Math.sin(time * 0.45) * 0.025;
    scissors.position.y = Math.sin(time * 0.7) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();