import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Code, Github, Mail, ExternalLink } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-glow text-secondary">Silent Voices</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Breaking barriers, building bridges through technology
          </p>
        </div>

        {/* Mission Section */}
        <Card className="glass-strong border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/20 glow-primary">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              At <span className="text-foreground font-semibold">Silent Voices</span>, we believe that 
              communication is a fundamental human right. Our mission is to empower the deaf and 
              hard-of-hearing community by leveraging cutting-edge AI technology to break down 
              communication barriers.
            </p>
            <p>
              We envision a world where sign language is instantly understood, where every gesture 
              carries a voice, and where accessibility is not an afterthought but a core principle 
              of design.
            </p>
            <p>
              Through real-time sign language interpretation powered by advanced machine learning, 
              we're making everyday communication seamless, inclusive, and accessible to everyone.
            </p>
          </div>
        </Card>

        {/* Technology Section */}
        <Card className="glass-strong border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-secondary/20 glow-secondary">
              <Code className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold">Our Technology</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Silent Voices uses state-of-the-art computer vision and natural language processing 
              to interpret sign language gestures in real-time. Our technology stack includes:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl border border-white/10">
                <h3 className="font-semibold text-lg mb-2 text-primary">Computer Vision</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced hand tracking and gesture recognition using deep learning models
                </p>
              </div>
              
              <div className="glass p-4 rounded-xl border border-white/10">
                <h3 className="font-semibold text-lg mb-2 text-primary">NLP Translation</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-language neural translation for global accessibility
                </p>
              </div>
              
              <div className="glass p-4 rounded-xl border border-white/10">
                <h3 className="font-semibold text-lg mb-2 text-secondary">Real-time Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Low-latency inference for seamless conversation flow
                </p>
              </div>
              
              <div className="glass p-4 rounded-xl border border-white/10">
                <h3 className="font-semibold text-lg mb-2 text-secondary">Text-to-Speech</h3>
                <p className="text-sm text-muted-foreground">
                  Natural-sounding voice synthesis in multiple languages
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Section */}
        <Card className="glass-strong border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/20 glow-primary">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Our Team</h2>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Silent Voices is built by a passionate team of engineers, designers, and accessibility 
            advocates dedicated to creating technology that truly makes a difference. We work closely 
            with the deaf community to ensure our solutions meet real needs.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <div className="glass px-4 py-2 rounded-full border border-white/10">
              <span className="text-sm">🧑‍💻 Engineers</span>
            </div>
            <div className="glass px-4 py-2 rounded-full border border-white/10">
              <span className="text-sm">🎨 Designers</span>
            </div>
            <div className="glass px-4 py-2 rounded-full border border-white/10">
              <span className="text-sm">♿ Accessibility Experts</span>
            </div>
            <div className="glass px-4 py-2 rounded-full border border-white/10">
              <span className="text-sm">🤝 Community Members</span>
            </div>
          </div>
        </Card>

        {/* Open Source Section */}
        <Card className="glass-strong border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-secondary/20 glow-secondary">
              <Github className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold">Open Source</h2>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We believe in the power of open collaboration. Silent Voices is an open-source project, 
            welcoming contributions from developers, researchers, and advocates worldwide.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="glow-primary">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="glass">
              Contribute
            </Button>
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="glass-strong border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/20 glow-primary">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Get in Touch</h2>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Have questions, feedback, or want to collaborate? We'd love to hear from you!
          </p>
          
          <div className="space-y-3">
            <Button className="w-full justify-start glow-secondary">
              <Mail className="w-4 h-4 mr-3" />
              contact@silentvoices.app
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
