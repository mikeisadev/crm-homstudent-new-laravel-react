import KanbanBoard from '../../components/kanban/KanbanBoard';
import { contractsConfig } from '../../config/fluxKanbanConfig';

/**
 * Contracts (Contratti) Page
 *
 * Kanban-style view for managing contracts
 */
export default function Contracts() {
    return (
        <div className="h-full">
            <KanbanBoard config={contractsConfig} />
        </div>
    );
}
