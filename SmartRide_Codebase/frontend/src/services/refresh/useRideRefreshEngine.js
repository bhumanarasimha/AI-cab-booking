import { useState, useEffect, useRef, useCallback } from 'react';
import { UberProvider } from '../providers/UberProvider';
import { OlaProvider } from '../providers/OlaProvider';
import { RapidoProvider } from '../providers/RapidoProvider';
import { SmartRideProvider } from '../providers/SmartRideProvider';
import { normalizeRideData } from '../normalization/normalizeRideData';
import { EMMDEDecisionEngine } from '../agents/EMMDEDecisionEngine';

export const useRideRefreshEngine = ({
  origin,
  destination,
  activeCategory = 'cab4',
  userPreferences = 'balanced',
  refreshIntervalMs = 10000,
  contextInputs = { weather: 'clear', urgency: 'normal' },
}) => {
  const [rawRideOptions, setRawRideOptions] = useState([]);
  const [processedResult, setProcessedResult] = useState({
    rankedOptions: [],
    topPick: null,
    decisionExplanation: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  const previousOptionsRef = useRef(new Map());

  const fetchAndProcess = useCallback(async (isManualTrigger = false) => {
    if (isManualTrigger) {
      setIsRefreshing(true);
    }

    try {
      const [uberData, olaData, rapidoData, smartData] = await Promise.all([
        UberProvider.fetchOptions({ origin, destination, isLiveMode }),
        OlaProvider.fetchOptions({ origin, destination, isLiveMode }),
        RapidoProvider.fetchOptions({ origin, destination, isLiveMode }),
        SmartRideProvider.fetchOptions({ origin, destination, isLiveMode }),
      ]);

      const allRaw = [...uberData, ...olaData, ...rapidoData, ...smartData];
      setRawRideOptions(allRaw);

      const now = new Date();
      const newPrevMap = new Map();

      const normalizedList = allRaw.map(raw => {
        const tempId = `${raw.rawProvider.toLowerCase()}_${raw.type.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const previousItem = previousOptionsRef.current.get(tempId) || null;

        const normalized = normalizeRideData(raw, previousItem, now);
        newPrevMap.set(normalized.id, normalized);
        return normalized;
      });

      previousOptionsRef.current = newPrevMap;
      setLastUpdatedTime(now);
      setSecondsAgo(0);

      const categoryFiltered = activeCategory === 'all' 
        ? normalizedList 
        : normalizedList.filter(o => o.category === activeCategory);

      const decisionResult = EMMDEDecisionEngine.process({
        rideOptions: categoryFiltered.length > 0 ? categoryFiltered : normalizedList,
        userPreferences,
        contextInputs,
      });

      setProcessedResult(decisionResult);
    } catch (error) {
      console.error('Error fetching ride data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [origin, destination, isLiveMode, activeCategory, userPreferences, contextInputs]);

  useEffect(() => {
    fetchAndProcess();
  }, [fetchAndProcess]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAndProcess();
      }
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [refreshIntervalMs, fetchAndProcess]);

  useEffect(() => {
    const ticker = setInterval(() => {
      const diffSec = Math.max(0, Math.floor((new Date() - lastUpdatedTime) / 1000));
      setSecondsAgo(diffSec);
    }, 1000);

    return () => clearInterval(ticker);
  }, [lastUpdatedTime]);

  return {
    rawRideOptions,
    rankedOptions: processedResult.rankedOptions,
    topPick: processedResult.topPick,
    decisionExplanation: processedResult.decisionExplanation,
    isLoading,
    isRefreshing,
    isLiveMode,
    setIsLiveMode,
    lastUpdatedTime,
    secondsAgo,
    manualRefresh: () => fetchAndProcess(true),
  };
};
