export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+7\d{10}$/;

export const isValidEmail = (email: string) => emailRegex.test(email);
export const isValidPhone = (phone: string) => phoneRegex.test(phone);
