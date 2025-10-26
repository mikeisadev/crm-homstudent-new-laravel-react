import RegistryPage from '../components/registry/RegistryPage';
import { propertiesConfig } from '../config/registryConfigs';

/**
 * Properties Page
 *
 * Thin wrapper around RegistryPage with properties configuration
 * Handles Immobili (Properties) management with:
 * - Searchable/paginated list
 * - Detail view with accordions (Info generali, Dati strutturali, Servizi, Dati catastali, Impianti)
 * - Related data tabs (Contratti, Contratti di gestione, Documenti, Foto, Manutenzioni, Sanzioni, Bollette, Dotazioni, Proprietari)
 * - Create/Edit modal
 *
 * @returns {JSX.Element}
 */
export default function Properties() {
    return <RegistryPage config={propertiesConfig} />;
}
