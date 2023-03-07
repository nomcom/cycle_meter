import { NumberRange } from "./common.js";

export type MarkerSearch = {
  id: number[]?;
  lat: NumberRange?;
  lng: NumberRange?;
  comment: string?;
};
