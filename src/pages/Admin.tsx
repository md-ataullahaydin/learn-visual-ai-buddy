
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { RefreshCcw, CheckCircle, Search, User, Sliders, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

// Define proper types for the user data
interface UserData {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    fullName?: string;
    country?: string;
    grade?: string;
    school?: string;
    subjects?: string[];
    approved?: boolean;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminAccess, setAdminAccess] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const isUserAdmin = await isAdmin();
      setAdminAccess(isUserAdmin);
      
      if (!isUserAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin area.",
          variant: "destructive",
        });
        navigate("/");
      } else {
        fetchUsers();
      }
    };
    
    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      if (data && data.users) {
        const userData = data.users as UserData[];
        setUsers(userData);
        
        // Filter users into pending and approved
        setPendingUsers(userData.filter(user => !user.user_metadata?.approved));
        setApprovedUsers(userData.filter(user => user.user_metadata?.approved));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      // Update user metadata to mark as approved
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approved: true },
      });

      if (error) {
        throw error;
      }

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === userId
          ? {
              ...user,
              user_metadata: {
                ...user.user_metadata,
                approved: true,
              },
            }
          : user
      );
      
      setUsers(updatedUsers);
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setApprovedUsers([...approvedUsers, updatedUsers.find(user => user.id === userId) as UserData]);

      toast({
        title: "Success",
        description: "User has been approved.",
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filterUsers = (users: UserData[]) => {
    if (!searchTerm) return users;
    
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.school?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (!adminAccess) {
    return null;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and system settings</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Return to Dashboard
            </Button>
            <Button onClick={fetchUsers} variant="outline" className="flex items-center">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg shadow-sm p-6 mb-8">
          <Tabs defaultValue="pending">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="pending" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Pending Approval
                  {pendingUsers.length > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {pendingUsers.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approved Users
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  All Users
                </TabsTrigger>
              </TabsList>
              
              <div className="w-full md:w-auto relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="pending" className="mt-0">
              <h2 className="text-xl font-semibold mb-4">Users Pending Approval</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : filterUsers(pendingUsers).length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No pending approvals</h3>
                  <p className="text-muted-foreground">All users have been approved</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of users pending approval</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterUsers(pendingUsers).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.user_metadata?.fullName || "Not provided"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.user_metadata?.country || "Not provided"}</TableCell>
                          <TableCell>{user.user_metadata?.school || "Not provided"}</TableCell>
                          <TableCell>{user.user_metadata?.grade || "Not provided"}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              className="flex items-center"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="mt-0">
              <h2 className="text-xl font-semibold mb-4">Approved Users</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : filterUsers(approvedUsers).length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No approved users</h3>
                  <p className="text-muted-foreground">Approve users to see them here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of approved users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterUsers(approvedUsers).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.user_metadata?.fullName || "Not provided"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.user_metadata?.country || "Not provided"}</TableCell>
                          <TableCell>{user.user_metadata?.school || "Not provided"}</TableCell>
                          <TableCell>{user.user_metadata?.grade || "Not provided"}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Approved
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <h2 className="text-xl font-semibold mb-4">All Users</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : filterUsers(users).length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="text-muted-foreground">There are no users registered in the system</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Complete list of all users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterUsers(users).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.user_metadata?.fullName || "Not provided"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.user_metadata?.country || "Not provided"}</TableCell>
                          <TableCell>{user.user_metadata?.school || "Not provided"}</TableCell>
                          <TableCell>{user.user_metadata?.grade || "Not provided"}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {user.user_metadata?.approved ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {!user.user_metadata?.approved && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(user.id)}
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Admin;
