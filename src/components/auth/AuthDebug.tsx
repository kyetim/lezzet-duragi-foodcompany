import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AuthDebug: React.FC = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="p-4 bg-yellow-100 text-yellow-800">Loading auth state...</div>;
    }

    return (
        <div className="p-4 bg-gray-100 text-sm">
            <h3 className="font-bold mb-2">Auth Debug Info:</h3>
            <div>Current User: {currentUser ? 'Logged In' : 'Not Logged In'}</div>
            {currentUser && (
                <div>
                    <div>Email: {currentUser.email}</div>
                    <div>Display Name: {currentUser.displayName || 'Not set'}</div>
                    <div>UID: {currentUser.uid}</div>
                </div>
            )}
        </div>
    );
};
