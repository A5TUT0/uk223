class Fahrzeug {
  private marke: string;
  private baujahr: number;
  private tankfull: number;

  constructor(marke: string, baujahr: number, tankfull: number) {
    this.marke = marke;
    this.baujahr = baujahr;
    this.tankfull = tankfull;
  }
  fahren() {
    return "Das Fahrzeug fährt und ist von der Marke " + this.marke;
  }
}
const Lambo = new Fahrzeug("Lamborgini", 2030, 1000000);
console.log(Lambo.fahren());

class Auto extends Fahrzeug {
  private turen: number;
  constructor(turen: number, marke: string, baujahr: number, tankfull: number) {
    super(marke, baujahr, tankfull);
    this.turen = turen;
  }
  numberOfTuren() {
    return this.turen;
  }
  hupen() {
    return "PIIIIIIIIIIIIIIIIII PIIIIIIIIIII PIIIIIIIIIII";
  }
}
const Ferrari = new Auto(2, "Ferrari", 1910, 10);
console.log(Ferrari.fahren());
console.log(Ferrari.hupen());
console.log(Ferrari.numberOfTuren());
class Lastwagen extends Fahrzeug {
  private maxWight: number;

  constructor(
    marke: string,
    baujahr: number,
    tankfull: number,
    maxWight: number
  ) {
    super(marke, baujahr, tankfull);
    this.maxWight = maxWight;
  }
  wight() {
    return this.maxWight;
  }
  beladen(index: number) {
    if (index > this.maxWight) return "😅 Your auto is to heavy";
    return "👍 You can pass";
  }
}
const Ferrari2 = new Auto(2, "Ferrari", 1910, 10);
const Lastwagen1 = new Lastwagen("SBB", 2000, 1000, 10000);

console.log(Lastwagen1.beladen(10));

class ElektroAuto extends Auto {
  private batteryCapacity: number;

  constructor(
    turen: number,
    marke: string,
    baujahr: number,
    tankfull: number,
    batteryCapacity: number
  ) {
    super(turen, marke, baujahr, tankfull);
    this.batteryCapacity = batteryCapacity;
  }

  checkBattery() {
    return this.batteryCapacity;
  }
}
