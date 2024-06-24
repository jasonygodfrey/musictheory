import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './App.css';

function App() {
  const mountRef = useRef(null);
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 1);

    // Create a line with three points
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    camera.position.z = 5;

    function onMouseMove(event) {
      // Convert mouse position to normalized device coordinates (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function distortLine() {
      // Update the middle point based on mouse proximity in the x direction
      let proximity = Math.abs(mouse.x);  // Normalize x proximity to between 0 and 1
      if (proximity < 0.5) { // Assume a threshold for proximity
        let scale = (0.5 - proximity) * 2; // Increase effect as mouse gets closer
        points[1].y = mouse.y * scale * 10; // Scale and apply distortion based on mouse y position
        geometry.setFromPoints(points);
      } else {
        points[1].y = 0; // Reset if the mouse is too far
        geometry.setFromPoints(points);
      }
    }

    const animate = function () {
      requestAnimationFrame(animate);
      distortLine(); // Update line distortion based on mouse position
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="App" ref={mountRef}></div>
  );
}

export default App;
