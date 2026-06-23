import axios from 'axios';

const API_BASE = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || '';

const client = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

async function getCompliances() {
	const res = await client.get('/api/compliances');
	return res.data;
}

async function getCompliance(id) {
	const res = await client.get(`/api/compliances/${id}`);
	return res.data;
}

async function addCompliance(data) {
	const res = await client.post('/api/compliances', data);
	return res.data;
}

async function updateCompliance(id, data) {
	const res = await client.put(`/api/compliances/${id}`, data);
	return res.data;
}

async function deleteCompliance(id) {
	const res = await client.delete(`/api/compliances/${id}`);
	return res.status === 204 ? null : res.data;
}

const api = { getCompliances, getCompliance, addCompliance, updateCompliance, deleteCompliance };

export default api;

