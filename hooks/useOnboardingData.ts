import { useEffect, useState } from 'react';

export function useOnboardingData() {
	const [onboarding, setOnboarding] = useState<any>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const data = localStorage.getItem('onboarding');
			if (data) {
				setOnboarding(JSON.parse(data));
			}
		}
	}, []);

	return onboarding;
}
