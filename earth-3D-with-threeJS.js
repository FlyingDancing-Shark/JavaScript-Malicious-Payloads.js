<html>
  <head>
      <title>02.01 - Globe and camera</title>
      <script src="../libs/three.js"></script>
      <script src="../libs/OrbitControls.js"></script>
      <script src="../libs/dat.gui.min.js"></script>
      <script src="../libs/stats.min.js"></script>
      <script src="../libs/EffectComposer.js"></script>
      <script src="../libs/RenderPass.js"></script>
      <script src="../libs/CopyShader.js"></script>
      <script src="../libs/ShaderPass.js"></script>
      <script src="../libs/MaskPass.js"></script>
      <style>
        body {
            /* set margin to 0 and overflow to hidden, to go fullscreen */
            margin: 0;
            overflow: hidden;
        }
    </style>
  </head>
  <script>var renderer, scene, camera, control, stats, cameraControl, starry_Scene, starry_Camera, composer;

      function init() {
      	scene = new THREE.Scene();
	starry_Scene = new THREE.Scene();
	var starry_Material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("../assets/textures/planets/starry_background.jpg"), depthTest: false });
            var starry_Plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), starry_Material);
            starry_Plane.position.z = -100;
            starry_Plane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
            starry_Scene.add(starry_Plane);
	
      	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      	camera.position.x = 25;
      	camera.position.y = 10;
      	camera.position.z = 23;
      	camera.lookAt(scene.position);
      	console.log(scene.position);
      	cameraControl = new THREE.OrbitControls(camera);

  	starry_Camera = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
           starry_Camera.position.z = 50;

      	renderer = new THREE.WebGLRenderer();
      	renderer.setClearColor(0x000000, 1.0);
      	renderer.setSize(window.innerWidth, window.innerHeight);
      	renderer.shadowMapEnabled = true;
      
      	var EarthGeometry = new THREE.SphereGeometry(15, 60, 60);
      	var EarthMaterial = createEarthMaterial();
      	var EarthMesh = new THREE.Mesh(EarthGeometry, EarthMaterial);
      	EarthMesh.name = 'Earth';
      	scene.add(EarthMesh);
  
      	var cloudGeometry = new THREE.SphereGeometry(15.35, 60, 60);
      	var cloudMaterial = createCloudMaterial();
      	var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      	cloudMesh.name = 'Clouds';
      	scene.add(cloudMesh);

	var ambientLight = new THREE.AmbientLight(0x111111);
        	ambientLight.name='Ambient';
        	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position = new THREE.Vector3(100, 10, -50);
	directionalLight.name = 'Directional';
	scene.add(directionalLight);

      	control = new function () {
           	    this.rotationSpeed = 0.001;
               this.ambientLightColor = ambientLight.color.getHex();
           	    this.directionalLightColor = directionalLight.color.getHex();
      	};
  
      	addControlGui(control);
      	addStatsObject();	
	
	var renderED_starry = new THREE.RenderPass(starry_Scene, starry_Camera);
	var renderED_Earth = new THREE.RenderPass(scene, camera);
	renderED_Earth.clear = false;

	var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
           effectCopy.renderToScreen = true;
	composer = new THREE.EffectComposer(renderer);
           composer.addPass(renderED_starry);
           composer.addPass(renderED_Earth);
           composer.addPass(effectCopy);
	
      	document.body.appendChild(renderer.domElement);
      	render();
      }


      function createEarthMaterial() {
        	var earth_texture = THREE.ImageUtils.loadTexture("../assets/textures/planets/earthmap4k.jpg");
	        var bumpMap = THREE.ImageUtils.loadTexture("../assets/textures/planets/earthbump4k.jpg");
    		var specularMap = THREE.ImageUtils.loadTexture("../assets/textures/planets/earthspec4k.jpg");
    		var normalMap = THREE.ImageUtils.loadTexture("../assets/textures/planets/earth_normalmap_flat4k.jpg");
        	var earth_material =  new THREE.MeshPhongMaterial();
        	earth_material.map = earth_texture;
	        earthMaterial.specularMap = specularMap;
    		earthMaterial.specular = new THREE.Color(0x262626);

    		earthMaterial.normalMap = normalMap;
    		earthMaterial.normalScale = new THREE.Vector2(0.5, 0.7);
        	return earth_material;
      }


      function createCloudMaterial() {
        	var cloud_texture = THREE.ImageUtils.loadTexture("../assets/textures/planets/fair_clouds_4k.png");
        	var cloud_material = new THREE.MeshPhongMaterial();
        	cloud_material.map = cloud_texture;
        	cloud_material.transparent = true;
        	return cloud_material;
      }


      function addControlGui(controlObject) {
        	var gui = new dat.GUI();
        	gui.add(controlObject, 'rotationSpeed', -0.02, 0.02);
	gui.addColor(controlObject, 'ambientLightColor');
        	gui.addColor(controlObject, 'directionalLightColor');
      }


      function addStatsObject() {
      	stats = new Stats();
      	stats.setMode(0);
      	stats.domElement.style.position = 'absolute';
      	stats.domElement.style.left = '0px';
      	stats.domElement.style.top = '0px';
      	document.body.appendChild(stats.domElement);
      }


      function render() {
      	stats.update();
      	cameraControl.update();
      	scene.getObjectByName('Earth').rotation.y+=control.rotationSpeed;
      	scene.getObjectByName('Clouds').rotation.y+=control.rotationSpeed*1.1;
	scene.getObjectByName('Ambient').color = new THREE.Color(control.ambientLightColor);
        	scene.getObjectByName('Directional').color = new THREE.Color(control.directionalLightColor);
      	renderer.autoClear = false;
           composer.render();
      	requestAnimationFrame(render);
      }


      function handleResize() {
    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();
    	renderer.setSize(window.innerWidth, window.innerHeight);
      }

      window.onload = init;
      window.addEventListener('resize', handleResize, false);
  </script>
  <body></body>
</html>
