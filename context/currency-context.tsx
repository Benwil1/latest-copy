'use client';

import { getCurrencyByCountry } from '@/lib/country-currency';
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

interface CurrencyInfo {
	code: string;
	symbol: string;
}

interface CurrencyContextType {
	currency: CurrencyInfo;
	setCurrencyByCountry: (country: string) => void;
	setCurrency: (currency: CurrencyInfo) => void;
}

const defaultCurrency = getCurrencyByCountry('United States');

const CurrencyContext = createContext<CurrencyContextType | undefined>(
	undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
	const [currency, setCurrencyState] = useState<CurrencyInfo>(defaultCurrency);

	// Set currency by country name
	const setCurrencyByCountry = (country: string) => {
		setCurrencyState(getCurrencyByCountry(country));
	};

	// Directly set currency (for manual override, if needed)
	const setCurrency = (currency: CurrencyInfo) => {
		setCurrencyState(currency);
	};

	// Optionally, auto-detect on mount (e.g., from localStorage or IP)
	useEffect(() => {
		// Example: try to get country from localStorage or window
		const storedCountry = localStorage.getItem('country');
		if (storedCountry) {
			setCurrencyByCountry(storedCountry);
		}
	}, []);

	return (
		<CurrencyContext.Provider
			value={{ currency, setCurrencyByCountry, setCurrency }}
		>
			{children}
		</CurrencyContext.Provider>
	);
}

export function useCurrency() {
	const context = useContext(CurrencyContext);
	if (!context) {
		throw new Error('useCurrency must be used within a CurrencyProvider');
	}
	return context;
}
