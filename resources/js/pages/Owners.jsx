import RegistryPage from '../components/registry/RegistryPage';
import { ownersConfig } from '../config/generalRegistryTabsConfig';

/**
 * Owners (Proprietari) Page
 * Manages property owners using the registry architecture
 */
export default function Owners() {
    return <RegistryPage config={ownersConfig} />;
}
