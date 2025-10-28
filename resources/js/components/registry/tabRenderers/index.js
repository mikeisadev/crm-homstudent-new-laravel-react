/**
 * Tab Renderers Registry
 *
 * Central export for all tab renderer components
 * Used by RegistryRelatedData to dynamically load renderers
 */

import ContractsTabRenderer from './ContractsTabRenderer';
import ProposalsTabRenderer from './ProposalsTabRenderer';
import DocumentManager from './DocumentManager';
import PhotosTabRenderer from './PhotosTabRenderer';
import MaintenancesTabRenderer from './MaintenancesTabRenderer';
import EquipmentTabRenderer from './EquipmentTabRenderer';
import OwnersTabRenderer from './OwnersTabRenderer';
import PenaltiesTabRenderer from './PenaltiesTabRenderer';
import InvoicesTabRenderer from './InvoicesTabRenderer';
import ManagementContractsTabRenderer from './ManagementContractsTabRenderer';

// Export individual renderers
export {
    ContractsTabRenderer,
    ProposalsTabRenderer,
    DocumentManager,
    PhotosTabRenderer,
    MaintenancesTabRenderer,
    EquipmentTabRenderer,
    OwnersTabRenderer,
    PenaltiesTabRenderer,
    InvoicesTabRenderer,
    ManagementContractsTabRenderer
};

// Export registry map for dynamic loading
export const RENDERER_MAP = {
    ContractsTabRenderer,
    ProposalsTabRenderer,
    DocumentManager,
    PhotosTabRenderer,
    MaintenancesTabRenderer,
    EquipmentTabRenderer,
    OwnersTabRenderer,
    PenaltiesTabRenderer,
    InvoicesTabRenderer,
    ManagementContractsTabRenderer
};

export default RENDERER_MAP;
