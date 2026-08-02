
import EventsManagement from '~/components/forrms/EventsManagement';
import ArtistLayout from '~/components/layouts/ArtistLayout';


const EventsManagementPage: React.FC = () => {

    return (
        <ArtistLayout>
            <EventsManagement />
        </ArtistLayout>
    );
};
export default EventsManagementPage;