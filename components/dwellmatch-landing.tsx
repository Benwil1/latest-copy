"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Star, Users, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function DwellMatchLanding() {
  const features: FeatureProps[] = [
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: "Smart Matching",
      description: "Our AI-powered algorithm finds your perfect roommate based on lifestyle, habits, and preferences."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Easy Communication",
      description: "Chat directly with potential roommates and get to know them better before making any commitments."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Verified Profiles",
      description: "Every user is verified through our comprehensive background check system for your safety and peace of mind."
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Compatibility Score",
      description: "See at a glance how well you'll get along with potential roommates with our unique compatibility rating."
    }
  ];

  const testimonials: TestimonialProps[] = [
    {
      quote: "DwellMatch helped me find a roommate who shares my love for quiet evenings and clean spaces. We've been living together for 6 months now without a single argument!",
      author: "Sarah Johnson",
      role: "Graduate Student",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop"
    },
    {
      quote: "After a string of terrible roommate experiences, DwellMatch connected me with someone who perfectly complements my lifestyle. The compatibility score was spot on!",
      author: "Michael Chen",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop"
    },
    {
      quote: "As someone new to the city, DwellMatch made finding a roommate stress-free. I was matched with someone who had similar interests and budget requirements.",
      author: "Olivia Rodriguez",
      role: "Marketing Specialist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">


      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#ff6b0020,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#ff6b0015,transparent_50%)]" />
        </div>

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 text-sm" variant="outline">Find Your Perfect Match</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Find Your <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Perfect Roommate</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Swipe, match, and connect with potential roommates who match your lifestyle and budget. No more roommate horror stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link href="/login">
                    I Already Have an Account
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Profile cards stack */}
              <div className="relative w-full max-w-sm h-[500px] mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-96">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-full h-full bg-card rounded-3xl shadow-lg transform -rotate-6 transition-transform hover:rotate-0 overflow-hidden">
                      <div className="relative w-full h-full">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
                          alt="Profile example"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-semibold mb-1">Olivia, 25</h3>
                          <p className="text-lg text-white/90 mb-3">
                            Downtown • $1300/mo
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Student
                            </span>
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Clean
                            </span>
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Early bird
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-96">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-full h-full bg-card rounded-3xl shadow-lg transform rotate-3 transition-transform hover:rotate-0 overflow-hidden">
                      <div className="relative w-full h-full">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
                          alt="Profile example"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-semibold mb-1">Sarah, 26</h3>
                          <p className="text-lg text-white/90 mb-3">
                            Downtown • $1200/mo
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Professional
                            </span>
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Pet-friendly
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-96">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-full h-full bg-card rounded-3xl shadow-lg transform transition-transform hover:rotate-0 overflow-hidden">
                      <div className="relative w-full h-full">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
                          alt="Profile example"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-semibold mb-1">Michael, 28</h3>
                          <p className="text-lg text-white/90 mb-3">
                            Midtown • $1500/mo
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Student
                            </span>
                            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              Night owl
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Find the Perfect Roommate</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to make finding a compatible roommate as easy and stress-free as possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Finding a Roommate Made Simple</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes finding your ideal roommate quick and easy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and create a detailed profile about your lifestyle, preferences, and what you're looking for in a roommate.
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">2</div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Matches</h3>
              <p className="text-muted-foreground">
                Our algorithm will suggest potential roommates based on compatibility, location preferences, and budget.
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">3</div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Meet</h3>
              <p className="text-muted-foreground">
                Chat with your matches, arrange meetups, and find your perfect roommate match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thousands of people have found their perfect roommate through DwellMatch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  {testimonial.avatar && (
                    <div className="mr-4">
                      <div className="relative w-12 h-12">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author} 
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup" className="py-16 md:py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6">Ready to Find Your Perfect Roommate?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied users who have found their ideal living situation through DwellMatch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/signup">
                Sign Up Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/login">
                I Already Have an Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4 md:mb-0">
              DwellMatch
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2025 DwellMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
