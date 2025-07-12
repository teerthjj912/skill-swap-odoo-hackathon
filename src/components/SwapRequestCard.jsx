import { User, Calendar, MessageSquare, Check, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const statusIcons = {
  pending: Clock,
  accepted: Check,
  rejected: X,
  cancelled: X,
};

export function SwapRequestCard({ swap, onAccept, onReject, onCancel, isIncoming = false }) {
  const StatusIcon = statusIcons[swap.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {swap.fromUser?.photoURL ? (
              <img
                src={swap.fromUser.photoURL}
                alt={swap.fromUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">
                {isIncoming ? swap.fromUser?.name : swap.toUser?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isIncoming ? 'wants to swap with you' : 'you want to swap with'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-4 h-4" />
            <Badge className={statusColors[swap.status]}>
              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Skills Offered</h4>
            <div className="flex flex-wrap gap-1">
              {swap.skillsOffered?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Skills Requested</h4>
            <div className="flex flex-wrap gap-1">
              {swap.skillsRequested?.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {swap.message && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{swap.message}</p>
            </div>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          Requested on {format(swap.createdAt?.toDate() || new Date(), 'MMM dd, yyyy')}
        </div>

        {swap.status === 'pending' && (
          <div className="flex space-x-2">
            {isIncoming ? (
              <>
                <Button
                  onClick={() => onAccept(swap.id)}
                  className="flex-1"
                  size="sm"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={() => onReject(swap.id)}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onCancel(swap.id)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}

        {swap.status === 'accepted' && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              Swap accepted! Contact each other to arrange the details.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 