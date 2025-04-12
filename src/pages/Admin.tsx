
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  User, 
  UserCheck, 
  Search,
  MoreHorizontal,
  School,
  MapPin,
  BookOpen,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_approved: boolean;
  created_at: string;
  user_metadata?: {
    country?: string;
    state?: string;
    school?: string;
    grade?: string;
    preferred_subjects?: string[];
    learning_style?: string;
  };
}

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  // For now, we'll use a hardcoded admin email
  // In a real app, you would use a more sophisticated admin check
  const ADMIN_EMAIL = 'admin@example.com';

  // Check if current user is admin
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        // First get profiles with approval status
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) {
          throw profilesError;
        }

        // Then get user metadata from auth
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          throw authError;
        }

        // Combine the data
        const combinedData = profilesData.map(profile => {
          const authUser = authData.users.find(u => u.id === profile.id);
          return {
            ...profile,
            user_metadata: authUser?.user_metadata || {}
          };
        });
        
        const pending = combinedData.filter(user => !user.is_approved);
        const approved = combinedData.filter(user => user.is_approved);
        
        setPendingUsers(pending);
        setApprovedUsers(approved);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const approveUser = async (userId: string) => {
    setProcessing(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      setApprovedUsers(prev => {
        const user = pendingUsers.find(user => user.id === userId);
        if (user) {
          return [...prev, { ...user, is_approved: true }];
        }
        return prev;
      });
      
      toast({
        title: 'Success',
        description: 'User has been approved',
      });
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve user',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const revokeAccess = async (userId: string) => {
    setProcessing(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setApprovedUsers(prev => prev.filter(user => user.id !== userId));
      setPendingUsers(prev => {
        const user = approvedUsers.find(user => user.id === userId);
        if (user) {
          return [...prev, { ...user, is_approved: false }];
        }
        return prev;
      });
      
      toast({
        title: 'Success',
        description: 'User access has been revoked',
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke user access',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const viewUserDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const filteredPendingUsers = pendingUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredApprovedUsers = approvedUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center bg-background rounded-lg border px-3 py-2 w-64">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0 text-sm"
          />
        </div>
      </div>
      
      {showUserDetail && selectedUser ? (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedUser.full_name || 'No name'}</CardTitle>
              <CardDescription>{selectedUser.email}</CardDescription>
            </div>
            <Button variant="ghost" onClick={() => setShowUserDetail(false)}>
              ← Back to list
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="col-span-2">{selectedUser.full_name || 'Not provided'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="col-span-2">{selectedUser.email}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="col-span-2">
                      {selectedUser.is_approved ? (
                        <span className="text-green-600 font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium flex items-center">
                          <XCircle className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="col-span-2">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <School className="h-5 w-5 mr-2 text-muted-foreground" />
                  Educational Information
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="col-span-2">
                      {selectedUser.user_metadata?.country || 'Not provided'}
                    </span>
                  </div>
                  {selectedUser.user_metadata?.state && (
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-muted-foreground">State:</span>
                      <span className="col-span-2">{selectedUser.user_metadata.state}</span>
                    </div>
                  )}
                  {selectedUser.user_metadata?.school && (
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-muted-foreground">School:</span>
                      <span className="col-span-2">{selectedUser.user_metadata.school}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Grade/Class:</span>
                    <span className="col-span-2">
                      {selectedUser.user_metadata?.grade || 'Not provided'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-2 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                  Learning Preferences
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Learning Style:</span>
                    <span className="col-span-2 capitalize">
                      {selectedUser.user_metadata?.learning_style || 'Not provided'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-muted-foreground">Subjects:</span>
                    <div className="col-span-2">
                      {selectedUser.user_metadata?.preferred_subjects?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedUser.user_metadata.preferred_subjects.map((subject, i) => (
                            <span 
                              key={i} 
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center">
              <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs mr-2 font-medium">
                {pendingUsers.length}
              </div>
              Pending Approval
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center">
              <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs mr-2 font-medium">
                {approvedUsers.length}
              </div>
              Approved Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
                <CardDescription>
                  Users waiting for account approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? (
                      <p>No pending users match your search</p>
                    ) : (
                      <p>No pending users</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-muted p-3 text-xs font-medium">
                      <div className="col-span-3">NAME</div>
                      <div className="col-span-3">EMAIL</div>
                      <div className="col-span-3">JOINED</div>
                      <div className="col-span-3 text-right">ACTIONS</div>
                    </div>
                    <div className="divide-y">
                      {filteredPendingUsers.map((profile) => (
                        <div key={profile.id} className="grid grid-cols-12 p-3 items-center">
                          <div className="col-span-3 font-medium truncate">
                            {profile.full_name || 'No name'}
                          </div>
                          <div className="col-span-3 text-sm truncate">
                            {profile.email}
                          </div>
                          <div className="col-span-3 text-sm text-muted-foreground">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </div>
                          <div className="col-span-3 flex items-center justify-end space-x-2">
                            <Button 
                              onClick={() => approveUser(profile.id)}
                              disabled={processing === profile.id}
                              size="sm"
                              className="h-8"
                            >
                              {processing === profile.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewUserDetails(profile)}>
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Users</CardTitle>
                <CardDescription>
                  Users with active account access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredApprovedUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? (
                      <p>No approved users match your search</p>
                    ) : (
                      <p>No approved users</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-muted p-3 text-xs font-medium">
                      <div className="col-span-3">NAME</div>
                      <div className="col-span-3">EMAIL</div>
                      <div className="col-span-3">JOINED</div>
                      <div className="col-span-3 text-right">ACTIONS</div>
                    </div>
                    <div className="divide-y">
                      {filteredApprovedUsers.map((profile) => (
                        <div key={profile.id} className="grid grid-cols-12 p-3 items-center">
                          <div className="col-span-3 font-medium truncate">
                            {profile.full_name || 'No name'}
                          </div>
                          <div className="col-span-3 text-sm truncate">
                            {profile.email}
                          </div>
                          <div className="col-span-3 text-sm text-muted-foreground">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </div>
                          <div className="col-span-3 flex items-center justify-end space-x-2">
                            <Button 
                              onClick={() => revokeAccess(profile.id)}
                              disabled={processing === profile.id}
                              variant="outline"
                              size="sm"
                              className="h-8"
                            >
                              {processing === profile.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Revoke
                                </>
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewUserDetails(profile)}>
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminPage;
