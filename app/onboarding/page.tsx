'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { VideoUpload } from '@/components/video-upload';
import { useAuth } from '@/context/auth-context';
import { useCurrency } from '@/context/currency-context';
import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowLeft,
	ArrowRight,
	Camera,
	Check,
	Loader2,
	Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function OnboardingPage() {
	const router = useRouter();
	const { setCurrencyByCountry, currency } = useCurrency();
	const { user, updateProfile } = useAuth();
	const [step, setStep] = useState(1);
	const totalSteps = 8;
	const progress = (step / totalSteps) * 100;
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Centralized form state
	const [form, setForm] = useState({
		age: '',
		nationality: '',
		gender: '',
		photos: [], // array of URLs or base64 strings
		video: '', // URL or base64 string
		budget: '',
		preferredLocation: '',
		moveInDate: '',
		spaceType: '',
		bathroom: '',
		furnished: '',
		amenities: [],
		lifestyle: {
			smoking: '',
			pets: '',
			cleanliness: '',
			noise: '',
			guests: '',
			work: '',
		},
		bio: '',
		interests: [],
		roommatePreferences: {
			ageRange: '',
			gender: '',
			occupation: '',
		},
	});
	const [errors, setErrors] = useState({});

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Auto-detect country by IP and set currency on mount if nationality is not set
	useEffect(() => {
		if (!form.nationality) {
			fetch('https://ipapi.co/json/')
				.then((res) => res.json())
				.then((data) => {
					if (data && data.country_name) {
						setCurrencyByCountry(data.country_name);
					}
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Handle input changes
	const handleChange = (field: string, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: '' }));
	};

	// Handle nested lifestyle changes
	const handleLifestyleChange = (field: string, value: any) => {
		setForm((prev) => ({
			...prev,
			lifestyle: { ...prev.lifestyle, [field]: value },
		}));
		setErrors((prev) => ({ ...prev, [field]: '' }));
	};

	// Handle array fields (amenities, interests, photos)
	const handleArrayChange = (field: string, value: any) => {
		setForm((prev) => {
			const arr = prev[field];
			return {
				...prev,
				[field]: arr.includes(value)
					? arr.filter((v: any) => v !== value)
					: [...arr, value],
			};
		});
	};

	// Validation per step
	const validateStep = () => {
		const newErrors = {};
		if (step === 1) {
			if (!form.age) newErrors.age = 'Age is required';
			if (!form.nationality) newErrors.nationality = 'Nationality is required';
			if (!form.gender) newErrors.gender = 'Gender is required';
		}
		if (step === 2) {
			if (form.photos.length < 2)
				newErrors.photos = 'At least 2 photos required';
		}
		if (step === 3) {
			// Video is optional, skip for now
		}
		if (step === 4) {
			if (!form.budget) newErrors.budget = 'Budget is required';
			if (!form.preferredLocation)
				newErrors.preferredLocation = 'Location is required';
			if (!form.moveInDate) newErrors.moveInDate = 'Move-in date is required';
		}
		if (step === 5) {
			if (!form.spaceType) newErrors.spaceType = 'Space type is required';
			if (!form.bathroom)
				newErrors.bathroom = 'Bathroom preference is required';
			if (!form.furnished)
				newErrors.furnished = 'Furnished preference is required';
		}
		if (step === 6) {
			if (!form.lifestyle.smoking)
				newErrors.smoking = 'Smoking preference is required';
			if (!form.lifestyle.pets) newErrors.pets = 'Pet preference is required';
			if (!form.lifestyle.cleanliness)
				newErrors.cleanliness = 'Cleanliness is required';
			if (!form.lifestyle.noise)
				newErrors.noise = 'Noise tolerance is required';
			if (!form.lifestyle.guests)
				newErrors.guests = 'Guest preference is required';
			if (!form.lifestyle.work) newErrors.work = 'Work schedule is required';
		}
		if (step === 7) {
			if (!form.roommatePreferences.ageRange)
				newErrors.ageRange = 'Age range is required';
			if (!form.roommatePreferences.gender)
				newErrors.gender = 'Gender preference is required';
			if (!form.roommatePreferences.occupation)
				newErrors.occupation = 'Occupation is required';
		}
		if (step === 8) {
			if (!form.bio) newErrors.bio = 'Bio is required';
			if (form.interests.length === 0)
				newErrors.interests = 'Select at least 1 interest';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle next step
	const handleNext = async () => {
		if (!validateStep()) return;
		if (step < totalSteps) {
			setStep(step + 1);
		} else {
			setIsSubmitting(true);
			try {
				setCurrencyByCountry(form.nationality);
				localStorage.setItem('country', form.nationality);
				localStorage.setItem('onboarding', JSON.stringify(form));
				if (user) {
					await updateProfile({ ...form, nationality: form.nationality });
				}
				router.push('/home');
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	// Responsive container and sticky progress bar
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-2 py-4 bg-background dark:bg-[image:var(--onboarding-gradient)]">
			<div className="w-full max-w-lg mx-auto">
				<div className="sticky top-0 z-20 bg-background/80 dark:bg-card/90 backdrop-blur rounded-b-xl shadow-md mb-6">
					<div className="flex justify-between items-center px-4 pt-4 pb-2">
						<span className="text-xs font-medium text-muted-foreground">
							Step {step} of {totalSteps}
						</span>
						<span className="text-xs font-medium text-muted-foreground">
							{Math.round(progress)}% Complete
						</span>
					</div>
					<Progress
						value={progress}
						className="h-2 rounded-b-xl bg-muted dark:bg-muted/60 [&_.progress-bar]:bg-accent"
					/>
				</div>
				<motion.div
					key={step}
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -40 }}
					transition={{ duration: 0.3 }}
				>
					<Card className="w-full shadow-xl rounded-2xl bg-card/90 border border-border">
						<AnimatePresence mode="wait">
							{step === 1 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Basic Information
										</CardTitle>
										<CardDescription>
											Let's start with some basic details about you
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<label htmlFor="age" className="text-sm font-medium">
												Age
											</label>
											<Input
												id="age"
												type="number"
												placeholder="Enter your age"
												value={form.age}
												onChange={(e) => handleChange('age', e.target.value)}
												className="w-full"
											/>
											{errors.age && (
												<p className="text-xs text-red-500 mt-1">
													{errors.age}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label
												htmlFor="nationality"
												className="text-sm font-medium"
											>
												Nationality
											</label>
											<select
												id="nationality"
												value={form.nationality}
												onChange={(e) =>
													handleChange('nationality', e.target.value)
												}
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vibrant-orange focus-visible:ring-offset-2"
												title="Select your nationality"
											>
												<option value="">Select your nationality</option>
												<option value="United States">United States</option>
												<option value="Canada">Canada</option>
												<option value="United Kingdom">United Kingdom</option>
												<option value="Australia">Australia</option>
												<option value="Germany">Germany</option>
												<option value="France">France</option>
												<option value="Spain">Spain</option>
												<option value="Italy">Italy</option>
												<option value="Japan">Japan</option>
												<option value="China">China</option>
												<option value="India">India</option>
												<option value="Brazil">Brazil</option>
												<option value="Mexico">Mexico</option>
												<option value="South Africa">South Africa</option>
												<option value="Nigeria">Nigeria</option>
												<option value="Egypt">Egypt</option>
												<option value="Russia">Russia</option>
												<option value="Turkey">Turkey</option>
												<option value="Argentina">Argentina</option>
												<option value="Colombia">Colombia</option>
												<option value="Indonesia">Indonesia</option>
												<option value="Pakistan">Pakistan</option>
												<option value="Bangladesh">Bangladesh</option>
												<option value="Philippines">Philippines</option>
												<option value="Vietnam">Vietnam</option>
												<option value="Thailand">Thailand</option>
												<option value="Malaysia">Malaysia</option>
												<option value="Singapore">Singapore</option>
												<option value="South Korea">South Korea</option>
												<option value="Saudi Arabia">Saudi Arabia</option>
												<option value="United Arab Emirates">
													United Arab Emirates
												</option>
												<option value="Netherlands">Netherlands</option>
												<option value="Sweden">Sweden</option>
												<option value="Norway">Norway</option>
												<option value="Denmark">Denmark</option>
												<option value="Finland">Finland</option>
												<option value="Poland">Poland</option>
												<option value="Switzerland">Switzerland</option>
												<option value="Austria">Austria</option>
												<option value="Belgium">Belgium</option>
												<option value="Ireland">Ireland</option>
												<option value="Portugal">Portugal</option>
												<option value="Greece">Greece</option>
												<option value="Czech Republic">Czech Republic</option>
												<option value="Hungary">Hungary</option>
												<option value="Romania">Romania</option>
												<option value="Ukraine">Ukraine</option>
												<option value="Chile">Chile</option>
												<option value="Peru">Peru</option>
												<option value="New Zealand">New Zealand</option>
												<option value="Morocco">Morocco</option>
												<option value="Kenya">Kenya</option>
												<option value="Ghana">Ghana</option>
												<option value="Other">Other</option>
											</select>
											{errors.nationality && (
												<p className="text-xs text-red-500 mt-1">
													{errors.nationality}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label htmlFor="gender" className="text-sm font-medium">
												Gender
											</label>
											<select
												id="gender"
												value={form.gender}
												onChange={(e) => handleChange('gender', e.target.value)}
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vibrant-orange focus-visible:ring-offset-2"
											>
												<option value="">Select your gender</option>
												<option value="male">Male</option>
												<option value="female">Female</option>
												<option value="non-binary">Non-binary</option>
												<option value="other">Other</option>
												<option value="prefer-not-to-say">
													Prefer not to say
												</option>
											</select>
											{errors.gender && (
												<p className="text-xs text-red-500 mt-1">
													{errors.gender}
												</p>
											)}
										</div>
									</CardContent>
								</motion.div>
							)}
							{step === 2 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Upload Photos
										</CardTitle>
										<CardDescription>
											Add some photos to your profile
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
											<div
												className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-vibrant-orange/50 transition-colors"
												onClick={() => fileInputRef.current?.click()}
												tabIndex={0}
												role="button"
												aria-label="Add photo"
												onKeyPress={(e) =>
													(e.key === 'Enter' || e.key === ' ') &&
													fileInputRef.current?.click()
												}
											>
												<Camera className="h-8 w-8 text-muted-foreground mb-2" />
												<span className="text-xs text-muted-foreground">
													Add Photo
												</span>
												<input
													type="file"
													accept="image/*"
													multiple
													ref={fileInputRef}
													style={{ display: 'none' }}
													aria-label="Add photo"
													onChange={async (e) => {
														const files = Array.from(e.target.files || []);
														const base64s = await Promise.all(
															files.map(
																(file) =>
																	new Promise<string>((resolve) => {
																		const reader = new FileReader();
																		reader.onload = (ev) =>
																			resolve(ev.target?.result as string);
																		reader.readAsDataURL(file);
																	})
															)
														);
														setForm((prev) => ({
															...prev,
															photos: [...prev.photos, ...base64s],
														}));
													}}
												/>
											</div>
											{form.photos.slice(0, 2).map((photo, idx) => (
												<div
													key={idx}
													className="aspect-square rounded-lg overflow-hidden border-2 border-muted-foreground/25 flex items-center justify-center relative group"
												>
													<img
														src={photo}
														alt={`Photo ${idx + 1}`}
														className="w-full h-full object-cover"
													/>
													<button
														type="button"
														className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
														aria-label="Remove photo"
														onClick={() =>
															setForm((prev) => ({
																...prev,
																photos: prev.photos.filter((_, i) => i !== idx),
															}))
														}
													>
														&times;
													</button>
												</div>
											))}
										</div>
										<div className="flex gap-2 mt-2 flex-wrap">
											{form.photos.slice(2).map((photo, idx) => (
												<img
													key={idx}
													src={photo}
													alt={`Photo ${idx + 3}`}
													className="w-12 h-12 object-cover rounded border"
												/>
											))}
										</div>
										{errors.photos && (
											<p className="text-xs text-red-500 mt-2">
												{errors.photos}
											</p>
										)}
									</CardContent>
								</motion.div>
							)}
							{step === 3 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Video Introduction
										</CardTitle>
										<CardDescription>
											Add a short video to introduce yourself to potential
											roommates
										</CardDescription>
									</CardHeader>
									<CardContent>
										<VideoUpload />
										<div className="mt-4 text-sm text-muted-foreground">
											<p>
												Adding a video introduction increases your chances of
												finding a roommate by 70%.
											</p>
										</div>
									</CardContent>
								</motion.div>
							)}
							{step === 4 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Housing Preferences
										</CardTitle>
										<CardDescription>
											Tell us about your housing needs
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<label htmlFor="budget" className="text-sm font-medium">
												Monthly Budget ({currency.code})
											</label>
											<div className="relative">
												<Input
													id="budget"
													type="number"
													placeholder={`Enter your maximum budget in ${currency.code}`}
													value={form.budget}
													onChange={(e) =>
														handleChange('budget', e.target.value)
													}
													className="w-full pr-16"
												/>
												<span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
													{currency.symbol}
												</span>
											</div>
											{errors.budget && (
												<p className="text-xs text-red-500 mt-1">
													{errors.budget}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label htmlFor="location" className="text-sm font-medium">
												Preferred Location
											</label>
											<Input
												id="location"
												placeholder="Enter city or neighborhood"
												value={form.preferredLocation}
												onChange={(e) =>
													handleChange('preferredLocation', e.target.value)
												}
												className="w-full"
											/>
											{errors.preferredLocation && (
												<p className="text-xs text-red-500 mt-1">
													{errors.preferredLocation}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label
												htmlFor="move-in-date"
												className="text-sm font-medium"
											>
												Preferred Move-in Date
											</label>
											<Input
												id="move-in-date"
												type="date"
												value={form.moveInDate}
												onChange={(e) =>
													handleChange('moveInDate', e.target.value)
												}
												className="w-full"
											/>
											{errors.moveInDate && (
												<p className="text-xs text-red-500 mt-1">
													{errors.moveInDate}
												</p>
											)}
										</div>
									</CardContent>
								</motion.div>
							)}
							{step === 5 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Living Space Preferences
										</CardTitle>
										<CardDescription>
											Tell us about your ideal living arrangement
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Preferred Space Type
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
												{[
													'Private Room',
													'Shared Room',
													'Entire Apartment',
													'Studio',
												].map((type) => (
													<Button
														key={type}
														variant={
															form.spaceType === type ? 'default' : 'outline'
														}
														className={`h-auto py-2 ${
															form.spaceType === type
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() => handleChange('spaceType', type)}
														type="button"
													>
														{type}
													</Button>
												))}
											</div>
											{errors.spaceType && (
												<p className="text-xs text-red-500 mt-1">
													{errors.spaceType}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Bathroom Preference
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
												{['Private Bathroom', 'Shared Bathroom'].map((bath) => (
													<Button
														key={bath}
														variant={
															form.bathroom === bath ? 'default' : 'outline'
														}
														className={`h-auto py-2 ${
															form.bathroom === bath
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() => handleChange('bathroom', bath)}
														type="button"
													>
														{bath}
													</Button>
												))}
											</div>
											{errors.bathroom && (
												<p className="text-xs text-red-500 mt-1">
													{errors.bathroom}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Furnished Preference
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
												{[
													'Fully Furnished',
													'Partially Furnished',
													'Unfurnished',
												].map((furn) => (
													<Button
														key={furn}
														variant={
															form.furnished === furn ? 'default' : 'outline'
														}
														className={`h-auto py-2 ${
															form.furnished === furn
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() => handleChange('furnished', furn)}
														type="button"
													>
														{furn}
													</Button>
												))}
											</div>
											{errors.furnished && (
												<p className="text-xs text-red-500 mt-1">
													{errors.furnished}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Required Amenities
											</label>
											<div className="flex flex-wrap gap-2">
												{[
													'WiFi',
													'Laundry',
													'Parking',
													'AC',
													'Heating',
													'Gym',
													'Pool',
												].map((amenity) => (
													<Button
														key={amenity}
														variant={
															form.amenities.includes(amenity)
																? 'default'
																: 'outline'
														}
														size="sm"
														className={`rounded-full ${
															form.amenities.includes(amenity)
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() =>
															handleArrayChange('amenities', amenity)
														}
														type="button"
													>
														{amenity}
													</Button>
												))}
											</div>
										</div>
									</CardContent>
								</motion.div>
							)}
							{step === 6 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Lifestyle Preferences
										</CardTitle>
										<CardDescription>
											Help us find compatible roommates for you
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Smoking Preference
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
												{['Non-smoker', 'Occasional', 'Smoker'].map((smoke) => (
													<Button
														key={smoke}
														variant={
															form.lifestyle.smoking === smoke
																? 'default'
																: 'outline'
														}
														className={`h-auto py-2 ${
															form.lifestyle.smoking === smoke
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() =>
															handleLifestyleChange('smoking', smoke)
														}
														type="button"
													>
														{smoke}
													</Button>
												))}
											</div>
											{errors.smoking && (
												<p className="text-xs text-red-500 mt-1">
													{errors.smoking}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Pet Preference
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
												{['No pets', 'Has pets', 'Pet friendly'].map((pet) => (
													<Button
														key={pet}
														variant={
															form.lifestyle.pets === pet
																? 'default'
																: 'outline'
														}
														className={`h-auto py-2 ${
															form.lifestyle.pets === pet
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() => handleLifestyleChange('pets', pet)}
														type="button"
													>
														{pet}
													</Button>
												))}
											</div>
											{errors.pets && (
												<p className="text-xs text-red-500 mt-1">
													{errors.pets}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Cleanliness Level
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
												{['Very neat', 'Average', 'Relaxed'].map((clean) => (
													<Button
														key={clean}
														variant={
															form.lifestyle.cleanliness === clean
																? 'default'
																: 'outline'
														}
														className={`h-auto py-2 ${
															form.lifestyle.cleanliness === clean
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() =>
															handleLifestyleChange('cleanliness', clean)
														}
														type="button"
													>
														{clean}
													</Button>
												))}
											</div>
											{errors.cleanliness && (
												<p className="text-xs text-red-500 mt-1">
													{errors.cleanliness}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Noise Tolerance
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
												{['Very quiet', 'Moderate', "Don't mind noise"].map(
													(noise) => (
														<Button
															key={noise}
															variant={
																form.lifestyle.noise === noise
																	? 'default'
																	: 'outline'
															}
															className={`h-auto py-2 ${
																form.lifestyle.noise === noise
																	? 'ring-2 ring-vibrant-orange'
																	: ''
															}`}
															onClick={() =>
																handleLifestyleChange('noise', noise)
															}
															type="button"
														>
															{noise}
														</Button>
													)
												)}
											</div>
											{errors.noise && (
												<p className="text-xs text-red-500 mt-1">
													{errors.noise}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Guest Preferences
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
												{['No guests', 'Occasional', 'Frequent OK'].map(
													(guest) => (
														<Button
															key={guest}
															variant={
																form.lifestyle.guests === guest
																	? 'default'
																	: 'outline'
															}
															className={`h-auto py-2 ${
																form.lifestyle.guests === guest
																	? 'ring-2 ring-vibrant-orange'
																	: ''
															}`}
															onClick={() =>
																handleLifestyleChange('guests', guest)
															}
															type="button"
														>
															{guest}
														</Button>
													)
												)}
											</div>
											{errors.guests && (
												<p className="text-xs text-red-500 mt-1">
													{errors.guests}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Work Schedule
											</label>
											<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
												{[
													'Day worker',
													'Night worker',
													'Remote worker',
													'Student',
												].map((work) => (
													<Button
														key={work}
														variant={
															form.lifestyle.work === work
																? 'default'
																: 'outline'
														}
														className={`h-auto py-2 ${
															form.lifestyle.work === work
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() => handleLifestyleChange('work', work)}
														type="button"
													>
														{work}
													</Button>
												))}
											</div>
											{errors.work && (
												<p className="text-xs text-red-500 mt-1">
													{errors.work}
												</p>
											)}
										</div>
									</CardContent>
								</motion.div>
							)}
							{step === 7 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Roommate Preferences
										</CardTitle>
										<CardDescription>
											Tell us about your ideal roommate
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<label className="text-sm font-medium">Age Range</label>
											<Input
												placeholder="e.g. 23-35"
												value={form.roommatePreferences.ageRange}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														roommatePreferences: {
															...prev.roommatePreferences,
															ageRange: e.target.value,
														},
													}))
												}
												className="w-full"
											/>
											{errors.ageRange && (
												<p className="text-xs text-red-500 mt-1">
													{errors.ageRange}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Gender Preference
											</label>
											<select
												value={form.roommatePreferences.gender}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														roommatePreferences: {
															...prev.roommatePreferences,
															gender: e.target.value,
														},
													}))
												}
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
											>
												<option value="">No preference</option>
												<option value="male">Male</option>
												<option value="female">Female</option>
												<option value="non-binary">Non-binary</option>
											</select>
											{errors.gender && (
												<p className="text-xs text-red-500 mt-1">
													{errors.gender}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">Occupation</label>
											<Input
												placeholder="e.g. Professional/Student"
												value={form.roommatePreferences.occupation}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														roommatePreferences: {
															...prev.roommatePreferences,
															occupation: e.target.value,
														},
													}))
												}
												className="w-full"
											/>
											{errors.occupation && (
												<p className="text-xs text-red-500 mt-1">
													{errors.occupation}
												</p>
											)}
										</div>
									</CardContent>
								</motion.div>
							)}
							{step === 8 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
								>
									<CardHeader className="text-center">
										<CardTitle className="text-2xl font-bold">
											Almost Done!
										</CardTitle>
										<CardDescription>
											Tell us a bit more about yourself
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<label htmlFor="bio" className="text-sm font-medium">
												Bio
											</label>
											<textarea
												id="bio"
												placeholder="Write a short bio about yourself..."
												className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												value={form.bio}
												onChange={(e) => handleChange('bio', e.target.value)}
												className="w-full"
											/>
											{errors.bio && (
												<p className="text-xs text-red-500 mt-1">
													{errors.bio}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Interests (Select up to 5)
											</label>
											<div className="flex flex-wrap gap-2">
												{[
													'Reading',
													'Cooking',
													'Fitness',
													'Gaming',
													'Movies',
													'Music',
													'Travel',
													'Art',
													'Sports',
												].map((interest) => (
													<Button
														key={interest}
														variant={
															form.interests.includes(interest)
																? 'default'
																: 'outline'
														}
														size="sm"
														className={`rounded-full ${
															form.interests.includes(interest)
																? 'ring-2 ring-vibrant-orange'
																: ''
														}`}
														onClick={() => {
															if (form.interests.includes(interest)) {
																handleArrayChange('interests', interest);
															} else if (form.interests.length < 5) {
																handleArrayChange('interests', interest);
															}
														}}
														type="button"
														disabled={
															!form.interests.includes(interest) &&
															form.interests.length >= 5
														}
													>
														{interest}
													</Button>
												))}
											</div>
											<p className="text-xs text-muted-foreground mt-1">
												{form.interests.length}/5 selected
											</p>
											{errors.interests && (
												<p className="text-xs text-red-500 mt-1">
													{errors.interests}
												</p>
											)}
										</div>
									</CardContent>
								</motion.div>
							)}
						</AnimatePresence>
						<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center px-4 py-4 bg-background/80 rounded-b-2xl mt-4">
							<Button
								variant="ghost"
								onClick={handleBack}
								disabled={step === 1 || isSubmitting}
								className="rounded-full px-6 py-2 w-full sm:w-auto"
							>
								Back
							</Button>
							<Button
								variant="default"
								onClick={handleNext}
								disabled={isSubmitting}
								className="rounded-full px-8 py-2 text-base font-semibold bg-vibrant-orange hover:bg-orange-600 w-full sm:w-auto flex items-center justify-center"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="animate-spin h-5 w-5 mr-2" />
										{step === totalSteps ? 'Completing...' : 'Next'}
									</>
								) : step === totalSteps ? (
									<>
										Complete <Check className="ml-2 h-4 w-4" />
									</>
								) : (
									<>
										Next <ArrowRight className="ml-2 h-4 w-4" />
									</>
								)}
							</Button>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
