import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SwapRequestCard } from '../components/SwapRequestCard';
import { FeedbackForm } from '../components/FeedbackForm';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export function SwapDashboard() {
  const { user } = useAuth();
  const [incomingSwaps, setIncomingSwaps] = useState([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSwaps();
    }
  }, [user]);

  const fetchSwaps = async () => {
    if (!user) return;

    try {
      // Fetch incoming swaps
      const incomingQuery = query(
        collection(db, 'swapRequests'),
        where('toUserId', '==', user.uid)
      );
      const incomingSnapshot = await getDocs(incomingQuery);
      const incomingData = await Promise.all(
        incomingSnapshot.docs.map(async (doc) => {
          const swapData = { id: doc.id, ...doc.data() };
          // Fetch from user data
          const fromUserDoc = await getDocs(query(
            collection(db, 'users'),
            where('uid', '==', swapData.fromUserId)
          ));
          if (!fromUserDoc.empty) {
            swapData.fromUser = fromUserDoc.docs[0].data();
          }
          return swapData;
        })
      );

      // Fetch outgoing swaps
      const outgoingQuery = query(
        collection(db, 'swapRequests'),
        where('fromUserId', '==', user.uid)
      );
      const outgoingSnapshot = await getDocs(outgoingQuery);
      const outgoingData = await Promise.all(
        outgoingSnapshot.docs.map(async (doc) => {
          const swapData = { id: doc.id, ...doc.data() };
          // Fetch to user data
          const toUserDoc = await getDocs(query(
            collection(db, 'users'),
            where('uid', '==', swapData.toUserId)
          ));
          if (!toUserDoc.empty) {
            swapData.toUser = toUserDoc.docs[0].data();
          }
          return swapData;
        })
      );

      setIncomingSwaps(incomingData);
      setOutgoingSwaps(outgoingData);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      toast.error('Failed to load swap requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSwap = async (swapId) => {
    try {
      await updateDoc(doc(db, 'swapRequests', swapId), {
        status: 'accepted',
        updatedAt: new Date()
      });
      toast.success('Swap request accepted!');
      fetchSwaps();
    } catch (error) {
      console.error('Error accepting swap:', error);
      toast.error('Failed to accept swap request');
    }
  };

  const handleRejectSwap = async (swapId) => {
    try {
      await updateDoc(doc(db, 'swapRequests', swapId), {
        status: 'rejected',
        updatedAt: new Date()
      });
      toast.success('Swap request rejected');
      fetchSwaps();
    } catch (error) {
      console.error('Error rejecting swap:', error);
      toast.error('Failed to reject swap request');
    }
  };

  const handleCancelSwap = async (swapId) => {
    try {
      await updateDoc(doc(db, 'swapRequests', swapId), {
        status: 'cancelled',
        updatedAt: new Date()
      });
      toast.success('Swap request cancelled');
      fetchSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
      toast.error('Failed to cancel swap request');
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      // Add feedback to Firestore
      await addDoc(collection(db, 'feedback'), feedbackData);
      toast.success('Feedback submitted successfully!');
      setShowFeedbackForm(false);
      setSelectedSwap(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const openFeedbackForm = (swap) => {
    setSelectedSwap(swap);
    setShowFeedbackForm(true);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please sign in to view your swap dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading your swaps...</p>
        </div>
      </div>
    );
  }

  const currentSwaps = activeTab === 'incoming' ? incomingSwaps : outgoingSwaps;
  const pendingSwaps = currentSwaps.filter(swap => swap.status === 'pending');
  const acceptedSwaps = currentSwaps.filter(swap => swap.status === 'accepted');
  const completedSwaps = currentSwaps.filter(swap => 
    swap.status === 'accepted' && swap.completedAt
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Swap Dashboard</CardTitle>
            <p className="text-muted-foreground">
              Manage your skill swap requests and track your exchanges
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 border-b">
              <button
                onClick={() => setActiveTab('incoming')}
                className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'incoming'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Incoming Requests ({incomingSwaps.filter(s => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'outgoing'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Outgoing Requests ({outgoingSwaps.filter(s => s.status === 'pending').length})
              </button>
            </div>
          </CardContent>
        </Card>

        {pendingSwaps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">Pending</Badge>
                <span>Pending Requests ({pendingSwaps.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingSwaps.map((swap) => (
                <SwapRequestCard
                  key={swap.id}
                  swap={swap}
                  onAccept={handleAcceptSwap}
                  onReject={handleRejectSwap}
                  onCancel={handleCancelSwap}
                  isIncoming={activeTab === 'incoming'}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {acceptedSwaps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="default">Active</Badge>
                <span>Active Swaps ({acceptedSwaps.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {acceptedSwaps.map((swap) => (
                <div key={swap.id} className="space-y-4">
                  <SwapRequestCard
                    swap={swap}
                    onAccept={handleAcceptSwap}
                    onReject={handleRejectSwap}
                    onCancel={handleCancelSwap}
                    isIncoming={activeTab === 'incoming'}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => openFeedbackForm(swap)}
                      variant="outline"
                      size="sm"
                    >
                      Leave Feedback
                    </Button>
                    <Button
                      onClick={() => {
                        // Mark as completed
                        updateDoc(doc(db, 'swapRequests', swap.id), {
                          completedAt: new Date()
                        });
                        toast.success('Swap marked as completed!');
                        fetchSwaps();
                      }}
                      size="sm"
                    >
                      Mark Complete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {currentSwaps.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No {activeTab} swaps</h3>
              <p className="text-muted-foreground">
                {activeTab === 'incoming' 
                  ? 'You don\'t have any incoming swap requests yet.'
                  : 'You haven\'t sent any swap requests yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {showFeedbackForm && selectedSwap && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <FeedbackForm
                swapId={selectedSwap.id}
                fromUserId={selectedSwap.fromUserId}
                toUserId={selectedSwap.toUserId}
                onSubmit={handleSubmitFeedback}
                onCancel={() => {
                  setShowFeedbackForm(false);
                  setSelectedSwap(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 