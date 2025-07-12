import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkillCard } from '../components/SkillCard';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export function SearchPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const AVAILABILITY_OPTIONS = ['Weekends', 'Evenings', 'Weekdays', 'Mornings'];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedAvailability]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from Firestore...');
      const usersRef = collection(db, 'users');
      
      // Try with filters first
      try {
        const q = query(
          usersRef,
          where('isPublic', '==', true),
          where('isBanned', '==', false),
          orderBy('name')
        );
        
        console.log('Executing filtered query...');
        const querySnapshot = await getDocs(q);
        console.log('Filtered query completed, processing results...');
        
        const usersData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(userData => userData.uid !== user?.uid); // Exclude current user
        
        console.log('Users loaded:', usersData.length);
        setUsers(usersData);
      } catch (filterError) {
        console.log('Filtered query failed, trying simple query...', filterError);
        
        // Fallback to simple query without filters
        const simpleQuery = query(usersRef);
        const querySnapshot = await getDocs(simpleQuery);
        
        const usersData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(userData => 
            userData.uid !== user?.uid && 
            userData.isPublic !== false && 
            userData.isBanned !== true
          );
        
        console.log('Users loaded with simple query:', usersData.length);
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      toast.error(`Failed to load users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.skillsOffered?.some(skill => skill.toLowerCase().includes(term)) ||
        user.skillsWanted?.some(skill => skill.toLowerCase().includes(term)) ||
        user.location?.toLowerCase().includes(term)
      );
    }

    // Filter by availability
    if (selectedAvailability.length > 0) {
      filtered = filtered.filter(user =>
        selectedAvailability.some(availability =>
          user.availability?.includes(availability)
        )
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSwapRequest = (targetUser) => {
    if (!user) {
      toast.error('Please sign in to request a swap');
      return;
    }

    // Navigate to swap request modal or page
    // For now, just show a toast
    toast.success(`Swap request sent to ${targetUser.name}!`);
  };

  const toggleAvailabilityFilter = (availability) => {
    setSelectedAvailability(prev =>
      prev.includes(availability)
        ? prev.filter(item => item !== availability)
        : [...prev, availability]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAvailability([]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="animate-in slide-in-from-top">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Find Skills to Swap</CardTitle>
            <p className="text-lg text-muted-foreground">
              Discover people with skills you want to learn and offer your expertise in return
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, skills, or location..."
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="icon"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {showFilters && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter by Availability</h4>
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleAvailabilityFilter(option)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedAvailability.includes(option)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </span>
              {(searchTerm || selectedAvailability.length > 0) && (
                <span>
                  Filtered from {users.length} total users
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedAvailability.length > 0
                  ? 'Try adjusting your search criteria or filters'
                  : 'No public users available at the moment'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userData) => (
              <SkillCard
                key={userData.id}
                user={userData}
                onSwapRequest={handleSwapRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 