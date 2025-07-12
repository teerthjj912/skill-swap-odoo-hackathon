import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const AVAILABILITY_OPTIONS = ['Weekends', 'Evenings', 'Weekdays', 'Mornings'];

export function ProfilePage() {
  const { user, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [wantedSkillInput, setWantedSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (user) {
      console.log('ProfilePage: User data updated:', {
        uid: user.uid,
        name: user.name,
        skillsOffered: user.skillsOffered?.length || 0,
        skillsWanted: user.skillsWanted?.length || 0,
        availability: user.availability?.length || 0
      });
      
      setValue('name', user.name || '');
      setValue('location', user.location || '');
      setValue('isPublic', user.isPublic !== false);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: data.name,
        location: data.location,
        isPublic: data.isPublic,
        updatedAt: new Date()
      });

      // Refresh user data to update the UI immediately
      await refreshUserData();
      
      toast.success('Profile updated successfully!', { duration: 2000 });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkillOffered = async () => {
    if (!skillInput.trim() || !user) return;

    const newSkills = [...(user.skillsOffered || []), skillInput.trim()];
    await updateDoc(doc(db, 'users', user.uid), {
      skillsOffered: newSkills
    });
    setSkillInput('');
    await refreshUserData(); // Refresh user data to update UI
    toast.success('Skill added!', { duration: 2000 });
  };

  const removeSkillOffered = async (skillToRemove) => {
    if (!user) return;

    const newSkills = user.skillsOffered?.filter(skill => skill !== skillToRemove) || [];
    await updateDoc(doc(db, 'users', user.uid), {
      skillsOffered: newSkills
    });
    await refreshUserData(); // Refresh user data to update UI
    toast.success('Skill removed!', { duration: 2000 });
  };

  const addSkillWanted = async () => {
    if (!wantedSkillInput.trim() || !user) return;

    const newSkills = [...(user.skillsWanted || []), wantedSkillInput.trim()];
    await updateDoc(doc(db, 'users', user.uid), {
      skillsWanted: newSkills
    });
    setWantedSkillInput('');
    await refreshUserData(); // Refresh user data to update UI
    toast.success('Skill wanted added!', { duration: 2000 });
  };

  const removeSkillWanted = async (skillToRemove) => {
    if (!user) return;

    const newSkills = user.skillsWanted?.filter(skill => skill !== skillToRemove) || [];
    await updateDoc(doc(db, 'users', user.uid), {
      skillsWanted: newSkills
    });
    await refreshUserData(); // Refresh user data to update UI
    toast.success('Skill wanted removed!', { duration: 2000 });
  };

  const toggleAvailability = async (option) => {
    if (!user) return;

    const currentAvailability = user.availability || [];
    const newAvailability = currentAvailability.includes(option)
      ? currentAvailability.filter(item => item !== option)
      : [...currentAvailability, option];

    await updateDoc(doc(db, 'users', user.uid), {
      availability: newAvailability
    });
    await refreshUserData(); // Refresh user data to update UI
    toast.success('Availability updated!', { duration: 2000 });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="animate-in slide-in-from-top">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Profile</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
                className="shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Your name"
                    disabled={!isEditing}
                    className="mb-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                  <Input
                    {...register('location')}
                    placeholder="Location (optional)"
                    disabled={!isEditing}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isPublic')}
                  disabled={!isEditing}
                  className="rounded"
                />
                <label className="text-sm">
                  Make my profile public
                </label>
                {user.isPublic ? (
                  <Eye className="w-4 h-4 text-green-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {isEditing && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills I Can Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill you can teach"
                onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
              />
              <Button onClick={addSkillOffered} disabled={!skillInput.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkillOffered(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills I Want to Learn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={wantedSkillInput}
                onChange={(e) => setWantedSkillInput(e.target.value)}
                placeholder="Add a skill you want to learn"
                onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
              />
              <Button onClick={addSkillWanted} disabled={!wantedSkillInput.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted?.map((skill, index) => (
                <Badge key={index} variant="outline" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkillWanted(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABILITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleAvailability(option)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    user.availability?.includes(option)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 