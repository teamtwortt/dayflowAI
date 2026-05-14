import { createContext, useContext } from "react";

interface AddEventContextValue {
  openTrigger: number;
  triggerOpen: () => void;
}

export const AddEventContext = createContext<AddEventContextValue>({
  openTrigger: 0,
  triggerOpen: () => undefined,
});

export function useAddEventTrigger() {
  return useContext(AddEventContext);
}
