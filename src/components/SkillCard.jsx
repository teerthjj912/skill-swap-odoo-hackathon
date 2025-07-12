import { User, MapPin, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export function SkillCard({ user, onSwapRequest }) {
  const availabilityColors = {
    'Weekends': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Evenings': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Weekdays': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Mornings': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in scale-in group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/40"
              />
            ) : (
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-foreground">{user.name}</h3>
              {user.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Skills Offered</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered?.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {user.skillsOffered?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.skillsOffered.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Skills Wanted</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted?.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {user.skillsWanted?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.skillsWanted.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {user.availability && user.availability.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Availability
            </h4>
            <div className="flex flex-wrap gap-1">
              {user.availability.map((time, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${availabilityColors[time] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => onSwapRequest(user)}
          className="w-full shadow-md hover:shadow-lg transition-all duration-200"
          size="sm"
        >
          Request Swap
        </Button>
      </CardContent>
    </Card>
  );
} 