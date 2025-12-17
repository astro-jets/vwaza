import React from 'react';
import ArtistRegistrationForm from '~/components/forrms/ArtistRegistrationForm';
import AuthLayout from '~/components/layouts/AuthLayout';


const SignupPage: React.FC = () => {
    return (
        <AuthLayout
            title="Join Vwaza"
            subtitle="Create your artist account to manage and distribute your music."
        >
            <ArtistRegistrationForm />
        </AuthLayout>
    );
};

export default SignupPage;