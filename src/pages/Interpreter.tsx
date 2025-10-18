import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Volume2, Languages, Activity } from "lucide-react";

const Interpreter = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const mockDetection = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setDetectedText("Hello, how are you?");
      setIsDetecting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sign Language <span className="text-glow text-secondary">Interpreter</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time gesture detection and translation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Webcam Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-strong border-white/10 p-6">
              <div className="relative aspect-video bg-muted/20 rounded-xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Video className="w-16 h-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Camera preview will appear here</p>
                    <Button onClick={mockDetection} className="glow-primary">
                      <Video className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                </div>
                
                {/* Status Indicator */}
                {isDetecting && (
                  <div className="absolute top-4 left-4 glass px-4 py-2 rounded-full flex items-center gap-2 animate-pulse-glow">
                    <Activity className="w-4 h-4 text-secondary animate-pulse" />
                    <span className="text-sm font-medium">Detecting Signs...</span>
                  </div>
                )}
                
                {/* Predicted Text Overlay */}
                {detectedText && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-strong p-4 rounded-xl border border-secondary/50 glow-secondary animate-slide-in-up">
                      <p className="text-lg font-medium text-secondary">{detectedText}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Translation Panel */}
            <Card className="glass-strong border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Languages className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Translation</h3>
              </div>
              
              <div className="space-y-4">
                <div className="min-h-[120px] p-4 rounded-xl bg-muted/10 border border-white/10">
                  {detectedText ? (
                    <p className="text-lg">{detectedText}</p>
                  ) : (
                    <p className="text-muted-foreground">Translated text will appear here...</p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 glow-secondary"
                    disabled={!detectedText}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Speak
                  </Button>
                  <Button 
                    variant="outline" 
                    className="glass"
                    disabled={!detectedText}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="glass-strong border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Language
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-white/10">
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
                  <h4 className="text-sm font-medium mb-3">Detection Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Camera</span>
                      <span className="text-destructive">Inactive</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Model</span>
                      <span className="text-secondary">Ready</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="text-foreground">--</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-strong border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-secondary">•</span>
                  <span>Ensure good lighting for better detection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">•</span>
                  <span>Keep hands visible and centered</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">•</span>
                  <span>Sign at a moderate pace</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">•</span>
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
