import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    it: {
        translation: {
            menu: {
                home: 'Home',
                calendario: 'Calendario',
                // ANAGRAFICHE
                anagrafiche: 'ANAGRAFICHE',
                condomini: 'Condomini',
                immobili: 'Immobili',
                stanze: 'Stanze',
                clienti: 'Clienti',
                // FLUSSO
                flusso: 'FLUSSO',
                contratti_gestione: 'Contratti di gestione',
                proposte: 'Proposte',
                contratti: 'Contratti',
                // GENERALI
                generali: 'GENERALI',
                fornitori: 'Fornitori',
                proprietari: 'Proprietari',
                // GESTIONE
                gestione: 'GESTIONE',
                caparre: 'Caparre',
                disdette: 'Disdette',
                bollette: 'Bollette',
                sanzioni: 'Sanzioni',
            },
            common: {
                logout: 'Esci',
                settings: 'Impostazioni',
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'it',
        fallbackLng: 'it',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
