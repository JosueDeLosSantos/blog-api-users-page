import { useState, ChangeEvent } from "react";

export default function useSelect() {
  const [selected, setSelected] = useState(true);
  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    if (selectedOption === "Yes") {
      setSelected(false);
    } else {
      setSelected(true);
    }
  }

  return { selected, onSelect };
}
