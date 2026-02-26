import { useState, useEffect } from "react";
import { getOrPlantCrystal, markIntroShown, crystalStatus, Crystal } from "../lib/crystal";

interface UseCrystalReturn {
  crystal: Crystal | null;
  isNew: boolean;
  loading: boolean;
  shouldShowIntro: boolean;
  dismissIntro: () => Promise<void>;
}

export function useCrystal(): UseCrystalReturn {
  const [crystal, setCrystal]           = useState<Crystal | null>(null);
  const [isNew, setIsNew]               = useState(false);
  const [loading, setLoading]           = useState(true);
  const [shouldShowIntro, setShowIntro] = useState(false);

  useEffect(() => {
    getOrPlantCrystal().then(({ crystal, isNew }) => {
      setCrystal(crystal);
      setIsNew(isNew);
      setShowIntro(!crystal.introShown);
      setLoading(false);

      if (crystal.tier === "founder") {
        console.log(crystalStatus(crystal));
      }
    });
  }, []);

  const dismissIntro = async () => {
    await markIntroShown();
    setShowIntro(false);
  };

  return { crystal, isNew, loading, shouldShowIntro, dismissIntro };
}
