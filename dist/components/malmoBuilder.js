import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export var Type;
(function (Type) {
    Type[Type["BORDER"] = 0] = "BORDER";
    Type[Type["BLOCK"] = 1] = "BLOCK";
    Type[Type["BOARD_CELL"] = 2] = "BOARD_CELL";
})(Type || (Type = {}));
class CustomMesh extends THREE.Mesh {
}
export class MalmoBuilder {
    constructor(inventory, currentColor, currentWorldState, gridSize = 11, nbCubeInInventory = 20) {
        this.inventory = inventory;
        this.currentColor = currentColor;
        this.currentWorldState = currentWorldState;
        //environment Elements
        this.container = document.getElementById('container');
        //functions set up
        this.onWindowResize = this.onWindowResize.bind(this);
        this.render = this.render.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
        //structural Parameters
        this.gridSize = gridSize;
        this.cellSize = 1;
        this.borderThickness = 0.05;
        this.cellThickness = 0.1;
        //functionnal Parameters
        this.isDragging = false;
        this.mouseDownPosition = {
            x: 0,
            y: 0
        };
        //threeJS parameters
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 5, 20);
        this.camera.lookAt(0, 0, 0);
        this.scene = new THREE.Scene();
        var cellGeometry = new THREE.PlaneGeometry(this.cellSize, this.cellSize);
        var borderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var cellMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.FrontSide });
        for (let i = -5; i <= 5; i += 1) {
            for (var j = -5; j <= 5; j++) {
                const x = i * (this.cellSize + this.borderThickness);
                const z = j * (this.cellSize + this.borderThickness);
                const cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
                cellMesh.position.set(x, -this.cellThickness / 2, z);
                cellMesh.rotation.x = -Math.PI / 2;
                cellMesh.meshProperties = { position: {
                        x: i,
                        y: j,
                        z: 0
                    }, type: Type.BOARD_CELL };
                if (i <= 5) {
                    const borderX = new THREE.Mesh(new THREE.PlaneGeometry(this.borderThickness, this.cellSize), borderMaterial);
                    borderX.position.set(x + this.cellSize / 2 + this.borderThickness / 2, -this.cellThickness / 2, z);
                    borderX.rotation.x = -Math.PI / 2;
                    borderX.meshProperties = { type: Type.BORDER };
                    cellMesh.add(borderX);
                }
                if (j <= 5) {
                    const borderZ = new THREE.Mesh(new THREE.PlaneGeometry(this.cellSize, this.borderThickness), borderMaterial);
                    borderZ.position.set(x, -this.cellThickness / 2, z + this.cellSize / 2 + this.borderThickness / 2);
                    borderZ.rotation.x = -Math.PI / 2;
                    borderZ.meshProperties = { type: Type.BORDER };
                    cellMesh.add(borderZ);
                }
                this.scene.add(cellMesh);
            }
        }
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.enableKeys = false;
        window.addEventListener('resize', this.onWindowResize, false);
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp, false);
        this.renderer.domElement.addEventListener('contextmenu', this.onRightClick, false);
        this.renderer.setClearColor('#212431');
        this.render();
        this.canvas = document.querySelector('#container > canvas');
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        requestAnimationFrame(this.render);
    }
    placeBlock(x, y, z, color) {
        if (x <= 5 && x >= -5 && y <= 5 && y >= -5 && z <= 10 && z > 0 && !this.currentWorldState.blockExists(x, y, z) && this.inventory.hasBlocksLeft(this.currentColor.id)) {
            var cubeGeometry = new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
            var cubeMaterial = new THREE.MeshBasicMaterial({ color: color.hex });
            var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh.position.set(x * (this.cellSize + this.borderThickness), -0.5 + z + z * this.borderThickness, y * (this.cellSize + this.borderThickness));
            const edges = new THREE.EdgesGeometry(cubeGeometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 }));
            cubeMesh.add(line);
            cubeMesh["meshProperties"] = { position: {
                    x: x,
                    y: y,
                    z: z
                }, type: Type.BLOCK };
            this.scene.add(cubeMesh);
        }
        else {
            throw Error("test");
        }
    }
    breakBlock(x, y, z) {
        //retirer le block de la scene
        let currentBlock;
        for (let i = 0; i < this.scene.children.length; i++) {
            const mesh = this.scene.children[i];
            const position = mesh.meshProperties.position;
            if (position && position.x === x && position.y === y && position.z === z) {
                this.scene.remove(mesh);
                break;
            }
        }
    }
    ;
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onMouseDown(event) {
        this.isDragging = false;
        this.mouseDownPosition = { x: event.clientX, y: event.clientY };
    }
    onMouseUp(event) {
        if (!this.isDragging) {
            const mouseUpPosition = { x: event.clientX, y: event.clientY };
            if (mouseUpPosition.x === this.mouseDownPosition.x && mouseUpPosition.y === this.mouseDownPosition.y) {
                this.onClick(event);
            }
        }
        this.isDragging = false;
    }
    onRightClick(event) {
        event.preventDefault();
    }
    onClick(event) {
        var rect = this.canvas.getBoundingClientRect();
        var mouse = new THREE.Vector2(((event.clientX - rect.left) / this.canvas.clientWidth) * 2 - 1, -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        var intersects = raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            const intersect = intersects.filter(v => v.object.type != "LineSegments")[0];
            const mesh = intersect.object;
            const position = mesh.meshProperties?.position;
            // Si un click gauche est réalisé sur un block, on le détruit
            if (position && event.button === 0 && mesh.meshProperties?.type === Type.BLOCK) {
                this.breakBlock(position.x, position.y, position.z);
            }
            // Si un click droit est réalisé sur un bock, nous placeront le novueau block en face de la bonne face.
            if (position && event.button === 2 && mesh.meshProperties?.type === Type.BLOCK) {
                if (intersect.face) {
                    if (intersect.face.normal.equals(new THREE.Vector3(0, 1, 0))) {
                        this.placeBlock(position.x, position.y, position.z + 1, this.currentColor);
                    }
                    else if (intersect.face.normal.equals(new THREE.Vector3(0, -1, 0))) {
                        this.placeBlock(position.x, position.y, position.z - 1, this.currentColor);
                    }
                    else if (intersect.face.normal.equals(new THREE.Vector3(1, 0, 0))) {
                        this.placeBlock(position.x + 1, position.y, position.z, this.currentColor);
                    }
                    else if (intersect.face.normal.equals(new THREE.Vector3(-1, 0, 0))) {
                        this.placeBlock(position.x - 1, position.y, position.z, this.currentColor);
                    }
                    else if (intersect.face.normal.equals(new THREE.Vector3(0, 0, 1))) {
                        this.placeBlock(position.x, position.y + 1, position.z, this.currentColor);
                    }
                    else if (intersect.face.normal.equals(new THREE.Vector3(0, 0, -1))) {
                        this.placeBlock(position.x, position.y - 1, position.z, this.currentColor);
                    }
                }
            }
            // Si un click droit est réalisé sur une cellule du plateau, nous placeront un block au dessus.
            if (position && event.button === 2 && mesh.meshProperties?.type === Type.BOARD_CELL) {
                this.placeBlock(position.x, position.y, position.z + 1, this.currentColor);
            }
        }
    }
}
//# sourceMappingURL=malmoBuilder.js.map