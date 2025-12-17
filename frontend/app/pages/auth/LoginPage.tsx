import React from 'react';
import ArtistLoginForm from '~/components/forrms/ArtistLoginForm';
import AuthLayout from '~/components/layouts/AuthLayout';
import { AuthProvider } from '~/context/AuthContext';
const LoginPage: React.FC = () => {
    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Log in to access your artist dashboard and statistics."
        >
            <AuthProvider>
                <ArtistLoginForm />
            </AuthProvider>
        </AuthLayout>
    );
};

export default LoginPage;