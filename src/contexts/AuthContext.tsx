import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  loginCode: string | null;
  setLoginCode: (code: string | null) => void;
  setIsAdmin: (status: boolean) => void;
  setIsStaff: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin-session') === 'true');
  const [isStaff, setIsStaff] = useState(localStorage.getItem('staff-session') === 'true');
  const [loading, setLoading] = useState(true);
  const [loginCode, setLoginCodeState] = useState<string | null>(localStorage.getItem('member-code'));

  const setLoginCode = (code: string | null) => {
    setLoginCodeState(code);
    if (code) localStorage.setItem('member-code', code);
    else localStorage.removeItem('member-code');
  };

  const handleSetIsAdmin = (status: boolean) => {
    setIsAdmin(status);
    if (status) localStorage.setItem('admin-session', 'true');
    else localStorage.removeItem('admin-session');
  };

  const handleSetIsStaff = (status: boolean) => {
    setIsStaff(status);
    if (status) localStorage.setItem('staff-session', 'true');
    else localStorage.removeItem('staff-session');
  };

  useEffect(() => {
    // We already initialize from localStorage above
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isStaff, 
      loading, 
      loginCode, 
      setLoginCode,
      setIsAdmin: handleSetIsAdmin,
      setIsStaff: handleSetIsStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
