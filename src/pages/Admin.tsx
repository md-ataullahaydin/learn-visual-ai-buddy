
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";

// Define proper types for the user data
interface UserData {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
    approved?: boolean;
  };
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      if (data && data.users) {
        setUsers(data.users as UserData[]);
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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                user_metadata: {
                  ...user.user_metadata,
                  approved: true,
                },
              }
            : user
        )
      );

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

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <Table>
            <TableCaption>List of registered users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.user_metadata?.full_name || "Not provided"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.user_metadata?.approved ? "Approved" : "Pending"}
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
        )}
      </div>
    </Layout>
  );
};

export default Admin;
