var container;
var canvas;
var camera, scene, renderer;
var controls;
var clock = new THREE.Clock();
var gridSize = 11;
var cellSize = 1;
var borderThickness = 0.05;
var isDragging = false;
var mouseDownPosition;
const cellThickness = 0.1;

const Type = {
  BORDER: 'border',
  CUBE: 'cube',
  BOARD_CELL: 'boardCell'
};

const Color = {
    RED: '#c0392b',
    BLUE: '#3498db',
    ORANGE: '#e67e22',
    PURPLE: '#9b59b6',
    YELLOW: '#f1c40f',
    GREEN: '#27ae60'
}

const inventory = {
    RED: 20,
    BLUE: 20,
    ORANGE: 20,
    PURPLE: 20,
    YELLOW: 20,
    GREEN: 20
}

var currentColor = 'RED'

document.querySelectorAll('.color').forEach(function(element) {
    element.addEventListener('click', function() {
        currentColor = element.getAttribute('color')
        document.querySelector(".color.selected").classList.remove('selected')
        element.classList.add('selected')
    });
});


var placedBlocks = []

let historyChat = ["Mission 0 started"] 

const historyChatElement = document.querySelector('#historyChat');
historyChatElement.textContent = historyChat

User = {
    ARCHITECT: "Architect",
    BUILDER: "Builder",
}

currentUser = User.ARCHITECT

const chatElement = document.querySelector('#chat');
chatElement.addEventListener('keydown', function(event) { 
    if (event.keyCode === 13) { 
        historyChat.push(`<${currentUser}> ${chatElement.value}`)
        chatElement.value = ""
        historyChatElement.textContent = historyChat.join('\n')
        addEntryToLogs()
    }
});

var userSelectorElement = document.getElementById("userSelector");

userSelectorElement.addEventListener("change", function() {
    if(userSelectorElement.checked){
        currentUser = User.BUILDER
    } else {
        currentUser = User.ARCHITECT
    }
});


function formatTime(minutes, seconds) {
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

let startTime;

function updateTimer() {
    const duration = (new Date()) - startTime;
    const durationInSeconds = Math.floor(duration / 1000);

    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    document.getElementById('timer').textContent = formatTime(minutes, seconds);
}

const hiderElement = document.querySelector('#hider');
hiderElement.addEventListener('click', function(event) { 
    hiderElement.setAttribute('style', 'display: none')
    const timerInterval = setInterval(updateTimer, 1000);
    startTime = new Date()
});


const logs = {
	"WorldStates": []
}

function addEntryToLogs(){
    function formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    logs["WorldStates"] = [...logs["WorldStates"], {
        ChatHistory: [...historyChat],
        Timestamp: formatDateTime(new Date()),
        BlocksInGrid: placedBlocks.map(e => ({
					"X": e.x,
					"Y": e.z + 1,
					"Z": e.y,
					"Type": "wool",
					"Colour": e.color
				}))
    }]
}

addEntryToLogs()

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    var cellGeometry = new THREE.PlaneGeometry(cellSize, cellSize);
    var borderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var cellMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.FrontSide });

    for (var i = -5; i <= 5; i+=1) {
        for (var j = -5; j <= 5; j++) {
            var x = i * (cellSize + borderThickness);
            var z = j * (cellSize + borderThickness);

            var cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
            cellMesh.position.set(x, -cellThickness / 2, z);
            cellMesh.rotation.x = -Math.PI / 2;
            scene.add(cellMesh);

            if (i <= 5) {
                var borderX = new THREE.Mesh(new THREE.PlaneGeometry(borderThickness, cellSize), borderMaterial);
                borderX.position.set(x + cellSize / 2 + borderThickness / 2, -cellThickness / 2, z);
                borderX.rotation.x = -Math.PI / 2;
                borderX["type"] = Type.BORDER
                scene.add(borderX);
            }

            if (j <= 5) {
                var borderZ = new THREE.Mesh(new THREE.PlaneGeometry(cellSize, borderThickness), borderMaterial);
                borderZ.position.set(x, -cellThickness / 2, z + cellSize / 2 + borderThickness / 2);
                borderZ.rotation.x = -Math.PI / 2;
                borderZ["type"] = Type.BORDER
                scene.add(borderZ);
            }

            cellMesh["x"] = i
            cellMesh["y"] = j
            cellMesh["z"] = 0
            cellMesh["type"] = Type.BOARD_CELL
        }
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI;
    controls.enableKeys = false; 

    window.addEventListener('resize', onWindowResize, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);
    renderer.domElement.addEventListener('contextmenu', onRightClick, false);
    
    renderer.setClearColor('#212431');
    canvas = document.querySelector('#container > canvas');
}

function blockExists(x, y, z) {
    for (var i = 0; i < placedBlocks.length; i++) {
        var block = placedBlocks[i];
        if (block.x === x && block.y === y && block.z === z) {
            return true;
        }
    }
    return false;
}

function placeBlock(x, y, z, color){
    if(x <= 5 && x >= -5 && y <= 5 && y >= -5 && z <= 10 && z > 0 && !blockExists(x, y, z) && inventory[currentColor] > 0){
        var cubeGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
        var cubeMaterial = new THREE.MeshBasicMaterial({ color: color});
        var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cubeMesh.position.set(
            x * (cellSize + borderThickness),
            - 0.5 + z + z * borderThickness,
            y * (cellSize + borderThickness)
        );

        const edges = new THREE.EdgesGeometry(cubeGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 }));
        cubeMesh.add(line);
        cubeMesh["type"] = Type.CUBE
        cubeMesh["x"] = x
        cubeMesh["y"] = y
        cubeMesh["z"] = z

        var block = { x: x, y: y, z: z, color: currentColor};
        placedBlocks.push(block);

        scene.add(cubeMesh);
        inventory[currentColor] -= 1
        document.querySelector(`.color[color="${currentColor}"] > span`).textContent  = inventory[currentColor]
    addEntryToLogs()        
    } else {console.log("oups")}
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    isDragging = false;
    mouseDownPosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp(event) {
    if (!isDragging) {
        var mouseUpPosition = { x: event.clientX, y: event.clientY };
        if (mouseUpPosition.x === mouseDownPosition.x && mouseUpPosition.y === mouseDownPosition.y) {
            onClick(event);
        }
    }
    isDragging = false;
}

function onRightClick(event) {
    event.preventDefault(); 
}

function onClick(event) {
    var rect = canvas.getBoundingClientRect();
    var mouse = {
        x: ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1,
        y: -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1
    };

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        console.log(intersects.map(v => v.object))
        var intersect = intersects.filter(v => v.object.type != "LineSegments")[0];
        var mesh = intersect.object;
        if (event.button === 0 && mesh.type === Type.CUBE) { 
            scene.remove(mesh);
            
            for (var i = 0; i < placedBlocks.length; i++) {
                var block = placedBlocks[i];
                if (mesh.x === block.x && mesh.y === block.y && mesh.z === block.z) {
                    inventory[block.color] += 1
                    document.querySelector(`.color[color="${block.color}"] > span`).textContent  = inventory[block.color]
                    placedBlocks.splice(i, 1);
                    break;
                }
            }
            addEntryToLogs()
        }
        
        if (event.button === 2 && mesh.type === Type.CUBE){
            if (intersect.face) {
                if (intersect.face.normal.equals(new THREE.Vector3(0, 1, 0))) {
                    placeBlock(mesh.x, mesh.y, mesh.z + 1, Color[currentColor])
                } else if (intersect.face.normal.equals(new THREE.Vector3(0, -1, 0))) {
                    placeBlock(mesh.x, mesh.y, mesh.z - 1, Color[currentColor])
                } else if (intersect.face.normal.equals(new THREE.Vector3(1, 0, 0))) {
                    placeBlock(mesh.x + 1, mesh.y, mesh.z, Color[currentColor])
                } else if (intersect.face.normal.equals(new THREE.Vector3(-1, 0, 0))) {
                    placeBlock(mesh.x - 1, mesh.y, mesh.z, Color[currentColor])
                } else if (intersect.face.normal.equals(new THREE.Vector3(0, 0, 1))) {
                    placeBlock(mesh.x, mesh.y + 1, mesh.z, Color[currentColor])
                } else if (intersect.face.normal.equals(new THREE.Vector3(0, 0, -1))) {
                    placeBlock(mesh.x, mesh.y - 1, mesh.z, Color[currentColor])
                }
            }
        }

        if (event.button === 2 && mesh.type === Type.BOARD_CELL) {
            placeBlock(mesh.x, mesh.y, mesh.z + 1, Color[currentColor])
        }
    }
}

function render() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
}

init();
render();

const downloadElement = document.querySelector('#download');
downloadElement.addEventListener('click', function(event) { 
    const jsonString = JSON.stringify(logs, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});
