type Product = {
  Namen: string;
  Preis: number;
  Beschreibung?: string;
  Lagerbestand?: number;
};
const toText = (index: Product) => JSON.stringify(index);
type Role = "admin" | "user" | "keyuser";
type Email = `${string}@${string}.${string}`;

interface Benutzer {
  Benutzername: string;
  Email: Email;
  login?: Date;
  logout?: Date;
  passwort: string;
  role: Role;
}

const Laptop: Product = {
  Namen: "Legion 5",
  Preis: 1000,
  Beschreibung: "The Best LAPTOP FOR GAMERS",
  Lagerbestand: 2,
};

const i = toText(Laptop);
console.log(toText(Laptop));
console.log(typeof i);

class Queue<T> {
  private items: T[] = [];
  constructor() {}

  enqueue(item: T) {
    this.items.push(item);
  }
  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
// https://www.basedash.com/blog/how-to-implement-a-queue-in-typescript
