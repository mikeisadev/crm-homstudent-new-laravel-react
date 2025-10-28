import KanbanBoard from '../../components/kanban/KanbanBoard';
import { proposalsConfig } from '../../config/fluxKanbanConfig';

/**
 * Proposals (Proposte) Page
 *
 * Kanban-style view for managing proposals
 */
export default function Proposals() {
    return (
        <div className="h-full">
            <KanbanBoard config={proposalsConfig} />
        </div>
    );
}
