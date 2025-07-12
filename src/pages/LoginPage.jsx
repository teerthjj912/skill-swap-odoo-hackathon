import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chrome, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/profile');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    try {
      await signInAsGuest();
      navigate('/profile');
    } catch (error) {
      console.error('Guest sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md animate-in scale-in">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <span className="text-primary-foreground font-bold text-3xl">SS</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Welcome to Skill Swap</CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              Connect with others to exchange skills and knowledge
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  Or
                </span>
              </div>
            </div>

            <Button
              onClick={handleGuestSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <User className="w-5 h-5 mr-2" />
              Continue as Guest
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 