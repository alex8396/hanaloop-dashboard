import { useState, useEffect, useCallback } from 'react';
import { fetchCompanies, fetchCountries, Company, Country } from '@/lib/api';

export function useDashboardData() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [compData, countData] = await Promise.all([
        fetchCompanies(),
        fetchCountries()
      ]);
      setCompanies(compData);
      setCountries(countData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { companies, countries, isLoading, error, refetch: loadData };
}
