export const HanabiMode = {
  Make: 0,
  Contest: 1,
};

export type HanabiMode = (typeof HanabiMode)[keyof typeof HanabiMode];
