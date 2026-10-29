/**
 * Coordinator Context
 * Manages active club selection across all coordinator dashboard views.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { coordinatorService } from "@/api/services/coordinator.service";
import { CoordinatorClub } from "@/types/coordinator";
import { useAuth } from "@/context/auth-context";

interface CoordinatorContextType {
  clubs: CoordinatorClub[];
  activeClub: CoordinatorClub | null;
  setActiveClubId: (id: number) => void;
  isLoading: boolean;
  refreshClubs: () => Promise<void>;
}

const CoordinatorContext = createContext<CoordinatorContextType | undefined>(undefined);

export function CoordinatorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<CoordinatorClub[]>([]);
  const [activeClubId, setActiveClubIdState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClubs = async () => {
    setIsLoading(true);
    try {
      const data = await coordinatorService.getMyClubs();
      setClubs(data);
      if (data.length > 0) {
        // Auto-select first club or retain previous selection if valid
        setActiveClubIdState((prev) => {
          if (prev && data.some((c) => c.id === prev)) return prev;
          return data[0].id;
        });
      }
    } catch (err) {
      console.error("Failed to load coordinator clubs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [user]);

  const activeClub = clubs.find((c) => c.id === activeClubId) || clubs[0] || null;

  const setActiveClubId = (id: number) => {
    setActiveClubIdState(id);
  };

  return (
    <CoordinatorContext.Provider
      value={{
        clubs,
        activeClub,
        setActiveClubId,
        isLoading,
        refreshClubs: fetchClubs,
      }}
    >
      {children}
    </CoordinatorContext.Provider>
  );
}

export function useCoordinator() {
  const context = useContext(CoordinatorContext);
  if (!context) {
    throw new Error("useCoordinator must be used within a CoordinatorProvider");
  }
  return context;
}
