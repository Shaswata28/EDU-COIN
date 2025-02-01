export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasNumber &&
    hasSpecialChar
  );
};

export const validateEmail = (email: string): boolean => {
  return email.endsWith('@eastdelta.edu.bd');
};

export const validatePin = (pin: string): boolean => {
  return /^\d{5}$/.test(pin);
};