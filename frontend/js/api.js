const BASE_URL = "http://127.0.0.1:5000";

function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

async function register(email, password) {
    const resp = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return resp.json();
}

async function login(email, password) {
    const resp = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await resp.json();
    if (data.token) setToken(data.token);
    return data;
}

async function getEvents() {
    const resp = await fetch(`${BASE_URL}/events/`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    return resp.json();
}

async function createEvent(title, datetime, category) {
    const resp = await fetch(`${BASE_URL}/events/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ title, datetime, category })
    });
    return resp.json();
}

async function deleteEvent(eventId) {
    const resp = await fetch(`${BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    return resp.json();
}

async function getBriefing(city = "Washington DC") {
    const resp = await fetch(`${BASE_URL}/briefing/today?city=${city}`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    return resp.json();
}