import axios from 'axios';
const API_URL = 'http://localhost:5000';

export async function listVisitLogs() {
    const response = await axios.get(`${API_URL}/api/logs`);
    return response.data;
}

export async function createVisitLog(entry) {
    const response = await axios.post(`${API_URL}/api/logs/add`, entry);
    return response.data;
}

export async function getVisitLog(id) {
    const response = await axios.get(`${API_URL}/api/logs/${id}`);
    return response.data;
}

export async function updateVisitLog(id, entry) {
    const response = await axios.post(`${API_URL}/api/logs/update/${id}`, entry);
    return response.data;
}

export async function deleteVisitLog(id) {
    const response = await axios.delete(`${API_URL}/api/logs/${id}`);
    return response.data;
}
