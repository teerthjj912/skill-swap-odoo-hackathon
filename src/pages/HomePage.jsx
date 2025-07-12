import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Connect with Experts',
      description: 'Find people with the skills you want to learn and share your expertise in return.'
    },
    {
      icon: BookOpen,
      title: 'Learn New Skills',
      description: 'Exchange knowledge through one-on-one sessions, workshops, or online meetings.'
    },
    {
      icon: MessageSquare,
      title: 'Easy Communication',
      description: 'Built-in messaging and scheduling to coordinate your skill swaps seamlessly.'
    },
    {
      icon: Star,
      title: 'Build Reputation',
      description: 'Earn feedback and ratings to build trust within the community.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-lg float-animation-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl float-animation-delayed-2"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-secondary/10 rounded-full blur-lg pulse-glow"></div>
        
        {/* Rotating elements */}
        <div className="absolute top-1/2 left-5 w-16 h-16 border border-primary/20 rounded-full rotate-slow"></div>
        <div className="absolute top-1/3 right-10 w-12 h-12 border border-secondary/20 rounded-full rotate-slow" style={{ animationDirection: 'reverse' }}></div>
        
        {/* Background patterns */}
        <div className="absolute inset-0 bg-wavy-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-dots-pattern opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-in slide-in-from-top">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Swap Skills,{' '}
              <span className="text-primary">Grow Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with people who have the skills you want to learn. 
              Share your expertise and build meaningful relationships through skill exchange.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <>
                <Link to="/search">
                  <Button size="lg" className="group shadow-lg hover:shadow-xl">
                    Find Skills
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                    Complete Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="group shadow-lg hover:shadow-xl">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                    Browse Skills
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section with Dynamic Carousel */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-in slide-in-from-top">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Skill Swap makes it easy to find learning partners and exchange knowledge 
              in a safe, supportive environment.
            </p>
          </div>
          
          {/* Dynamic Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex carousel-scroll">
              {/* First set of cards */}
              {features.map((feature, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 w-80 mx-4">
                  <Card className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 group h-full glass-effect">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                        <feature.icon className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {features.map((feature, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 w-80 mx-4">
                  <Card className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 group h-full glass-effect">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                        <feature.icon className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-24 relative">
        <div className="absolute inset-0 bg-wavy-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="animate-in slide-in-from-bottom bounce-subtle" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">500+</div>
              <div className="text-lg text-muted-foreground font-medium">Active Users</div>
            </div>
            <div className="animate-in slide-in-from-bottom bounce-subtle" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">1,200+</div>
              <div className="text-lg text-muted-foreground font-medium">Skills Offered</div>
            </div>
            <div className="animate-in slide-in-from-bottom bounce-subtle" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">4.8</div>
              <div className="text-lg text-muted-foreground font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Card className="max-w-3xl mx-auto shadow-xl animate-in scale-in glass-effect">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Ready to Start Swapping?</CardTitle>
              <p className="text-lg text-muted-foreground">
                Join our community and discover the power of skill exchange.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {user ? (
                <div className="space-y-6">
                  <p className="text-base text-muted-foreground">
                    Welcome back, <span className="font-semibold text-foreground">{user.name}</span>! Ready to find your next skill swap?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/search">
                      <Button size="lg" className="shadow-lg hover:shadow-xl">
                        Find Skills to Learn
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-base text-muted-foreground">
                    Create your profile and start connecting with other learners today.
                  </p>
                  <Link to="/login">
                    <Button size="lg" className="shadow-lg hover:shadow-xl">
                      Join Skill Swap
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 