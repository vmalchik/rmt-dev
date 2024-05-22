import { createContext } from "react";
import { useActiveJobItemId } from "../lib/hooks";

type ActiveIdContextProviderProps = {
  children: React.ReactNode;
};

type ActiveIdContextType = {
  activeId: number | null;
};

export const ActiveIdContext = createContext<ActiveIdContextType | null>(null);

// ActiveIdContextProvider optimizes usage of useActiveJobItemId hook which creates an event lister
// per usage. Creating many event listeners may degrade application performance. Additionally, there
// is no need to track same activeId on an individual component level since the value is the same.
export default function ActiveIdContextProvider({
  children,
}: ActiveIdContextProviderProps) {
  const activeId = useActiveJobItemId();

  return (
    <ActiveIdContext.Provider value={{ activeId }}>
      {children}
    </ActiveIdContext.Provider>
  );
}
