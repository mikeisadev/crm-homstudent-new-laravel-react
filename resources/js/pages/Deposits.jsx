import ListingPage from '../components/listing/ListingPage';
import { depositsConfig } from '../config/depositsListingConfig';

/**
 * Deposits (Caparre) Page
 *
 * Management section page for deposits
 * Uses the reusable ListingPage component with deposits configuration
 */
export default function Deposits() {
    return <ListingPage config={depositsConfig} />;
}
