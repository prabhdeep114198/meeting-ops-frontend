import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Demo Role Switcher state: 'participant', 'reviewer', 'admin'
  const [role, setRole] = useState(localStorage.getItem('meetingops_demo_role') || 'reviewer');
  const [user, setUser] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    orgName: 'Acme Operations Corp',
  });

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('meetingops_demo_role', newRole);
  };

  const logout = () => {
    // For demo purposes, reset to participant or unauthenticate
    switchRole('participant');
  };

  return (
    <AuthContext.Provider value={{ role, setRole: switchRole, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
