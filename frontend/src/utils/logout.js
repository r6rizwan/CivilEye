export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    window.location.href = "/";
};
