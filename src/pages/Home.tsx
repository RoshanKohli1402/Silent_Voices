import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Hand, Languages, Volume2, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Every Sign Has a{" "}
              <span className="text-glow text-secondary">Voice</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Breaking communication barriers with AI-powered sign language
              interpretation. Real-time translation from gestures to text and speech.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/interpreter">
                <Button size="lg" className="glow-primary group text-lg px-8">
                  Start Interpreting
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="glass text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-3xl opacity-30"></div>
            <img
              src={heroImage}
              alt="Sign language interpretation"
              className="relative rounded-3xl border border-white/10 glass-strong"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powered by <span className="text-glow text-secondary">AI</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Seamless communication through advanced technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-strong p-8 rounded-2xl border border-white/10 hover:glow-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
              <Hand className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time Detection</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced AI detects and interprets sign language gestures instantly
              with high accuracy.
            </p>
          </div>

          <div className="glass-strong p-8 rounded-2xl border border-white/10 hover:glow-secondary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
              <Languages className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Multilingual Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Translate sign language into multiple spoken languages instantly.
            </p>
          </div>

          <div className="glass-strong p-8 rounded-2xl border border-white/10 hover:glow-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
              <Volume2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Text-to-Speech</h3>
            <p className="text-muted-foreground leading-relaxed">
              Natural-sounding voice output brings your signs to life with clarity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="glass-strong rounded-3xl p-12 md:p-16 text-center border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-secondary mx-auto mb-6 animate-pulse-glow" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the future of accessible communication. No downloads,
              no setup—just instant interpretation.
            </p>
            <Link to="/interpreter">
              <Button size="lg" className="glow-secondary text-lg px-10">
                Try It Now
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
