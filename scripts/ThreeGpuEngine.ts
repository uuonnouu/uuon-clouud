import * as THREE from "three";

// 1. The Custom WebGL Vertex Shader Layout
// This code compiles directly inside the graphics card, using your parameters to distort geometries
const vertexShaderCode = `
    uniform float uTime;
    uniform float p1_freq;
    uniform float p2_amp;
    uniform float p3_spin;
    uniform float p4_res;
    
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vNormal = normal;
        vUv = uv;

        // Mathematical multi-parameter deformation matrix wave function
        vec3 morphedPosition = position;
        
        // Use your live amplitude, frequency, and resonance parameters to morph the coordinates
        float wave = sin(position.y * p1_freq + uTime * p3_spin) * cos(position.x * p4_res);
        morphedPosition += normal * wave * (p2_amp * 0.01);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    }
`;

// 2. The Custom Fragment Shader Layout (Controls the radiant color maps)
const fragmentShaderCode = `
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float uTime;

    void main() {
        // Create an evolving color spectrum based on the structural mesh normal vectors
        vec3 color = 0.5 + 0.5 * cos(uTime + vNormal + vec3(0.0, 2.0, 4.0));
        gl_FragColor = vec4(color, 1.0);
    }
`;

export class MultidimensionalShapeEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh;
    private shaderMaterial: THREE.ShaderMaterial;

    constructor(canvasContainerId: string) {
        const container = document.getElementById(canvasContainerId);
        if (!container) throw new Error("Canvas injection target container not found.");

        // Initialize Three.js Graphic Stack components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        // Define your 26-parameter uniform bridge structure
        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShaderCode,
            fragmentShader: fragmentShaderCode,
            uniforms: {
                uTime: { value: 0.0 },
                p1_freq: { value: 1.111111 },
                p2_amp: { value: 15.000000 },
                p3_spin: { value: 0.333333 },
                p4_res: { value: 45.123456 }
            }
        });

        // Generate the base geometric anchor mesh (e.g., a detailed sphere lattice)
        const geometry = new THREE.IcosahedronGeometry(2, 64);
        this.mesh = new THREE.Mesh(geometry, this.shaderMaterial);
        this.scene.add(this.mesh);

        this.camera.position.z = 5;
        this.animate();
    }

    // High-speed API injection routine to update variables from your Neon DB live
    public synchronizeMatrixParameters(dbMorphParameters: any) {
        if (!dbMorphParameters) return;
        
        this.shaderMaterial.uniforms.p1_freq.value = parseFloat(dbMorphParameters.p1_freq || 1.0);
        this.shaderMaterial.uniforms.p2_amp.value  = parseFloat(dbMorphParameters.p2_amp || 0.0);
        this.shaderMaterial.uniforms.p3_spin.value = parseFloat(dbMorphParameters.p3_spin || 0.0);
        this.shaderMaterial.uniforms.p4_res.value  = parseFloat(dbMorphParameters.p4_res || 1.0);
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        
        // Loop time values to run continuous canvas rendering animations at 60fps
        this.shaderMaterial.uniforms.uTime.value += 0.01;
        this.mesh.rotation.y += 0.005;
        
        this.renderer.render(this.scene, this.camera);
    };
}
