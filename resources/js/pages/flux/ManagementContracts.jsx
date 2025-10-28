import KanbanBoard from '../../components/kanban/KanbanBoard';
import { managementContractsConfig } from '../../config/fluxKanbanConfig';

/**
 * Management Contracts (Contratti di Gestione) Page
 *
 * Kanban-style view for managing property management contracts
 */
export default function ManagementContracts() {
    return (
        <div className="h-full">
            <KanbanBoard config={managementContractsConfig} />
        </div>
    );
}
