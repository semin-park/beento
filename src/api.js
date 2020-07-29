import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export async function listVisitLogs(userId) {
    const response = await axios.get(`${API_URL}/api/logs/all/${userId}`);
    return response.data;
}

export async function createVisitLog(userId, entry) {
    const data = {...entry, userId: userId};
    console.log(data);
    const response = await axios.post(`${API_URL}/api/logs/add`, data);
    return response.data;
}

export async function updateVisitLog(userId, postId, entry) {
    const response = await axios.post(`${API_URL}/api/logs/update/${postId}`, {...entry, userId: userId});
    return response.data;
}

export async function deleteVisitLog(userId, postId) {
    const response = await axios.delete(`${API_URL}/api/logs/${postId}`, {userId: userId});
    return response.data;
}
