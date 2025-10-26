import RegistryPage from '../components/registry/RegistryPage';
import { clientsConfig } from '../config/registryConfigs';

/**
 * Clients Page
 *
 * Thin wrapper around RegistryPage with clients configuration
 * Handles Clienti (Clients) management with:
 * - Searchable/paginated list with type filter
 * - Detail view with inline editing (9 accordion sections)
 * - Related data tabs (Contracts, Proposals, Documents)
 * - Create modal (ClientFormModal - backward compatibility)
 *
 * Features:
 * - Inline editing for UPDATE operations (per-accordion save)
 * - Modal for CREATE operations only
 * - Complex field support (meta, contact, banking data)
 * - Conditional field rendering (private vs business)
 * - Custom tab renderers (ContractsTabRenderer, ProposalsTabRenderer, DocumentManager)
 *
 * @returns {JSX.Element}
 */
export default function Clients() {
    return <RegistryPage config={clientsConfig} />;
}
