/**
 * Tab Renderers Registry
 *
 * Central export for all tab renderer components
 * Used by RegistryRelatedData to dynamically load renderers
 */

import ContractsTabRenderer from './ContractsTabRenderer';
import ProposalsTabRenderer from './ProposalsTabRenderer';
import DocumentManager from './DocumentManager';

// Export individual renderers
export {
    ContractsTabRenderer,
    ProposalsTabRenderer,
    DocumentManager
};

// Export registry map for dynamic loading
export const RENDERER_MAP = {
    ContractsTabRenderer,
    ProposalsTabRenderer,
    DocumentManager
};

export default RENDERER_MAP;
