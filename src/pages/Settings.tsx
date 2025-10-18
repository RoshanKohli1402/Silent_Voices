import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings as SettingsIcon, Languages, Volume2, Palette, Accessibility } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-glow text-secondary">Settings</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <Card className="glass-strong border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/20">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Language Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="default-language" className="text-base mb-2 block">
                  Default Translation Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger id="default-language" className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                    <SelectItem value="fr">🇫🇷 French</SelectItem>
                    <SelectItem value="de">🇩🇪 German</SelectItem>
                    <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                    <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                    <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                    <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sign-language" className="text-base mb-2 block">
                  Sign Language Type
                </Label>
                <Select defaultValue="asl">
                  <SelectTrigger id="sign-language" className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="asl">ASL (American Sign Language)</SelectItem>
                    <SelectItem value="bsl">BSL (British Sign Language)</SelectItem>
                    <SelectItem value="isl">ISL (Indian Sign Language)</SelectItem>
                    <SelectItem value="jsl">JSL (Japanese Sign Language)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="glass-strong border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-secondary/20">
                <Volume2 className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Audio Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="voice" className="text-base mb-2 block">
                  Voice Type
                </Label>
                <Select defaultValue="female">
                  <SelectTrigger id="voice" className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="female">Female Voice</SelectItem>
                    <SelectItem value="male">Male Voice</SelectItem>
                    <SelectItem value="neutral">Neutral Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="volume" className="text-base">
                    Volume
                  </Label>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Slider
                  id="volume"
                  defaultValue={[75]}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="speed" className="text-base">
                    Speech Speed
                  </Label>
                  <span className="text-sm text-muted-foreground">1.0x</span>
                </div>
                <Slider
                  id="speed"
                  defaultValue={[1]}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-speak" className="text-base">
                    Auto-Speak Translations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically speak detected text
                  </p>
                </div>
                <Switch id="auto-speak" />
              </div>
            </div>
          </Card>

          {/* Accessibility Settings */}
          <Card className="glass-strong border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/20">
                <Accessibility className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Accessibility</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="text-base">
                    High Contrast Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase text and UI contrast
                  </p>
                </div>
                <Switch id="high-contrast" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text" className="text-base">
                    Large Text
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase default text size
                  </p>
                </div>
                <Switch id="large-text" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader" className="text-base">
                    Screen Reader Optimized
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enhanced screen reader support
                  </p>
                </div>
                <Switch id="screen-reader" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduce-motion" className="text-base">
                    Reduce Motion
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations
                  </p>
                </div>
                <Switch id="reduce-motion" />
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="glass-strong border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-secondary/20">
                <Palette className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Display</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="gesture-overlay" className="text-base">
                    Gesture Detection Overlay
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show visual feedback for detected gestures
                  </p>
                </div>
                <Switch id="gesture-overlay" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="glow-effects" className="text-base">
                    Glow Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable neon glow animations
                  </p>
                </div>
                <Switch id="glow-effects" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confidence-meter" className="text-base">
                    Confidence Meter
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show detection accuracy percentage
                  </p>
                </div>
                <Switch id="confidence-meter" defaultChecked />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
