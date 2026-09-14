'use client';

import { useState, useMemo } from 'react';
import { rankSchemes } from '../lib/engines/recommender';
import { SchemeService } from '../lib/services/scheme.service';
import { RecommenderInput, SchemeMatchResult } from '../lib/types';

export function useRecommendations(initialInput: RecommenderInput) {
  const [input, setInput] = useState<RecommenderInput>(initialInput);

  const results: SchemeMatchResult[] = useMemo(() => {
    const all = SchemeService.getAllSchemes();
    return rankSchemes(all, input);
  }, [input]);

  return {
    input,
    setInput,
    results,
    bestMatch: results[0] || null,
  };
}
