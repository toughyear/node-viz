export type JSONObject = {
  [key: string]: string | number | boolean | null | JSONObject | JSONArray;
};

export type JSONArray = Array<
  string | number | boolean | null | JSONObject | JSONArray
>;

export type RootItem =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;
