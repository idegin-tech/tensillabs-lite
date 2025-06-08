export interface PricingTier {
  name: string;
  ngnAmount: number;
  usdAmount: number;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    ngnAmount: 5000,
    usdAmount: 5,
  },
  {
    name: 'Pro',
    ngnAmount: 15000,
    usdAmount: 15,
  },
  {
    name: 'Enterprise',
    ngnAmount: 30000,
    usdAmount: 30,
  },
];
