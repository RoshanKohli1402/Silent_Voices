import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Volume2, Languages, Activity, VideoOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Interpreter = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraError, setCameraError] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        
        toast({
          title: "Camera Active!",
          description: "Ready to detect your signs",
        });

        // Mock detection for now - will be replaced with real AI
        setTimeout(() => {
          setIsDetecting(true);
          setTimeout(() => {
            setDetectedText("Hello, how are you?");
            setIsDetecting(false);
          }, 2000);
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to access camera";
      setCameraError(errorMessage);
      
      toast({
        title: "Camera Error",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsDetecting(false);
  };

  const handleSpeak = () => {
    if (!detectedText) return;

    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive",
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(detectedText);
    
    // Set language based on selection
    const languageMap: { [key: string]: string } = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
      zh: 'zh-CN',
    };
    utterance.lang = languageMap[selectedLanguage] || 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to speak the text",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    if (!detectedText) return;
    
    try {
      await navigator.clipboard.writeText(detectedText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sign Language <span className="text-glow text-primary">Interpreter</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Every sign deserves to be heard — let's break barriers together
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Translation Panel & Camera */}
          <div className="lg:col-span-2 space-y-6">
            {/* Translation Panel - Primary Focus */}
            <Card className="glass-strong border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Languages className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Your Voice</h3>
                {detectedText && (
                  <CheckCircle2 className="w-5 h-5 text-success ml-auto animate-fade-in" />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="min-h-[180px] p-6 rounded-xl bg-card border-2 border-primary/30 flex items-center justify-center">
                  {detectedText ? (
                    <p className="text-3xl md:text-4xl font-bold text-center leading-relaxed tracking-wide text-glow">
                      {detectedText}
                    </p>
                  ) : (
                    <p className="text-xl text-muted-foreground text-center">
                      {isDetecting ? (
                        <span className="flex items-center gap-3 justify-center">
                          <Activity className="w-6 h-6 animate-pulse" />
                          Detecting your signs...
                        </span>
                      ) : (
                        "Start camera to begin translating"
                      )}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 glow-primary text-lg h-12"
                    disabled={!detectedText || isSpeaking}
                    onClick={handleSpeak}
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    {isSpeaking ? "Speaking..." : "Speak"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="glass border-primary/30 h-12"
                    disabled={!detectedText}
                    onClick={handleCopy}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </Card>

            {/* Camera Section */}
            <Card className="glass-strong border-secondary/20 p-6">
              <div className="relative aspect-video bg-muted/20 rounded-xl overflow-hidden border-2 border-secondary/30">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Indicator */}
                    {isDetecting && (
                      <div className="absolute top-4 left-4 glass px-4 py-2 rounded-full flex items-center gap-2 glow-success animate-fade-in">
                        <Activity className="w-4 h-4 text-success animate-pulse" />
                        <span className="text-sm font-medium">Great! Detecting signs...</span>
                      </div>
                    )}
                    
                    {/* Active indicator */}
                    <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Live</span>
                    </div>

                    {/* Stop button */}
                    <div className="absolute bottom-4 left-4">
                      <Button onClick={stopCamera} variant="destructive" className="gap-2">
                        <VideoOff className="w-4 h-4" />
                        Stop Camera
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      {cameraError ? (
                        <>
                          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                          <p className="text-destructive font-medium">Camera Access Denied</p>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Please allow camera permissions in your browser settings
                          </p>
                        </>
                      ) : (
                        <>
                          <Video className="w-16 h-16 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground">Ready to help you communicate</p>
                        </>
                      )}
                      <Button onClick={startCamera} className="glow-secondary">
                        <Video className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="glass-strong border-accent/20 p-6">
              <h3 className="text-xl font-bold mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Language
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="glass border-accent/30">
                      <SelectValue />
                    </SelectTrigger>
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
                      <span className={isCameraActive ? "text-success font-medium" : "text-muted-foreground"}>
                        {isCameraActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Model</span>
                      <span className="text-success font-medium">Ready</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Detection</span>
                      <span className={isDetecting ? "text-primary font-medium" : "text-muted-foreground"}>
                        {isDetecting ? "Active" : "Idle"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-strong border-primary/20 p-6">
              <h3 className="text-xl font-bold mb-4">Tips for Best Results</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary text-lg">💡</span>
                  <span>Ensure good lighting for clear detection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary text-lg">✋</span>
                  <span>Keep hands visible and centered</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary text-lg">⏱️</span>
                  <span>Sign at a comfortable, moderate pace</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary text-lg">🎯</span>
                  <span>Use clear, distinct gestures</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interpreter;
