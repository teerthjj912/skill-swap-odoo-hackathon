import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      // Fetch swap requests
      const swapsSnapshot = await getDocs(collection(db, 'swapRequests'));
      const swapsData = swapsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSwapRequests(swapsData);

      // Fetch announcements
      const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
      const announcementsData = announcementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const banUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBanned: true,
        bannedAt: new Date()
      });
      toast.success('User banned successfully');
      fetchData();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const unbanUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBanned: false,
        bannedAt: null
      });
      toast.success('User unbanned successfully');
      fetchData();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    try {
      await addDoc(collection(db, 'announcements'), {
        ...newAnnouncement,
        createdAt: new Date(),
        createdBy: user.uid
      });
      setNewAnnouncement({ title: '', message: '' });
      toast.success('Announcement created successfully');
      fetchData();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      await deleteDoc(doc(db, 'announcements', announcementId));
      toast.success('Announcement deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = {
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        location: user.location,
        skillsOffered: user.skillsOffered?.join(', ') || '',
        skillsWanted: user.skillsWanted?.join(', ') || '',
        isBanned: user.isBanned ? 'Yes' : 'No',
        createdAt: user.createdAt?.toDate?.()?.toISOString() || ''
      })),
      swaps: swapRequests.map(swap => ({
        fromUser: swap.fromUserId,
        toUser: swap.toUserId,
        status: swap.status,
        createdAt: swap.createdAt?.toDate?.()?.toISOString() || ''
      }))
    };

    // Download CSV files
    const downloadCSV = (data, filename) => {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    if (csvData.users.length > 0) {
      downloadCSV(csvData.users, 'users-export.csv');
    }
    if (csvData.swaps.length > 0) {
      downloadCSV(csvData.swaps, 'swaps-export.csv');
    }

    toast.success('Data exported successfully');
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admin Panel</CardTitle>
                <p className="text-muted-foreground">
                  Manage users, monitor swaps, and create announcements
                </p>
              </div>
              <Button onClick={exportData} variant="outline">
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 border-b">
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('swaps')}
                className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'swaps'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Swap Requests ({swapRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'announcements'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Announcements ({announcements.length})
              </button>
            </div>
          </CardContent>
        </Card>

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((userData) => (
                  <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold">{userData.name}</h3>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                        {userData.location && (
                          <p className="text-sm text-muted-foreground">{userData.location}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {userData.isBanned && (
                          <Badge variant="destructive">Banned</Badge>
                        )}
                        {userData.isAdmin && (
                          <Badge variant="default">Admin</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {userData.isBanned ? (
                        <Button
                          onClick={() => unbanUser(userData.id)}
                          variant="outline"
                          size="sm"
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          onClick={() => banUser(userData.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Ban
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'swaps' && (
          <Card>
            <CardHeader>
              <CardTitle>Swap Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {swapRequests.map((swap) => (
                  <div key={swap.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {swap.fromUserId} → {swap.toUserId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: {swap.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {swap.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                        </p>
                      </div>
                      <Badge variant={
                        swap.status === 'pending' ? 'secondary' :
                        swap.status === 'accepted' ? 'default' :
                        swap.status === 'rejected' ? 'destructive' : 'outline'
                      }>
                        {swap.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'announcements' && (
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={createAnnouncement} className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium">Create New Announcement</h3>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title"
                />
                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Announcement message"
                  className="w-full h-24 px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <Button type="submit" disabled={!newAnnouncement.title.trim() || !newAnnouncement.message.trim()}>
                  Create Announcement
                </Button>
              </form>

              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {announcement.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                        </p>
                      </div>
                      <Button
                        onClick={() => deleteAnnouncement(announcement.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 