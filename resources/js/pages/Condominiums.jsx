import RegistryPage from '../components/registry/RegistryPage';
import { condominiumsConfig } from '../config/registryConfigs';

/**
 * Condominiums Page
 *
 * Thin wrapper around RegistryPage with condominiums configuration
 * Handles Condomini (Condominiums) management with:
 * - Searchable/paginated list
 * - Detail view with accordions (Info generali, Amministratore, Utenze condominiali, Note)
 * - Related data tabs (Documenti, Foto)
 * - Create/Edit modal
 *
 * @returns {JSX.Element}
 */
export default function Condominiums() {
    return <RegistryPage config={condominiumsConfig} />;
}
