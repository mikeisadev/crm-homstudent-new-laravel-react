import ListingPage from '../components/listing/ListingPage';
import { penaltiesConfig } from '../config/penaltiesListingConfig';

/**
 * Penalties (Sanzioni) Page
 * Manages penalties using the listing architecture
 */
export default function Penalties() {
    return <ListingPage config={penaltiesConfig} />;
}
