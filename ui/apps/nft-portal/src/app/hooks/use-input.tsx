import { useState } from "react";

export function useInput() {
  const [v, setValue] = useState("");
  const input = <input onChange={(e) => setValue(e.target.value)} type="text" />;
  return [v, input];
}