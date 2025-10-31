import ListingPage from '../components/listing/ListingPage';
import { cancellationsConfig } from '../config/cancellationsListingConfig';

/**
 * Cancellations (Disdette) Page
 *
 * Management section page for cancellations
 * Uses the reusable ListingPage component with cancellations configuration
 */
export default function Cancellations() {
    return <ListingPage config={cancellationsConfig} />;
}
