import api from './api';

/**
 * Calendar Service
 * Handles all calendar-related API calls
 */

const calendarService = {
    /**
     * Get all calendar events
     *
     * @returns {Promise} API response with all events
     */
    getAllEvents: async () => {
        const response = await api.get('/calendar/events');
        return response.data;
    },

    /**
     * Create a new maintenance event
     *
     * @param {Object} data - Maintenance data
     * @returns {Promise} API response
     */
    createMaintenance: async (data) => {
        const response = await api.post('/calendar/maintenance', data);
        return response.data;
    },

    /**
     * Create a new check-in event
     *
     * @param {Object} data - Check-in data
     * @returns {Promise} API response
     */
    createCheckin: async (data) => {
        const response = await api.post('/calendar/checkin', data);
        return response.data;
    },

    /**
     * Create a new check-out event
     *
     * @param {Object} data - Check-out data
     * @returns {Promise} API response
     */
    createCheckout: async (data) => {
        const response = await api.post('/calendar/checkout', data);
        return response.data;
    },

    /**
     * Create a new report event
     *
     * @param {Object} data - Report data
     * @returns {Promise} API response
     */
    createReport: async (data) => {
        const response = await api.post('/calendar/report', data);
        return response.data;
    },

    /**
     * Update a maintenance event
     *
     * @param {number} id - Maintenance ID
     * @param {Object} data - Maintenance data
     * @returns {Promise} API response
     */
    updateMaintenance: async (id, data) => {
        const response = await api.put(`/calendar/maintenance/${id}`, data);
        return response.data;
    },

    /**
     * Update a check-in event
     *
     * @param {number} id - Check-in ID
     * @param {Object} data - Check-in data
     * @returns {Promise} API response
     */
    updateCheckin: async (id, data) => {
        const response = await api.put(`/calendar/checkin/${id}`, data);
        return response.data;
    },

    /**
     * Update a check-out event
     *
     * @param {number} id - Check-out ID
     * @param {Object} data - Check-out data
     * @returns {Promise} API response
     */
    updateCheckout: async (id, data) => {
        const response = await api.put(`/calendar/checkout/${id}`, data);
        return response.data;
    },

    /**
     * Update a report event
     *
     * @param {number} id - Report ID
     * @param {Object} data - Report data
     * @returns {Promise} API response
     */
    updateReport: async (id, data) => {
        const response = await api.put(`/calendar/report/${id}`, data);
        return response.data;
    },

    /**
     * Delete a maintenance event
     *
     * @param {number} id - Maintenance ID
     * @returns {Promise} API response
     */
    deleteMaintenance: async (id) => {
        const response = await api.delete(`/calendar/maintenance/${id}`);
        return response.data;
    },

    /**
     * Delete a check-in event
     *
     * @param {number} id - Check-in ID
     * @returns {Promise} API response
     */
    deleteCheckin: async (id) => {
        const response = await api.delete(`/calendar/checkin/${id}`);
        return response.data;
    },

    /**
     * Delete a check-out event
     *
     * @param {number} id - Check-out ID
     * @returns {Promise} API response
     */
    deleteCheckout: async (id) => {
        const response = await api.delete(`/calendar/checkout/${id}`);
        return response.data;
    },

    /**
     * Delete a report event
     *
     * @param {number} id - Report ID
     * @returns {Promise} API response
     */
    deleteReport: async (id) => {
        const response = await api.delete(`/calendar/report/${id}`);
        return response.data;
    },
};

export default calendarService;
