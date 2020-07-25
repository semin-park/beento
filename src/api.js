import axios from 'axios';
const API_URL = 'http://localhost:5000';

export async function listLogEntries() {
    const response = await axios.get(`${API_URL}/api/logs`);
    return response.data;
}

export async function createLogEntry(entry) {
    const response = await axios.post(`${API_URL}/api/logs/add`, entry);
    return response.data;
}

export async function getLogEntry(id) {
    const response = await axios.get(`${API_URL}/api/logs/${id}`);
    return response.data;
}

export async function updateLogEntry(id, entry) {
    const response = await axios.post(`${API_URL}/api/logs/update/${id}`, entry);
    return response.data;
}

export async function deleteLogEntry(id) {
    const response = await axios.delete(`${API_URL}/api/logs/${id}`);
    return response.data;
}
