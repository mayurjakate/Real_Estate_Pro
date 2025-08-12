import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Loader,
  useAnimations,
} from "@react-three/drei";
import { Expand, Minimize, X } from "lucide-react";

// Updated Model component to handle animation
function Model({
  modelPath,
  position,
  scale,
  playAnimation = true,
  animationName,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && playAnimation) {
      if (animationName) {
        actions[animationName]?.reset().fadeIn(0.5).play();
      } else {
        Object.values(actions).forEach((action) => {
          action?.reset?.();
          action?.fadeIn?.(0.5);
          action?.play?.();
        });
      }
    }
    return () => {
      if (actions) {
        Object.values(actions).forEach((action) => {
          if (action && typeof action.fadeOut === "function") {
            action.fadeOut(0.5);
          }
        });
      }
    };
  }, [actions, playAnimation, animationName]);

  useFrame((state, delta) => {
    group.current?.mixer?.update(delta);
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// Your main BuildingViewer component
interface BuildingViewerProps {
  modelPath: string;
  config: any;
}

const BuildingViewer: React.FC<BuildingViewerProps> = ({ modelPath, config }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    camera = { position: [8, -1, 1], fov: 50 },
    lights = {
      ambientLight: { intensity: 0.5 },
      spotLight: { position: [10, 10, 10], angle: 0.15, penumbra: 1 },
      pointLight: { position: [-10, -10, -10] },
      directionalLights: [],
    },
    controls = {
      enableZoom: true,
      enablePan: true,
      enableRotate: true,
      autoRotate: false,
      autoRotateSpeed: 0.5,
      target: [0, 0, 0],
    },
    modelTransform = {
      position: [0, 0, 0],
      scale: 1,
    },
    animationSettings = {
      play: true,
      name: null,
    },
  } = config;

  // The core fullscreen logic from your reference code
  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (element) {
      if (!isFullscreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const loadingFallback = (
    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <div className="text-center text-indigo-600">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm font-medium">Loading 3D Model...</p>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-gray-100 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
      }`}
    >
      <Canvas
        camera={{
          position: camera.position,
          fov: camera.fov,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={lights.ambientLight?.intensity || 0.5} />
          {lights.spotLight && (
            <spotLight
              position={lights.spotLight.position || [10, 10, 10]}
              angle={lights.spotLight.angle || 0.15}
              penumbra={lights.spotLight.penumbra || 1}
              intensity={lights.spotLight.intensity || 1}
            />
          )}
          {lights.pointLight && (
            <pointLight
              position={lights.pointLight.position || [-10, -10, -10]}
              intensity={lights.pointLight.intensity || 0.5}
            />
          )}
          {lights.directionalLights &&
            lights.directionalLights.map((dl, index) => (
              <directionalLight
                key={index}
                position={dl.position}
                intensity={dl.intensity}
                color={dl.color}
                castShadow={dl.castShadow || false}
              />
            ))}
          <Model
            modelPath={modelPath}
            position={modelTransform.position}
            scale={modelTransform.scale}
            playAnimation={animationSettings.play}
            animationName={animationSettings.name}
          />
          <OrbitControls
            enableZoom={controls.enableZoom !== false}
            enablePan={controls.enablePan !== false}
            enableRotate={controls.enableRotate !== false}
            autoRotate={controls.autoRotate || false}
            autoRotateSpeed={controls.autoRotateSpeed || 0.5}
            enableDamping={controls.enableDamping !== false}
            dampingFactor={controls.dampingFactor || 0.05}
            minDistance={controls.minDistance || 0.1}
            maxDistance={controls.maxDistance || Infinity}
            target={controls.target || [0, 0, 0]}
            minPolarAngle={controls.minPolarAngle || 0}
            maxPolarAngle={controls.maxPolarAngle || Math.PI}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <Loader />
      <button
        onClick={toggleFullscreen}
        className={`absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-md shadow-md transition-colors ${
          isFullscreen
            ? "bg-white hover:bg-gray-100 text-gray-700"
            : "bg-white hover:bg-gray-100 text-gray-700"
        }`}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <>
            <Minimize className="w-5 h-5" />
            <span className="text-sm">Exit</span>
          </>
        ) : (
          <>
            <Expand className="w-5 h-5" />
            <span className="text-sm">Fullscreen</span>
          </>
        )}
      </button>
    </div>
  );
};

export default BuildingViewer;