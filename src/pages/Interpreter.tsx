import { useState, useRef, useEffect, useCallback } from "react"; // Added useCallback
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Volume2, Languages, Activity, VideoOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Removed MediaPipe imports

// Type definition for TensorFlow.js model
interface TeachableMachineModel {
  predict: (input: HTMLVideoElement | HTMLCanvasElement) => Promise<{ className: string; probability: number }[]>;
  getTotalClasses: () => number;
}
declare global {
  interface Window {
    tmPose: {
      load: (modelURL: string, metadataURL: string) => Promise<TeachableMachineModel>;
    };
  }
}

const Interpreter = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [modelStatus, setModelStatus] = useState("Loading TM library...");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<TeachableMachineModel | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPredictionTime = useRef(0);
  const predictionInterval = 200;

  const { toast } = useToast();

  // 1. Define loadModel using useCallback
  const loadModel = useCallback(async () => {
    setModelStatus('Loading TM model...');
    // Wait until tmPose is available
    while (typeof window.tmPose === 'undefined') {
        console.log("Waiting for tmPose to load...");
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
    }
    console.log("tmPose loaded, loading model...");

    const modelURL = "https://teachablemachine.withgoogle.com/models/jAECmXW_g/model.json";
    const metadataURL = "https://teachablemachine.withgoogle.com/models/jAECmXW_g/metadata.json";

    try {
        const loadedModel = await window.tmPose.load(modelURL, metadataURL);
        modelRef.current = loadedModel;
        setModelStatus("Ready");
        toast({ title: "Custom AI Model Loaded", description: "Ready to recognize your numbers." });
    } catch (error) {
        console.error("Error loading Teachable Machine model:", error);
        setModelStatus("Error loading TM model.");
        setCameraError("Failed to load custom AI model.");
    }
  }, [toast, setModelStatus, setCameraError]); // Dependencies for useCallback

  // 2. Load the Teachable Machine Pose Script and Model
  useEffect(() => {
    const scriptId = 'teachablemachine-script';
    // Check if script is already added
    if (document.getElementById(scriptId)) {
        if (window.tmPose && modelRef.current === null && modelStatus !== "Ready" && modelStatus !== "Loading TM model...") {
             console.log("Script exists, tmPose defined, loading model.");
             loadModel();
        } else if (!window.tmPose) {
            console.log("Script exists, waiting for tmPose...");
             // Add a timeout fallback in case onload didn't fire correctly
             const timeoutId = setTimeout(() => {
                if (window.tmPose && modelRef.current === null && modelStatus !== "Ready") {
                    console.log("Loading model after timeout fallback.");
                    loadModel();
                } else if (!window.tmPose) {
                    console.error("tmPose still not defined after timeout.");
                    setModelStatus('Error: TM library failed.');
                }
             }, 2000); // Wait 2 seconds
             // Need a way to clear this if loadModel succeeds via onload
        }
        return; // Don't add script again
    }

    console.log("Adding Teachable Machine script...");
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/pose@latest/dist/teachablemachine-pose.min.js';
    script.async = true;
    script.onload = () => {
        console.log("Teachable Machine Pose script loaded via onload.");
        loadModel(); // Load model after script is ready
    };
    script.onerror = () => {
        console.error('Failed to load Teachable Machine Pose script.');
        setModelStatus('Error loading TM library.');
    }
    document.body.appendChild(script);

    // No script cleanup needed as we check for existence
  }, [loadModel, modelStatus]); // Rerun if loadModel changes (it shouldn't due to useCallback) or modelStatus indicates an issue


  // 3. Main prediction loop (Simplified)
  const predictWebcam = useCallback(async () => {
    // Ensure everything is ready
    if (!isCameraActive || !videoRef.current || !modelRef.current || modelStatus !== "Ready") {
      if (isCameraActive && modelStatus !== "Error loading TM model.") { // Keep trying if camera active and model isn't errored
        animationFrameRef.current = requestAnimationFrame(predictWebcam);
      } else {
        animationFrameRef.current = null; // Stop loop if camera off or model error
      }
      return;
    }

    const video = videoRef.current;

    // Throttle predictions
    const now = Date.now();
    if (now - lastPredictionTime.current < predictionInterval) {
      animationFrameRef.current = requestAnimationFrame(predictWebcam);
      return;
    }
    lastPredictionTime.current = now;


    // Teachable Machine prediction
    try {
       if (video.readyState < 3) { // Ensure video has enough data to predict
          console.warn("Video not ready for prediction.");
          animationFrameRef.current = requestAnimationFrame(predictWebcam);
          return;
       }

      const prediction = await modelRef.current.predict(video);
      let highestProbability = 0;
      let predictedClass = "No Sign"; // Default to No Sign

      prediction.forEach(pred => {
        if (pred.probability > highestProbability) {
          highestProbability = pred.probability;
          predictedClass = pred.className;
        }
      });

      const confidenceThreshold = 0.85;
      if (predictedClass !== "No Sign" && highestProbability > confidenceThreshold) {
        if (predictedClass !== detectedText) {
          setDetectedText(predictedClass);
        }
      }
      // No explicit clearing for "No Sign" here, avoids flickering
      // else if (predictedClass === "No Sign" && highestProbability > confidenceThreshold) {
      //    Potential logic to clear if 'No Sign' persists
      // }

    } catch (error) {
      console.error("Error during Teachable Machine prediction:", error);
    }

    // Continue the loop only if still active
    if (isCameraActive) {
        animationFrameRef.current = requestAnimationFrame(predictWebcam);
    } else {
        animationFrameRef.current = null;
    }
  // Make sure all dependencies are listed for useCallback
  }, [isCameraActive, modelStatus, detectedText, setDetectedText]);


  // 4. Effect to manage video stream and start/stop loop
   useEffect(() => {
    let videoElement: HTMLVideoElement | null = videoRef.current;
    let loadedDataHandler = () => {}; // Define handler

    if (stream && videoElement) {
        videoElement.srcObject = stream;

        loadedDataHandler = () => {
            videoElement?.play().then(() => {
                console.log("Video playing, ensuring prediction loop starts.");
                if (!animationFrameRef.current && isCameraActive && modelStatus === "Ready") { // Start loop only if not already running
                    console.log("Requesting animation frame.");
                    lastPredictionTime.current = 0; // Reset timer
                    animationFrameRef.current = requestAnimationFrame(predictWebcam);
                }
            }).catch(err => {
                console.error("Video play failed on loadeddata:", err);
                setCameraError("Failed to play video stream.");
                setIsCameraActive(false); // Turn off camera state if play fails
                setIsDetecting(false);
            });
        };

        videoElement.addEventListener("loadeddata", loadedDataHandler);
        videoElement.play().catch(err => {
             console.warn("Initial video play attempt failed (may auto-retry on loadeddata):", err);
             // Let loadeddata handle starting the loop
        });

    } else {
        // Cleanup if stream becomes null (camera stopped)
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
            console.log("Loop cancelled due to stream removal.");
        }
         if (videoElement) {
            videoElement.srcObject = null; // Clear srcObject
        }
    }

    // Cleanup function
    return () => {
        console.log("Cleaning up video stream effect.");
        if (videoElement) {
            videoElement.removeEventListener("loadeddata", loadedDataHandler);
            console.log("Removed loadeddata listener.");
        }
         // Stop loop on cleanup
         if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
             console.log("Loop cancelled on effect cleanup.");
        }
    };
   // Re-run when stream changes or if camera activation state changes
   }, [stream, predictWebcam, isCameraActive, modelStatus]);


  const startCamera = async () => {
    if (modelStatus !== "Ready") {
        toast({ title: "Model Not Ready", description: `Status: ${modelStatus}. Please wait.`, variant: "destructive" });
        return;
    }
    try {
      setCameraError("");
      setDetectedText("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });
      setIsCameraActive(true); // Set state first
      setIsDetecting(true);
      setStream(mediaStream); // Then set stream, triggering useEffect

      toast({
        title: "Camera Starting...",
        description: "Please wait for the video feed.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to access camera";
      console.error("Error starting camera:", error);
      setCameraError(errorMessage);
      setIsCameraActive(false);
      setIsDetecting(false);
      setStream(null);

      toast({
        title: "Camera Error",
        description: "Could not start camera.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    console.log("Stop camera called.");
    setIsCameraActive(false); // Set state first to stop loop in predictWebcam
    setIsDetecting(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      console.log("Media stream tracks stopped.");
    }
    setStream(null); // Triggers useEffect cleanup
    setDetectedText("");
     // Explicitly ensure loop is cancelled
     if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        console.log("Animation frame cancelled by stopCamera.");
    }
     if (videoRef.current) {
        videoRef.current.srcObject = null;
        console.log("Video srcObject cleared by stopCamera.");
    }
  };

  // --- handleSpeak and handleCopy (no changes needed) ---
  const handleSpeak = () => { if (!detectedText) return; if (!('speechSynthesis' in window)) { toast({ title: "Not Supported", description: "Browser doesn't support text-to-speech", variant: "destructive" }); return; } window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(detectedText); const languageMap: { [key: string]: string } = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP', zh: 'zh-CN' }; utterance.lang = languageMap[selectedLanguage] || 'en-US'; utterance.onstart = () => setIsSpeaking(true); utterance.onend = () => setIsSpeaking(false); utterance.onerror = () => { setIsSpeaking(false); toast({ title: "Speech Error", variant: "destructive" }); }; window.speechSynthesis.speak(utterance); };
  const handleCopy = async () => { if (!detectedText) return; try { await navigator.clipboard.writeText(detectedText); toast({ title: "Copied!" }); } catch (error) { toast({ title: "Copy Failed", variant: "destructive" }); } };

  // --- JSX structure remains largely the same ---
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sign Language <span className="text-glow text-primary">Interpreter</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {/* Message can be dynamic based on state */}
            {isCameraActive ? "Interpreting your signs..." : "Ready to break barriers"}
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column (Detection + Camera) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detection Output */}
            <Card className="glass-strong border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Languages className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Detected Sign</h3>
                 {detectedText && (
                  <CheckCircle2 className="w-5 h-5 text-success ml-auto animate-fade-in" />
                )}
              </div>
              <div className="space-y-4">
                <div className="min-h-[180px] p-6 rounded-xl bg-card border-2 border-primary/30 flex items-center justify-center">
                  <p className={`text-center transition-opacity duration-300 ${detectedText ? 'text-5xl md:text-6xl font-bold leading-relaxed tracking-wide text-glow' : 'text-xl text-muted-foreground'}`}>
                    {detectedText ? detectedText :
                     isDetecting ? (
                        <span className="flex items-center gap-3 justify-center">
                          <Activity className="w-6 h-6 animate-pulse" />
                          Detecting...
                        </span>
                      ) : (
                        modelStatus !== "Ready" ? `Model: ${modelStatus}` : "Start Camera"
                      )}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button className="flex-1 glow-primary text-lg h-12" disabled={!detectedText || isSpeaking} onClick={handleSpeak}>
                    <Volume2 className="w-5 h-5 mr-2" />
                    {isSpeaking ? "Speaking..." : "Speak"}
                  </Button>
                  <Button variant="outline" className="glass border-primary/30 h-12" disabled={!detectedText} onClick={handleCopy}>
                    Copy
                  </Button>
                </div>
              </div>
            </Card>

            {/* Camera View */}
            <Card className="glass-strong border-secondary/20 p-6">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-secondary/30">
                 {/* Video element for camera feed */}
                 <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]" // Flip horizontally
                    style={{ opacity: isCameraActive ? 1 : 0, transition: 'opacity 0.3s' }}
                 />
                 {/* Canvas - Keep for potential future drawing, ensure it doesn't block video */}
                 <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                    style={{ opacity: 0 }} // Initially hidden, make visible if drawing needed
                 />

                {/* Overlays for when camera is active */}
                {isCameraActive && (
                  <>
                    <div className="absolute top-2 left-2 glass px-3 py-1 rounded-full flex items-center gap-2 text-xs backdrop-blur-sm shadow">
                        <Activity className="w-3 h-3 text-success animate-pulse" />
                        <span>Detecting</span>
                    </div>
                    <div className="absolute top-2 right-2 glass px-3 py-1 rounded-full flex items-center gap-2 text-xs backdrop-blur-sm shadow">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span>Live</span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Button onClick={stopCamera} variant="destructive" size="sm" className="gap-1 shadow">
                        <VideoOff className="w-3 h-3" />
                        Stop
                      </Button>
                    </div>
                  </>
                )}

                {/* Content for when camera is inactive */}
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                    <div className="text-center space-y-4 p-4">
                      {cameraError ? (
                        <>
                          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                          <p className="text-destructive font-medium">{cameraError}</p>
                          <p className="text-sm text-muted-foreground max-w-xs">Check permissions & ensure camera isn't in use.</p>
                        </>
                      ) : (
                        <>
                          <Video className="w-12 h-12 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground">{modelStatus !== "Ready" ? `Model: ${modelStatus}`: "Ready to communicate"}</p>
                        </>
                      )}
                      <Button onClick={startCamera} className="glow-secondary" disabled={modelStatus !== "Ready"}>
                        <Video className="w-4 h-4 mr-2" />
                        {modelStatus !== "Ready" ? `Loading Model...` : "Start Camera"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column (Settings & Tips) */}
          <div className="space-y-6">
             {/* Settings Card */}
            <Card className="glass-strong border-accent/20 p-6">
              <h3 className="text-xl font-bold mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="glass border-accent/30"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-accent/30 z-50">
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                      <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                      <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium mb-3">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Camera</span>
                      <span className={`font-medium ${isCameraActive ? "text-success" : "text-muted-foreground"}`}>
                        {isCameraActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Model</span>
                       <span className={`font-medium ${modelStatus === "Ready" ? "text-success" : "text-muted-foreground"}`}>
                        {modelStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Detection</span>
                       <span className={`font-medium ${isDetecting ? "text-primary" : "text-muted-foreground"}`}>
                        {isDetecting ? "Active" : "Idle"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="glass-strong border-primary/20 p-6">
              <h3 className="text-xl font-bold mb-4">Tips for Best Results</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2"><span className="text-primary text-lg">💡</span> Ensure good lighting</li>
                <li className="flex gap-2"><span className="text-primary text-lg">✋</span> Keep hands/body centered</li>
                <li className="flex gap-2"><span className="text-primary text-lg">🖼️</span> Use a plain background if possible</li>
                <li className="flex gap-2"><span className="text-primary text-lg">🎯</span> Sign clearly & steadily</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interpreter;