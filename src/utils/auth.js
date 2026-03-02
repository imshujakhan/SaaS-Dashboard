export const isAuthenticated = () => {
  return !!localStorage.getItem("dealerId");
};

export const logout = () => {
  localStorage.removeItem("dealerId");
  localStorage.removeItem("dealerData");
};

export const getDealerId = () => {
  return localStorage.getItem("dealerId");
};
