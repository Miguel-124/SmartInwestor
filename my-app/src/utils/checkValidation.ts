export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  dobDate: Date | null;
}

export function validateRegistration(data: RegistrationData): string | null {
  const { firstName, lastName, email, password, confirm, dobDate } = data;

  if (!firstName.trim() || firstName.trim().length < 3) {
    return "Imię musi mieć co najmniej 3 znaki";
  }
  if (!lastName.trim() || lastName.trim().length < 3) {
    return "Nazwisko musi mieć co najmniej 3 znaki";
  }
  if (!dobDate) {
    return "Data urodzenia jest wymagana";
  }
  const ageDifMs = Date.now() - dobDate.getTime();
  const ageDate = new Date(ageDifMs); // epoch + różnica
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  if (age < 18) {
    return "Musisz mieć co najmniej 18 lat";
  }

  if (!email.trim()) {
    return "Email jest wymagany";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Nieprawidłowy format email";
  }

  if (password.length < 9) {
    return "Hasło musi mieć co najmniej 9 znaków";
  }
  if (!/\d/.test(password)) {
    return "Hasło musi zawierać co najmniej jedną cyfrę";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Hasło musi zawierać co najmniej jeden znak specjalny";
  }
  if (password !== confirm) {
    return "Hasła muszą być takie same";
  }

  return null;
}
