import { AttributePart } from 'lit-html';

export const spread: <T extends object>(spreadData: T) => (part: AttributePart) => void;