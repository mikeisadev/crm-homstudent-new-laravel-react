import RegistryPage from '../components/registry/RegistryPage';
import { suppliersConfig } from '../config/generalRegistryTabsConfig';

/**
 * Suppliers Page
 *
 * Thin wrapper around RegistryPage with suppliers configuration
 * Handles Fornitori (Suppliers) management with:
 * - Searchable/paginated list
 * - Detail view with inline editing (2 accordion sections: Info generali, Note)
 * - No related data tabs (third column empty but maintains layout)
 * - Create/edit modal with comprehensive Italian supplier fields
 *
 * Features:
 * - Italian supplier-specific fields (SDI, PEC, Email invio, Referente)
 * - Italian cities, provinces, and countries select fields
 * - Inline editing for UPDATE operations (per-accordion save)
 * - Modal for CREATE operations
 * - Standard contact information (phone, mobile, fax, emails)
 * - Address management with Italian postal system
 *
 * @returns {JSX.Element}
 */
export default function Suppliers() {
    return <RegistryPage config={suppliersConfig} />;
}
