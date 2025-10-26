import RegistryPage from '../components/registry/RegistryPage';
import { roomsConfig } from '../config/registryConfigs';

/**
 * Rooms Page
 *
 * Thin wrapper around RegistryPage with rooms configuration
 * Handles Stanze (Rooms) management with:
 * - Searchable/paginated list
 * - Detail view with accordions (Info generali, Caratteristiche, Web, Note)
 * - Related data tabs (Contratti, Documenti, Foto, Manutenzioni, Dotazioni)
 * - Create/Edit modal
 *
 * @returns {JSX.Element}
 */
export default function Rooms() {
    return <RegistryPage config={roomsConfig} />;
}
