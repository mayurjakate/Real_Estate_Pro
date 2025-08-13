import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE for Vector3

// XMarkIcon is defined directly here for the MessageBox
export const XMarkIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

// MessageBox Component: Replaces native alert() for better UI and clipboard functionality
const MessageBox = ({ title, message, contentToCopy, onClose }) => {
  const handleCopyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = contentToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      const copyStatus = document.getElementById('copy-status');
      if (copyStatus) {
        copyStatus.textContent = 'Copied!';
        setTimeout(() => copyStatus.textContent = '', 1500);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{title}</h2>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap text-sm text-center">{message}</p>
        {contentToCopy && (
          <div className="mb-4">
            <textarea
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono overflow-auto resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              rows="4"
              value={contentToCopy}
            ></textarea>
            <button
              onClick={handleCopyToClipboard}
              className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 w-full text-base font-semibold"
            >
              Copy to Clipboard
            </button>
            <span id="copy-status" className="block text-center text-green-600 text-xs mt-1"></span>
          </div>
        )}
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 w-full text-base font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Model Component: Loads the 3D GLTF model
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} scale={0.15} position={[0, -1, 0]} />;
}

// ClickablePoint Component: Represents an interactive hotspot on the model
function ClickablePoint({ position, label, onClick }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial
        color="orange"
        emissive="orange"
        emissiveIntensity={0.7}
        transparent
        opacity={0.9}
        roughness={0.2}
        metalness={0.1}
      />
      <Html position={[0, 0.15, 0]} center>
        <div className="text-xs bg-gradient-to-br from-white to-gray-100 text-gray-800 px-2 py-1 rounded-md shadow-lg border border-gray-200 font-semibold whitespace-nowrap">
          {label}
        </div>
      </Html>
    </mesh>
  );
}

// Main CapturePoint Component
const CapturePoint = () => {
  const [cameraView, setCameraView] = useState({
    position: [5.99, -1.91, -0.18],
    target: [-0.16, -1.86, 0.07],
  });
  const [activeTab, setActiveTab] = useState('captureClick');
  const [messageBox, setMessageBox] = useState(null);

  const controlsRef = useRef();
  const cameraRef = useRef();
  const modelUrl = "/Shree_Gajanan_Enclave/models/building/new_comp_main_building.glb";

  useEffect(() => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.set(...cameraView.target);
      controlsRef.current.update();
      cameraRef.current.position.set(...cameraView.position);
      cameraRef.current.lookAt(controlsRef.current.target);
    }
  }, [cameraView]);

  const captureCameraView = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) {
      setMessageBox({
        title: "Error",
        message: "Camera or controls not ready. Please wait for the 3D model to load.",
        contentToCopy: ""
      });
      return;
    }
    const pos = cameraRef.current.position;
    const target = controlsRef.current.target;

    const posStr = `[${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`;
    const targetStr = `[${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`;
    const output = `position: ${posStr},\n    target: ${targetStr},`;

    setMessageBox({
      title: "Camera View Captured",
      message: `Copy these coordinates to quickly jump to this view later:`,
      contentToCopy: output
    });
  }, []);

  const captureClickPoint = useCallback((event) => {
    // This function is now just a placeholder for the onClick on Canvas.
    // The actual raycasting logic will be handled by the ClickCatcher component.
    setMessageBox({
      title: "Click Point Action",
      message: "Raycasting will be handled by the internal click catcher. If you see this, the click registered!",
      contentToCopy: ""
    });
  }, []);

  // Helper component to perform raycasting inside the Canvas context
  const ClickCatcher = ({ onCapturedPoint }) => {
    const { raycaster, mouse, camera, scene, gl } = useThree();

    const handleCanvasClick = useCallback((event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Find intersections with all objects in the scene.
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        onCapturedPoint(intersects[0].point);
      } else {
        onCapturedPoint(null);
      }
    }, [raycaster, mouse, camera, scene, gl, onCapturedPoint]);

    useEffect(() => {
        const canvasElement = gl.domElement;
        if (canvasElement) {
            canvasElement.addEventListener('click', handleCanvasClick);
        }
        return () => {
            if (canvasElement) {
                canvasElement.removeEventListener('click', handleCanvasClick);
            }
        };
    }, [handleCanvasClick, gl.domElement]);

    return null;
  };


  const closeMessageBox = () => {
    setMessageBox(null);
  };

  const handlePointFromClickCatcher = useCallback((point) => {
    if (point) {
      const clicked = `[${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}]`;
      setMessageBox({
        title: "Click Point Captured",
        message: `The 3D coordinates of your click on the model are:`,
        contentToCopy: clicked
      });
      console.log(`Clicked Position: ${clicked}`);
    } else {
      setMessageBox({
        title: "No 3D Point Captured",
        message: "Could not determine 3D coordinates for the click. Please ensure you are clicking inside the canvas.",
        contentToCopy: ""
      });
    }
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-center justify-center font-inter">
      <div className="container mx-auto px-4 max-w-6xl w-full">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900 drop-shadow-md">
          Interactive Building Explorer
        </h1>
        <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto leading-relaxed">
          Explore the internal structure of the building model. Use the tabs to either capture exact 3D coordinates and camera perspectives, or interact with pre-defined points to navigate.
        </p>

        <div className="flex justify-center mb-10 rounded-2xl overflow-hidden shadow-xl border border-gray-300 bg-white">
          <button
            onClick={() => setActiveTab('captureClick')}
            className={`flex-1 px-8 py-4 text-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300
              ${activeTab === 'captureClick'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-inner transform scale-105'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } rounded-l-2xl`}
          >
            🎯 Capture Click Point
          </button>
          <button
            onClick={() => setActiveTab('captureCamera')}
            className={`flex-1 px-8 py-4 text-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300
              ${activeTab === 'captureCamera'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-inner transform scale-105'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } rounded-r-2xl`}
          >
            📸 Capture Camera View
          </button>
        </div>

        {activeTab === 'captureClick' && (
          <div className="tab-content text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">
              Click on the 3D model to find its coordinates
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Click anywhere on the 3D scene to get its coordinates. Orbit controls are disabled in this mode.
            </p>
          </div>
        )}

        {activeTab === 'captureCamera' && (
          <div className="tab-content text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">
              Set your desired camera angle and target
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Adjust the model's view using Orbit Controls to capture the perfect camera position and target.
            </p>
            <div className="mt-6">
              <button
                onClick={captureCameraView}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 text-lg font-semibold tracking-wide"
              >
                📸 Capture Current Camera View
              </button>
            </div>
          </div>
        )}

        {cameraView.target && (
          <div className="text-center mt-6 mb-8">
            <button
              className="text-base text-indigo-600 underline font-medium hover:text-indigo-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md px-3 py-1"
              onClick={() =>
                setCameraView({ position: [5.99, -1.91, -0.18], target: [-0.16, -1.86, 0.07] })
              }
            >
              Reset View to Default
            </button>
          </div>
        )}

        <div className="w-full aspect-video h-[350px] md:h-[500px] lg:h-[650px] rounded-3xl shadow-2xl border-4 border-gray-300 bg-gray-100 overflow-hidden relative">
          <Canvas
            camera={{ position: cameraView.position, fov: 50 }}
            onCreated={({ camera }) => (cameraRef.current = camera)}
            className="absolute inset-0"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, -5, -5]} intensity={0.8} />

            <Suspense fallback={<Html center><div className="text-xl text-gray-500 animate-pulse">Loading 3D model...</div></Html>}>
              <Model url={modelUrl} />

              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>

              <ClickablePoint
                position={[-0.01, -0.75, -1.12]}
                label="Water Pipe"
                onClick={() =>
                  setCameraView({
                    position: [-1.55, -1.15, -0.93],
                    target: [0.55, -1.23, -0.88],
                  })
                }
              />

              <ClickablePoint
                position={[-0.66, -3.02, 0.33]}
                label="Electric Box"
                onClick={() =>
                  setCameraView({
                    position: [-0.54, -3.04, 2.00],
                    target: [-0.26, -2.92, -0.09],
                  })
                }
              />

              <ClickablePoint
                position={[-0.16, 0.06, -0.21]}
                label="Water Tank"
                onClick={() =>
                  setCameraView({
                    position: [1.63, -0.29, 0.08],
                    target: [-1.03, -0.23, -0.04],
                  })
                }
              />

              <ClickablePoint
                position={[-1.08, -1.17, 0.05]}
                label="Fire Extinguisher"
                onClick={() =>
                  setCameraView({
                    position: [-3.43, -1.59, -0.03],
                    target: [-1.44, -1.69, 0.01],
                  })
                }
              />

            </Suspense>

            {activeTab === 'captureClick' && (
                <ClickCatcher onCapturedPoint={handlePointFromClickCatcher} />
            )}

            <OrbitControls
              ref={controlsRef}
              autoRotate={false}
              enablePan={true}
              enableZoom={true}
              target={cameraView.target}
              maxDistance={15} // Maximum zoom out distance
              minDistance={2}  // Minimum zoom in distance
              enabled={activeTab === 'captureCamera'}
            />
          </Canvas>
        </div>

        {messageBox && (
          <MessageBox
            title={messageBox.title}
            message={messageBox.message}
            contentToCopy={messageBox.contentToCopy}
            onClose={closeMessageBox}
          />
        )}
      </div>
    </section>
  );
};

export default CapturePoint;
