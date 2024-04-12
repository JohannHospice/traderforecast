export class Strategy {
  name: string;
  onTime(time: number, exchange: ExchangeProxy): Promise<void>;
}
