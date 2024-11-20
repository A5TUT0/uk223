type Role = "admin" | "user" | "keyuser";
type Email = `${string}@${string}.${string}`; // Source: https://stackoverflow.com/questions/76548204/is-there-a-way-to-use-typescript-to-constrain-string-primitives-to-valid-email-s
type date = Date;

interface Person {
  Benutzername: string;
  Email: Email;
  login?: date;
  logout?: date;
  passwort: string;
  role: Role;
}
