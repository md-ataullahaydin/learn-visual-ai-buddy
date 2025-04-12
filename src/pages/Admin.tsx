
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
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_approved: boolean;
  created_at: string;
}

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }

        const pending = data.filter(user => !user.is_approved);
        const approved = data.filter(user => user.is_approved);
        
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>
              Users waiting for account approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No pending users
              </p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{profile.full_name || 'No name'}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => approveUser(profile.id)}
                      disabled={processing === profile.id}
                      size="sm"
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approved Users</CardTitle>
            <CardDescription>
              Users with active account access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedUsers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No approved users
              </p>
            ) : (
              <div className="space-y-4">
                {approvedUsers.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{profile.full_name || 'No name'}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => revokeAccess(profile.id)}
                      disabled={processing === profile.id}
                      variant="outline"
                      size="sm"
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
