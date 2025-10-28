import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FormField from '../components/ui/FormField';
import Select from '../components/ui/Select';
import DatePicker from '../components/ui/DatePicker';
import api from '../services/api';
import calendarService from '../services/calendarService';
import {
    validateMaintenanceForm,
    validateCheckinForm,
    validateCheckoutForm,
    validateReportForm,
} from '../utils/validation';
import {
    GET_MAINTENANCE_LABEL,
    GET_CHECKIN_LOCATION_LABEL,
    GET_ACTIVITY_NAME_LABEL,
    MAINTENANCE_NAMES,
    URGENCY_TYPES,
    MAINTENANCE_TYPES,
    REPORT_SOURCES,
    CHECKIN_LOCATIONS,
    ACTIVITY_NAMES,
} from '../constants/calendarConstants';
import DateUtil from '../utils/date';

/**
 * Calendar page component with FullCalendar integration
 * Manages maintenance, check-in, check-out, and report events
 *
 * @returns {JSX.Element}
 */
export default function Calendar() {
    // State for modal visibility
    const [modalState, setModalState] = useState({
        manutenzione: false,
        checkin: false,
        checkout: false,
        segnalazione: false,
        eventDetails: false,
    });

    // State for calendar events
    const [events, setEvents] = useState([]);

    // State for selected event and edit mode
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // State for validation errors
    const [maintenanceErrors, setMaintenanceErrors] = useState({});
    const [checkinErrors, setCheckinErrors] = useState({});
    const [checkoutErrors, setCheckoutErrors] = useState({});
    const [reportErrors, setReportErrors] = useState({});

    // State for data from API
    const [properties, setProperties] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [clients, setClients] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // State for Manutenzione form
    const [maintenanceForm, setMaintenanceForm] = useState({
        property_id: null,
        room_id: null,
        maintenance_name: null,
        urgency_type: null,
        maintenance_type: null,
        report_date: null,
        start_date: null,
        end_date: null,
        supplier_id: null,
        report_source: null,
        client_id: null,
        responsible: '',
        description: '',
    });

    // State for Check-in form
    const [checkinForm, setCheckinForm] = useState({
        checkin_date: null,
        location: null,
        client_id: null,
        contract_id: null,
        description: '',
    });

    // State for Check-out form
    const [checkoutForm, setCheckoutForm] = useState({
        checkout_date: null,
        location: null,
        client_id: null,
        contract_id: null,
        description: '',
    });

    // State for Segnalazione form
    const [reportForm, setReportForm] = useState({
        property_id: null,
        room_id: null,
        activity_name: null,
        urgency_type: null,
        start_date: null,
        end_date: null,
        responsible: '',
        description: '',
    });

    // Filtered rooms based on selected property
    const [filteredRooms, setFilteredRooms] = useState([]);

    /**
     * Fetch data from API on component mount
     *
     * @returns {void}
     */
    useEffect(() => {
        fetchInitialData();
        fetchCalendarEvents();
    }, []);

    /**
     * Fetch initial dropdown data (properties, rooms, clients, contracts, suppliers)
     *
     * @returns {Promise<void>}
     */
    const fetchInitialData = async () => {
        try {
            // Fetch all data in parallel
            // IMPORTANT: Using per_page=9999 to get ALL records for select field options
            // These are NOT for listing/pagination, but for entity correlation in dropdowns
            const [propertiesRes, roomsRes, clientsRes, contractsRes, suppliersRes] =
                await Promise.all([
                    api.get('/properties?per_page=9999'),
                    api.get('/rooms?per_page=9999'),
                    api.get('/clients?per_page=9999'),
                    api.get('/contracts?per_page=9999'),
                    api.get('/suppliers?per_page=9999'),
                ]);

            // Transform properties to react-select format
            const propertiesOptions = propertiesRes.data.data.properties.map((prop) => ({
                value: prop.id,
                label: prop.internal_code || prop.name,
            }));

            // Transform rooms to react-select format
            const roomsOptions = roomsRes.data.data.rooms.map((room) => ({
                value: room.id,
                label: room.internal_code || `Room ${room.id}`,
                property_id: room.property_id,
            }));

            // Transform clients to react-select format
            const clientsOptions = clientsRes.data.data.clients.map((client) => ({
                value: client.id,
                label: client.full_name || `${client.first_name} ${client.last_name}`,
            }));

            // Transform contracts to react-select format
            const contractsOptions = contractsRes.data.data.contracts.map((contract) => ({
                value: contract.id,
                label: contract.contract_number,
            }));

            // Transform suppliers to react-select format
            const suppliersOptions = suppliersRes.data.data.suppliers.map((supplier) => ({
                value: supplier.id,
                label: supplier.name,
            }));

            console.log(propertiesRes, propertiesOptions, roomsOptions);

            setProperties(propertiesOptions);
            setRooms(roomsOptions);
            setClients(clientsOptions);
            setContracts(contractsOptions);
            setSuppliers(suppliersOptions);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    /**
     * Fetch calendar events from backend
     *
     * @returns {Promise<void>}
     */
    const fetchCalendarEvents = async () => {
        try {
            const response = await calendarService.getAllEvents();
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        }
    };

    /**
     * Filter rooms when property is selected in Manutenzione form
     *
     * @returns {void}
     */
    useEffect(() => {
        if (maintenanceForm.property_id) {
            const filtered = rooms.filter(
                (room) => room.property_id === maintenanceForm.property_id.value
            );
            setFilteredRooms(filtered);

            return;
        } 
        
        if (reportForm.property_id) {
            const filtered = rooms.filter(
                (room) => room.property_id === reportForm.property_id.value
            );
            setFilteredRooms(filtered);

            return;
        }

        setFilteredRooms([]);
        setMaintenanceForm((prev) => ({ ...prev, room_id: null }));
        setReportForm((prev) => ({ ...prev, room_id: null }));
    }, [maintenanceForm.property_id, reportForm.property_id, rooms]);

    /**
     * Open a specific modal
     *
     * @param {string} modalType - Type of modal to open
     * @returns {void}
     */
    const openModal = (modalType) => {
        setModalState((prev) => ({ ...prev, [modalType]: true }));
    };

    /**
     * Close a specific modal and reset form
     *
     * @param {string} modalType - Type of modal to close
     * @returns {void}
     */
    const closeModal = (modalType) => {
        setModalState((prev) => ({ ...prev, [modalType]: false }));

        // Reset edit mode and selected event
        setEditMode(false);
        setSelectedEvent(null);

        // Reset forms and errors
        if (modalType === 'manutenzione') {
            setMaintenanceForm({
                property_id: null,
                room_id: null,
                maintenance_name: null,
                urgency_type: null,
                maintenance_type: null,
                report_date: null,
                start_date: null,
                end_date: null,
                supplier_id: null,
                report_source: null,
                client_id: null,
                responsible: '',
                description: '',
            });
            setMaintenanceErrors({});
        } else if (modalType === 'checkin') {
            setCheckinForm({
                checkin_date: null,
                location: null,
                client_id: null,
                contract_id: null,
                description: '',
            });
            setCheckinErrors({});
        } else if (modalType === 'checkout') {
            setCheckoutForm({
                checkout_date: null,
                location: null,
                client_id: null,
                contract_id: null,
                description: '',
            });
            setCheckoutErrors({});
        } else if (modalType === 'segnalazione') {
            setReportForm({
                property_id: null,
                room_id: null,
                activity_name: null,
                urgency_type: null,
                start_date: null,
                end_date: null,
                responsible: '',
                description: '',
            });
            setReportErrors({});
        }
    };

    /**
     * Handle maintenance form submission
     *
     * @param {Event} e - Form submit event
     * @returns {void}
     */
    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();

        const { isValid, errors } = validateMaintenanceForm(maintenanceForm);

        setMaintenanceErrors(errors);

        if (!isValid) {
            return;
        }

        try {
            // Prepare data for backend (extract values from react-select objects)
            const data = {
                property_id: maintenanceForm.property_id?.value || null,
                room_id: maintenanceForm.room_id?.value || null,
                maintenance_name: maintenanceForm.maintenance_name?.value || null,
                urgency_type: maintenanceForm.urgency_type?.value || null,
                maintenance_type: maintenanceForm.maintenance_type?.value || null,
                report_date: DateUtil.formatDate(maintenanceForm.report_date) || null,
                start_date: DateUtil.formatDateTime(maintenanceForm.start_date) || null,
                end_date: DateUtil.formatDateTime(maintenanceForm.end_date) || null,
                supplier_id: maintenanceForm.supplier_id?.value || null,
                report_source: maintenanceForm.report_source?.value || null,
                client_id: maintenanceForm.client_id?.value || null,
                responsible: maintenanceForm.responsible,
                description: maintenanceForm.description,
            };

            if (editMode && selectedEvent) {
                await calendarService.updateMaintenance(selectedEvent.data.id, data);
                alert('Manutenzione aggiornata con successo!');
            } else {
                await calendarService.createMaintenance(data);
                alert('Manutenzione creata con successo!');
            }

            await fetchCalendarEvents(); // Refresh events
            closeModal('manutenzione');
        } catch (error) {
            console.error('Error saving maintenance:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Errore nel salvataggio della manutenzione. Verifica i dati inseriti.';
            alert(errorMessage);
        }
    };

    /**
     * Handle check-in form submission
     *
     * @param {Event} e - Form submit event
     * @returns {void}
     */
    const handleCheckinSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            checkin_date: DateUtil.formatDateTime(checkinForm.checkin_date) || null,
            location: checkinForm.location?.value || null,
        };

        const { isValid, errors } = validateCheckinForm(formData);
        setCheckinErrors(errors);

        if (!isValid) {
            return;
        }

        try {
            const data = {
                checkin_date: DateUtil.formatDateTime(checkinForm.checkin_date) || null,
                location: checkinForm.location?.value || null,
                client_id: checkinForm.client_id?.value || null,
                contract_id: checkinForm.contract_id?.value || null,
                description: checkinForm.description,
            };

            if (editMode && selectedEvent) {
                await calendarService.updateCheckin(selectedEvent.data.id, data);
                alert('Check-in aggiornato con successo!');
            } else {
                await calendarService.createCheckin(data);
                alert('Check-in creato con successo!');
            }

            await fetchCalendarEvents();
            closeModal('checkin');
        } catch (error) {
            console.error('Error saving check-in:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Errore nel salvataggio del check-in. Verifica i dati inseriti.';
            alert(errorMessage);
        }
    };

    /**
     * Handle check-out form submission
     *
     * @param {Event} e - Form submit event
     * @returns {void}
     */
    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            checkout_date: DateUtil.formatDateTime(checkoutForm.checkout_date) || null,
            location: checkoutForm.location?.value || null,
        };

        const { isValid, errors } = validateCheckoutForm(formData);
        setCheckoutErrors(errors);

        if (!isValid) {
            return;
        }

        try {
            const data = {
                checkout_date: DateUtil.formatDateTime(checkoutForm.checkout_date) || null,
                location: checkoutForm.location?.value || null,
                client_id: checkoutForm.client_id?.value || null,
                contract_id: checkoutForm.contract_id?.value || null,
                description: checkoutForm.description,
            };

            if (editMode && selectedEvent) {
                await calendarService.updateCheckout(selectedEvent.data.id, data);
                alert('Check-out aggiornato con successo!');
            } else {
                await calendarService.createCheckout(data);
                alert('Check-out creato con successo!');
            }

            await fetchCalendarEvents();
            closeModal('checkout');
        } catch (error) {
            console.error('Error saving check-out:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Errore nel salvataggio del check-out. Verifica i dati inseriti.';
            alert(errorMessage);
        }
    };

    /**
     * Handle report form submission
     *
     * @param {Event} e - Form submit event
     * @returns {void}
     */
    const handleReportSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            property_id: reportForm.property_id?.value || null,
            room_id: reportForm.room_id?.value || null,
            activity_name: reportForm.activity_name?.value || null,
            urgency_type: reportForm.urgency_type?.value || null,
            start_date: DateUtil.formatDateTime(reportForm.start_date) || null,
            end_date: DateUtil.formatDateTime(reportForm.end_date) || null,
        };

        const { isValid, errors } = validateReportForm(formData);
        setReportErrors(errors);

        if (!isValid) {
            return;
        }

        try {
            const data = {
                property_id: reportForm.property_id?.value || null,
                room_id: reportForm.room_id?.value || null,
                activity_name: reportForm.activity_name?.value || null,
                urgency_type: reportForm.urgency_type?.value || null,
                start_date: DateUtil.formatDateTime(reportForm.start_date) || null,
                end_date: DateUtil.formatDateTime(reportForm.end_date) || null,
                responsible: reportForm.responsible,
                description: reportForm.description,
            };

            if (editMode && selectedEvent) {
                await calendarService.updateReport(selectedEvent.data.id, data);
                alert('Segnalazione aggiornata con successo!');
            } else {
                await calendarService.createReport(data);
                alert('Segnalazione creata con successo!');
            }

            await fetchCalendarEvents();
            closeModal('segnalazione');
        } catch (error) {
            console.error('Error saving report:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Errore nel salvataggio della segnalazione. Verifica i dati inseriti.';
            alert(errorMessage);
        }
    };

    /**
     * Handle date click on calendar
     *
     * @param {Object} arg - FullCalendar date click argument
     * @returns {void}
     */
    const handleDateClick = (arg) => {
        console.log('Date clicked:', arg.dateStr);
    };

    /**
     * Handle event click on calendar - Opens event details modal
     *
     * @param {Object} arg - FullCalendar event click argument
     * @returns {void}
     */
    const handleEventClick = (arg) => {
        const event = arg.event;
        setSelectedEvent({
            id: event.id,
            type: event.extendedProps.type,
            title: event.title,
            start: event.start,
            end: event.end,
            data: event.extendedProps.data,
        });
        setModalState((prev) => ({ ...prev, eventDetails: true }));
    };

    /**
     * Handle edit button click - Opens edit modal with prefilled data
     *
     * @returns {void}
     */
    const handleEditEvent = () => {
        if (!selectedEvent) return;

        const eventData = selectedEvent.data;
        const eventType = selectedEvent.type;

        // Close event details modal
        setModalState((prev) => ({ ...prev, eventDetails: false }));

        // Set edit mode
        setEditMode(true);

        // Prefill form based on event type
        if (eventType === 'maintenance') {
            setMaintenanceForm({
                property_id: eventData.property_id
                    ? properties.find((p) => p.value === eventData.property_id)
                    : null,
                room_id: eventData.room_id ? rooms.find((r) => r.value === eventData.room_id) : null,
                maintenance_name: MAINTENANCE_NAMES.find((m) => m.value === eventData.maintenance_name) || null,
                urgency_type: URGENCY_TYPES.find((u) => u.value === eventData.urgency_type) || null,
                maintenance_type: MAINTENANCE_TYPES.find((m) => m.value === eventData.maintenance_type) || null,
                report_date: eventData.report_date || null,
                start_date: eventData.start_date || null,
                end_date: eventData.end_date || null,
                supplier_id: eventData.supplier_id
                    ? suppliers.find((s) => s.value === eventData.supplier_id)
                    : null,
                report_source: REPORT_SOURCES.find((r) => r.value === eventData.report_source) || null,
                client_id: eventData.client_id ? clients.find((c) => c.value === eventData.client_id) : null,
                responsible: eventData.responsible || '',
                description: eventData.description || '',
            });
            openModal('manutenzione');
        } else if (eventType === 'checkin') {
            setCheckinForm({
                checkin_date: eventData.checkin_date || null,
                location: CHECKIN_LOCATIONS.find((l) => l.value === eventData.location) || null,
                client_id: eventData.client_id ? clients.find((c) => c.value === eventData.client_id) : null,
                contract_id: eventData.contract_id
                    ? contracts.find((c) => c.value === eventData.contract_id)
                    : null,
                description: eventData.description || '',
            });
            openModal('checkin');
        } else if (eventType === 'checkout') {
            setCheckoutForm({
                checkout_date: eventData.checkout_date || null,
                location: CHECKIN_LOCATIONS.find((l) => l.value === eventData.location) || null,
                client_id: eventData.client_id ? clients.find((c) => c.value === eventData.client_id) : null,
                contract_id: eventData.contract_id
                    ? contracts.find((c) => c.value === eventData.contract_id)
                    : null,
                description: eventData.description || '',
            });
            openModal('checkout');
        } else if (eventType === 'report') {
            setReportForm({
                property_id: eventData.property_id
                    ? properties.find((p) => p.value === eventData.property_id)
                    : null,
                room_id: eventData.room_id ? rooms.find((r) => r.value === eventData.room_id) : null,
                activity_name: ACTIVITY_NAMES.find((a) => a.value === eventData.activity_name) || null,
                urgency_type: URGENCY_TYPES.find((u) => u.value === eventData.urgency_type) || null,
                start_date: eventData.start_date || null,
                end_date: eventData.end_date || null,
                responsible: eventData.responsible || '',
                description: eventData.description || '',
            });
            openModal('segnalazione');
        }
    };

    /**
     * Handle delete button click - Deletes the event with confirmation
     *
     * @returns {void}
     */
    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        const eventType = selectedEvent.type;
        const eventId = selectedEvent.data.id;

        // Get event name for confirmation
        let eventName = '';
        if (eventType === 'maintenance') {
            eventName = 'manutenzione';
        } else if (eventType === 'checkin') {
            eventName = 'check-in';
        } else if (eventType === 'checkout') {
            eventName = 'check-out';
        } else if (eventType === 'report') {
            eventName = 'segnalazione';
        }

        // Confirm deletion
        const confirmed = window.confirm(`Sei sicuro di voler eliminare questa ${eventName}?`);
        if (!confirmed) return;

        try {
            // Call appropriate delete service
            if (eventType === 'maintenance') {
                await calendarService.deleteMaintenance(eventId);
            } else if (eventType === 'checkin') {
                await calendarService.deleteCheckin(eventId);
            } else if (eventType === 'checkout') {
                await calendarService.deleteCheckout(eventId);
            } else if (eventType === 'report') {
                await calendarService.deleteReport(eventId);
            }

            alert(`${eventName.charAt(0).toUpperCase() + eventName.slice(1)} eliminata con successo!`);
            await fetchCalendarEvents(); // Refresh events
            setModalState((prev) => ({ ...prev, eventDetails: false }));
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error deleting event:', error);
            const errorMessage =
                error.response?.data?.message || `Errore nell'eliminazione della ${eventName}.`;
            alert(errorMessage);
        }
    };

    return (
        <div className="p-6">
            {/* Header with title and action buttons */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Calendario</h1>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button variant="primary" onClick={() => openModal('manutenzione')}>
                            Nuova manutenzione
                        </Button>
                        <Button variant="primary" onClick={() => openModal('checkin')}>
                            Nuovo check-in
                        </Button>
                        <Button variant="primary" onClick={() => openModal('checkout')}>
                            Nuovo check-out
                        </Button>
                        <Button variant="primary" onClick={() => openModal('segnalazione')}>
                            Nuova segnalazione
                        </Button>
                    </div>
                </div>
            </div>

            {/* Calendar container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    locale="it"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                    }}
                    buttonText={{
                        today: 'Oggi',
                        month: 'Mese',
                        week: 'Settimana',
                        day: 'Giorno',
                        list: 'Lista',
                    }}
                    events={events}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="auto"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false,
                    }}
                />
            </div>

            {/* MANUTENZIONE MODAL */}
            <Modal
                isOpen={modalState.manutenzione}
                onClose={() => closeModal('manutenzione')}
                title={editMode ? 'Modifica manutenzione' : 'Inserisci nuova manutenzione'}
                maxWidth="4xl"
            >
                <form onSubmit={handleMaintenanceSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <FormField 
                            label="Seleziona immobile"
                            error={maintenanceErrors.property_id}
                            required
                        >
                            <Select
                                options={properties}
                                value={maintenanceForm.property_id}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, property_id: val })
                                }
                                placeholder="-- Seleziona un immobile --"
                            />
                        </FormField>

                        <FormField 
                            label="Seleziona stanza"
                            error={maintenanceErrors.room_id}
                            required
                        >
                            <Select
                                options={filteredRooms}
                                value={maintenanceForm.room_id}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, room_id: val })
                                }
                                placeholder="-- Seleziona una stanza --"
                                isDisabled={!maintenanceForm.property_id}
                            />
                        </FormField>

                        <FormField
                            label="Nome manutenzione"
                            error={maintenanceErrors.maintenance_name}
                            required
                        >
                            <Select
                                options={MAINTENANCE_NAMES}
                                value={maintenanceForm.maintenance_name}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, maintenance_name: val })
                                }
                                placeholder="-- Seleziona un nome --"
                            />
                        </FormField>

                        <FormField
                            label="Tipologia di urgenza"
                            error={maintenanceErrors.urgency_type}
                            required
                        >
                            <Select
                                options={URGENCY_TYPES}
                                value={maintenanceForm.urgency_type}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, urgency_type: val })
                                }
                                placeholder="-- Seleziona urgenza --"
                            />
                        </FormField>

                        <FormField
                            label="Tipologia di manutenzione"
                            error={maintenanceErrors.maintenance_type}
                            required
                        >
                            <Select
                                options={MAINTENANCE_TYPES}
                                value={maintenanceForm.maintenance_type}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, maintenance_type: val })
                                }
                                placeholder="-- Seleziona tipologia --"
                            />
                        </FormField>

                        <FormField label="Data segnalazione">
                            <DatePicker
                                value={maintenanceForm.report_date}
                                onChange={(date) => 
                                    setMaintenanceForm({ ...maintenanceForm, report_date: date[0] })
                                }
                                placeholder="Seleziona una data"
                            />
                        </FormField>

                        <FormField label="Data inizio lavori">
                            <DatePicker
                                value={maintenanceForm.start_date}
                                onChange={(date) => 
                                    setMaintenanceForm({ ...maintenanceForm, start_date: date[0] })
                                }
                                placeholder="Seleziona una data e un orario"
                                enableTime={true}
                            />
                        </FormField>

                        <FormField label="Data fine lavori" error={maintenanceErrors.end_date}>
                            <DatePicker
                                value={maintenanceForm.end_date}
                                onChange={(date) =>
                                    setMaintenanceForm({ ...maintenanceForm, end_date: date[0] })
                                }
                                placeholder="Seleziona una data e un orario"
                                enableTime={true}
                            />
                        </FormField>

                        <FormField label="Fornitore">
                            <Select
                                options={suppliers}
                                value={maintenanceForm.supplier_id}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, supplier_id: val })
                                }
                                placeholder="-- Seleziona un fornitore --"
                            />
                        </FormField>

                        <FormField label="Segnalazione">
                            <Select
                                options={REPORT_SOURCES}
                                value={maintenanceForm.report_source}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, report_source: val })
                                }
                                placeholder="-- Seleziona segnalazione --"
                            />
                        </FormField>

                        <FormField label="Inquilino">
                            <Select
                                options={clients}
                                value={maintenanceForm.client_id}
                                onChange={(val) =>
                                    setMaintenanceForm({ ...maintenanceForm, client_id: val })
                                }
                                placeholder="-- Seleziona un inquilino --"
                            />
                        </FormField>

                        <FormField label="Responsabile">
                            <Input
                                type="text"
                                value={maintenanceForm.responsible}
                                onChange={(e) =>
                                    setMaintenanceForm({
                                        ...maintenanceForm,
                                        responsible: e.target.value,
                                    })
                                }
                                placeholder="Scrivi qui il responsabile"
                            />
                        </FormField>
                    </div>

                    <div className="mb-6">
                        <FormField label="Descrizione">
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                                value={maintenanceForm.description}
                                onChange={(e) =>
                                    setMaintenanceForm({
                                        ...maintenanceForm,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Aggiungi una descrizione qui"
                            />
                        </FormField>
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" variant="primary">
                            Salva
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* CHECK-IN MODAL */}
            <Modal
                isOpen={modalState.checkin}
                onClose={() => closeModal('checkin')}
                title={editMode ? 'Modifica check-in' : 'Inserisci nuovo check-in'}
                maxWidth="4xl"
            >
                <form onSubmit={handleCheckinSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <FormField label="Data check-in" error={checkinErrors.checkin_date} required>
                            <DatePicker
                                value={checkinForm.checkin_date}
                                onChange={(date) =>
                                    setCheckinForm({ ...checkinForm, checkin_date: date[0] })
                                }
                                placeholder="Seleziona una data e un orario"
                                enableTime={true}
                            />
                        </FormField>

                        <FormField label="Luogo check-in" error={checkinErrors.location} required>
                            <Select
                                options={CHECKIN_LOCATIONS}
                                value={checkinForm.location}
                                onChange={(val) => setCheckinForm({ ...checkinForm, location: val })}
                                placeholder="-- Seleziona un luogo --"
                            />
                        </FormField>

                        <FormField label="Inquilino">
                            <Select
                                options={clients}
                                value={checkinForm.client_id}
                                onChange={(val) =>
                                    setCheckinForm({ ...checkinForm, client_id: val })
                                }
                                placeholder="-- Seleziona un inquilino --"
                            />
                        </FormField>

                        <FormField label="Seleziona un contratto">
                            <Select
                                options={contracts}
                                value={checkinForm.contract_id}
                                onChange={(val) =>
                                    setCheckinForm({ ...checkinForm, contract_id: val })
                                }
                                placeholder="-- Seleziona un contratto --"
                            />
                        </FormField>
                    </div>

                    <div className="mb-6">
                        <FormField label="Descrizione">
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                                value={checkinForm.description}
                                onChange={(e) =>
                                    setCheckinForm({ ...checkinForm, description: e.target.value })
                                }
                                placeholder="Aggiungi una descrizione qui"
                            />
                        </FormField>
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" variant="primary">
                            Salva
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* CHECK-OUT MODAL */}
            <Modal
                isOpen={modalState.checkout}
                onClose={() => closeModal('checkout')}
                title={editMode ? 'Modifica check-out' : 'Inserisci nuovo check-out'}
                maxWidth="4xl"
            >
                <form onSubmit={handleCheckoutSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <FormField label="Data check-out" error={checkoutErrors.checkout_date} required>
                            <DatePicker
                                value={checkoutForm.checkout_date}
                                onChange={(date) =>
                                    setCheckoutForm({ ...checkoutForm, checkout_date: date[0] })
                                }
                                placeholder="Seleziona una data e un orario"
                                enableTime={true}
                            />
                        </FormField>

                        <FormField label="Luogo check-out" error={checkoutErrors.location} required>
                            <Select
                                options={CHECKIN_LOCATIONS}
                                value={checkoutForm.location}
                                onChange={(val) =>
                                    setCheckoutForm({ ...checkoutForm, location: val })
                                }
                                placeholder="-- Seleziona un luogo --"
                            />
                        </FormField>

                        <FormField label="Inquilino">
                            <Select
                                options={clients}
                                value={checkoutForm.client_id}
                                onChange={(val) =>
                                    setCheckoutForm({ ...checkoutForm, client_id: val })
                                }
                                placeholder="-- Seleziona un inquilino --"
                            />
                        </FormField>

                        <FormField label="Seleziona un contratto">
                            <Select
                                options={contracts}
                                value={checkoutForm.contract_id}
                                onChange={(val) =>
                                    setCheckoutForm({ ...checkoutForm, contract_id: val })
                                }
                                placeholder="-- Seleziona un contratto --"
                            />
                        </FormField>
                    </div>

                    <div className="mb-6">
                        <FormField label="Descrizione">
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                                value={checkoutForm.description}
                                onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, description: e.target.value })
                                }
                                placeholder="Aggiungi una descrizione qui"
                            />
                        </FormField>
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" variant="primary">
                            Salva
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* SEGNALAZIONE MODAL */}
            <Modal
                isOpen={modalState.segnalazione}
                onClose={() => closeModal('segnalazione')}
                title={editMode ? 'Modifica segnalazione' : 'Inserisci nuova segnalazione'}
                maxWidth="4xl"
            >
                <form onSubmit={handleReportSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <FormField 
                            label="Seleziona immobile"
                            error={reportErrors.property_id}
                            required
                        >
                            <Select
                                options={properties}
                                value={reportForm.property_id}
                                onChange={(val) => setReportForm({ ...reportForm, property_id: val })}
                                placeholder="-- Seleziona un immobile --"
                            />
                        </FormField>

                        <FormField 
                            label="Seleziona stanza"
                            error={reportErrors.room_id}
                            required
                        >
                            <Select
                                options={filteredRooms}
                                value={reportForm.room_id}
                                onChange={(val) => setReportForm({ ...reportForm, room_id: val })}
                                placeholder="-- Seleziona una stanza --"
                                isDisabled={!reportForm.property_id}
                            />
                        </FormField>

                        <FormField
                            label="Nome dell'attività"
                            error={reportErrors.activity_name}
                            required
                        >
                            <Select
                                options={ACTIVITY_NAMES}
                                value={reportForm.activity_name}
                                onChange={(val) =>
                                    setReportForm({ ...reportForm, activity_name: val })
                                }
                                placeholder="-- Seleziona un'attività --"
                            />
                        </FormField>

                        <FormField label="Tipologia urgenza" error={reportErrors.urgency_type} required>
                            <Select
                                options={URGENCY_TYPES}
                                value={reportForm.urgency_type}
                                onChange={(val) =>
                                    setReportForm({ ...reportForm, urgency_type: val })
                                }
                                placeholder="-- Seleziona urgenza --"
                            />
                        </FormField>

                        <FormField label="Data inizio lavori">
                            <DatePicker
                                value={reportForm.start_date}
                                onChange={(date) =>
                                    setReportForm({ ...reportForm, start_date: date[0] })
                                }
                                placeholder="Seleziona una data e un orario"
                                enableTime={true}
                            />
                        </FormField>

                        <FormField label="Data fine lavori" error={reportErrors.end_date}>
                            <DatePicker
                                value={reportForm.end_date}
                                onChange={(date) =>
                                    setReportForm({ ...reportForm, end_date: date[0] })
                                }
                                placeholder="Seleziona una data e un orario"
                                enableTime={true}
                            />
                        </FormField>

                        <FormField label="Responsabile">
                            <Input
                                type="text"
                                value={reportForm.responsible}
                                onChange={(e) =>
                                    setReportForm({ ...reportForm, responsible: e.target.value })
                                }
                                placeholder="Scrivi qui il responsabile"
                            />
                        </FormField>
                    </div>

                    <div className="mb-6">
                        <FormField label="Descrizione">
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                                value={reportForm.description}
                                onChange={(e) =>
                                    setReportForm({ ...reportForm, description: e.target.value })
                                }
                                placeholder="Aggiungi una descrizione qui"
                            />
                        </FormField>
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" variant="primary">
                            Salva
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* EVENT DETAILS MODAL */}
            {selectedEvent && (
                <Modal
                    isOpen={modalState.eventDetails}
                    onClose={() => {
                        setModalState((prev) => ({ ...prev, eventDetails: false }));
                        setSelectedEvent(null);
                    }}
                    title={
                        selectedEvent.type === 'maintenance'
                            ? 'Dettagli manutenzione'
                            : selectedEvent.type === 'checkin'
                            ? 'Dettagli check in'
                            : selectedEvent.type === 'checkout'
                            ? 'Dettagli check out'
                            : 'Dettagli segnalazione'
                    }
                    size="md"
                >
                    <div className="space-y-4">
                        {/* Event name */}
                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-800">
                                {selectedEvent.type === 'maintenance'
                                    ? GET_MAINTENANCE_LABEL(selectedEvent.data.maintenance_name)
                                    : selectedEvent.type === 'checkin'
                                    ? GET_CHECKIN_LOCATION_LABEL(selectedEvent.data.location)
                                    : selectedEvent.type === 'checkout'
                                    ? GET_CHECKIN_LOCATION_LABEL(selectedEvent.data.location)
                                    : GET_ACTIVITY_NAME_LABEL(selectedEvent.data.activity_name)}
                            </p>
                        </div>

                        {/* Start date */}
                        {selectedEvent.start && (
                            <div className="text-center">
                                <p className="text-gray-700">
                                    <span className="font-bold">Inizio:</span>{' '}
                                    {new Date(selectedEvent.start).toLocaleString('it-IT', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>
                        )}

                        {/* End date */}
                        {selectedEvent.end && (
                            <div className="text-center">
                                <p className="text-gray-700">
                                    <span className="font-w-[800]">Fine:</span>{' '}
                                    {new Date(selectedEvent.end).toLocaleString('it-IT', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-center gap-3 pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setModalState((prev) => ({ ...prev, eventDetails: false }));
                                    setSelectedEvent(null);
                                }}
                            >
                                Chiudi{' '}
                                {selectedEvent.type === 'maintenance'
                                    ? 'manutenzione'
                                    : selectedEvent.type === 'checkin'
                                    ? 'check in'
                                    : selectedEvent.type === 'checkout'
                                    ? 'check out'
                                    : 'segnalazione'}
                            </Button>

                            <Button variant="danger" onClick={handleDeleteEvent}>
                                Elimina{' '}
                                {selectedEvent.type === 'maintenance'
                                    ? 'manutenzione'
                                    : selectedEvent.type === 'checkin'
                                    ? 'check in'
                                    : selectedEvent.type === 'checkout'
                                    ? 'check out'
                                    : 'segnalazione'}
                            </Button>

                            <Button variant="primary" onClick={handleEditEvent}>
                                Modifica{' '}
                                {selectedEvent.type === 'maintenance'
                                    ? 'manutenzione'
                                    : selectedEvent.type === 'checkin'
                                    ? 'check in'
                                    : selectedEvent.type === 'checkout'
                                    ? 'check out'
                                    : 'segnalazione'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}