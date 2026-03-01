export const getMinDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toISOString().split('T')[0];
};

export const getMaxDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split('T')[0];
};

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
