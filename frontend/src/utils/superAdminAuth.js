export const setSuperAdminToken = (token) => {
    localStorage.setItem("superAdminToken", token);
};

export const getSuperAdminToken = () =>
    localStorage.getItem("superAdminToken");

export const clearSuperAdminToken = () => {
    localStorage.removeItem("superAdminToken");
};

export const superAdminAuthHeader = () => {
    const token = getSuperAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setAdminToken = (token) => {
    localStorage.setItem("adminToken", token);
};

export const getAdminToken = () => localStorage.getItem("adminToken");

export const clearAdminToken = () => {
    localStorage.removeItem("adminToken");
};

export const adminAuthHeader = () => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
