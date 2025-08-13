import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Loader,
  useAnimations,
} from "@react-three/drei";
import { Expand, Minimize } from "lucide-react";

// Model component
const ModelComponent = ({
  modelPath,
  position,
  scale,
  playAnimation = true,
  animationName,
}) => {
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

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};

// Camera setup component
const CameraSetup = ({ position, target, fov }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, position, target, fov]);

  return <OrbitControls ref={controlsRef} />;
};

interface BuildingViewerProps {
  modelPath: string;
  config: any;
}

const BuildingViewer: React.FC<BuildingViewerProps> = ({ modelPath, config }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize and initial dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate adjusted FOV based on aspect ratio
  const captureAspect = 16 / 9; // Aspect ratio of your capture container
  const currentAspect = dimensions.width / Math.max(dimensions.height, 1);
  const adjustedFov = currentAspect > captureAspect 
    ? 2 * Math.atan(Math.tan((config.camera?.fov || 50) * Math.PI / 360) * captureAspect / currentAspect) * 180 / Math.PI
    : config.camera?.fov || 50;

  // Destructure config with defaults
  const {
    camera = {
      position: [8, -1, 1],
      target: [0, 0, 0],
      fov: adjustedFov,
    },
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

  // Fullscreen logic
  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (element) {
      if (!isFullscreen) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ));
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
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-sm font-medium text-indigo-600">Loading 3D Model...</p>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-gray-100 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
      }`}
      style={{ aspectRatio: '16/9' }}
    >
      <Canvas
        camera={{
          position: camera.position,
          fov: adjustedFov,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <CameraSetup position={camera.position} target={camera.target} fov={adjustedFov} />
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
          {lights.directionalLights?.map((dl, index) => (
            <directionalLight
              key={index}
              position={dl.position}
              intensity={dl.intensity}
              color={dl.color}
              castShadow={dl.castShadow || false}
            />
          ))}
          <ModelComponent
            modelPath={modelPath}
            position={modelTransform.position}
            scale={modelTransform.scale}
            playAnimation={animationSettings.play}
            animationName={animationSettings.name}
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