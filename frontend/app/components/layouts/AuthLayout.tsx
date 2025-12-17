import React, { type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    // BG_COLOR is the same deep gray-900 used in the forms
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;