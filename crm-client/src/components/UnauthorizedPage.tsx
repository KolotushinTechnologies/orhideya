import React from 'react';
import { useAuth } from '../context/AuthContext';

interface UnauthorizedPageProps {
  message: string;
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ message }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '500px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#ef4444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: 'white',
          marginBottom: '1rem'
        }}>
          Доступ запрещен
        </h1>
        
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem'
        }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <button
              onClick={logout}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#dc2626')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#ef4444')}
            >
              Выйти из системы
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#059669')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#10b981')}
            >
              Вернуться на страницу входа
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
