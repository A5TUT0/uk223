class BankAccount {
  private kontostand: boolean;
  private kontonummer: number;
  private pincode: number;
  private money: number;
  private debt: number;
  private bankName: string;
  constructor(kontonummer, kontostand, pincode, money, debt, bankName) {
    this.kontonummer = kontonummer;
    this.kontostand = kontostand;
    this.pincode = pincode;
    this.money = money;
    this.debt = debt;
    this.bankName = bankName;
  }
  addMoney(index: number) {
    return this.money + index;
  }
  restMoney(pin, index: number) {
    if (pin === this.pincode && index < this.money) {
      return this.money - index;
    }
    return "ERROR";
  }
  statusMoney(pin) {
    if (pin === this.pincode) {
      return this.money;
    }
    return "Error";
  }
  debtStatus() {
    if (this.debt > this.money) return "😐 You dont have more money 👍";
    return "😁 ALL OK";
  }
  getBankName() {
    return this.bankName;
  }
}
const UBS = new BankAccount(true, 123123123, 1233, 100, 200, "UBS");
const add = UBS.addMoney(100);
console.log(add);
const rest = UBS.restMoney(1233, 100);
console.log(rest);
const money = UBS.statusMoney(1233);
console.log(UBS.debtStatus());
console.log(UBS.getBankName());
console.log(money);
//console.log(UBS);
