import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { handleGoogleLogin } from '#/lib/pocketbase';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSubmit = async () => {
    setLoading(true);
    setError(null);

    const result = await handleGoogleLogin();

    if (result.success) {
      navigate({ to: '/' });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="login-view" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <h2>Account Sign In</h2>
      
      {error && <p className="error-banner" style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      
      <button 
        type="button" 
        onClick={handleGoogleSubmit} 
        disabled={loading} 
        className="google-login-btn"
        style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Connecting to Google...' : 'Sign in with Google'}
      </button>
    </div>
  );
}