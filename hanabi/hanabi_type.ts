export type HanabiType = (typeof HanabiTypeList)[number];

const HanabiTypeList = ["Kiku", "Botan", "Rasing"] as const;

export const isHanabiType = (v: unknown): v is HanabiType => {
  return (HanabiTypeList as unknown as string[]).includes(String(v));
};
