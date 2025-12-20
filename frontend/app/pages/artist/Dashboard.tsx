
import ArtistLayout from '~/components/layouts/ArtistLayout';
import ArtistDashboardTemplate from '~/components/templates/ArtistDashboard';


const ArtistDashboard: React.FC = () => {

    return (
        <ArtistLayout>
            <ArtistDashboardTemplate />
        </ArtistLayout>
    );
};
export default ArtistDashboard;