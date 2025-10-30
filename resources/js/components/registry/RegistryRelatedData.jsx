import { useState } from 'react';
import RENDERER_MAP from './tabRenderers';

/**
 * Generic Registry Related Data Component
 *
 * Displays related data in tabs using dynamic renderers
 * Configuration-driven to work with any entity type
 *
 * Features:
 * - Dynamic renderer loading based on tab config
 * - Supports custom renderers (ContractsTabRenderer, ProposalsTabRenderer, DocumentManager)
 * - Passes entityId, endpoint, and rendererProps to renderers
 *
 * @param {object} config - Registry configuration
 * @param {object} item - Entity object
 * @returns {JSX.Element}
 */
export default function RegistryRelatedData({ config, item }) {
    const [activeTab, setActiveTab] = useState(config.tabs?.[0]?.key || null);

    /**
     * Render tab content using dynamic renderer
     */
    const renderTabContent = () => {
        // Safety check: if no tabs defined, return null
        if (!config.tabs || config.tabs.length === 0) {
            return null;
        }

        const activeTabConfig = config.tabs.find(t => t.key === activeTab);

        if (!activeTabConfig) {
            return null;
        }

        // Get renderer component if specified
        if (activeTabConfig.renderer && RENDERER_MAP[activeTabConfig.renderer]) {
            const RendererComponent = RENDERER_MAP[activeTabConfig.renderer];

            // Build endpoint
            const endpoint = typeof activeTabConfig.endpoint === 'function'
                ? activeTabConfig.endpoint(item.id)
                : activeTabConfig.endpoint;

            // Render custom component
            return (
                <RendererComponent
                    entityId={item.id}
                    endpoint={endpoint}
                    rendererProps={activeTabConfig.rendererProps || {}}
                />
            );
        }

        // Fallback: placeholder for tabs without renderer
        return (
            <div className="p-8 text-center text-gray-500">
                <i className="material-icons text-4xl mb-2">{activeTabConfig.icon}</i>
                <p>Contenuto tab in fase di sviluppo</p>
                <p className="text-sm mt-2 italic">
                    La funzionalità verrà completata a breve
                </p>
            </div>
        );
    };

    // No tabs defined - render empty state
    if (!config.tabs || config.tabs.length === 0) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                        <i className="material-icons text-6xl mb-4">folder_off</i>
                        <p>Nessun dato correlato disponibile</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!item) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                        <i className="material-icons text-6xl mb-4">tab</i>
                        <p>Seleziona un {config.titleSingular.toLowerCase()} per visualizzare i dati correlati</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Tabs Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="flex overflow-x-auto">
                    {config.tabs?.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                                flex-shrink-0 px-6 py-3 font-medium text-sm transition-colors
                                border-b-2 whitespace-nowrap
                                ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                                }
                            `}
                        >
                            <i className="material-icons text-sm mr-2 align-middle">{tab.icon}</i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
                {renderTabContent()}
            </div>
        </div>
    );
}
