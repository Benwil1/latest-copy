'use client';

import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';

interface FileInputProps {
	onChange: (files: File[]) => void;
	value?: File[];
	maxFiles?: number;
	className?: string;
}

export function FileInput({
	onChange,
	value = [],
	maxFiles = 5,
	className,
}: FileInputProps) {
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		// Clean up the preview URLs when the component unmounts
		return () => {
			previews.forEach((preview) => URL.revokeObjectURL(preview));
		};
	}, [previews]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
			onChange(newFiles);

			// Clean up old preview URLs
			previews.forEach((preview) => URL.revokeObjectURL(preview));

			// Create preview URLs for the new files
			const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
			setPreviews(newPreviews);
		},
		[maxFiles, onChange, value, previews]
	);

	const removeFile = (index: number) => {
		const newFiles = value.filter((_, i) => i !== index);
		onChange(newFiles);

		// Clean up the removed preview URL
		URL.revokeObjectURL(previews[index]);
		const newPreviews = previews.filter((_, i) => i !== index);
		setPreviews(newPreviews);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
		},
		maxFiles: maxFiles - value.length,
		disabled: value.length >= maxFiles,
	});

	return (
		<div className={className}>
			<div
				{...getRootProps()}
				className={cn(
					'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
					isDragActive
						? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
						: 'border-muted-foreground/20 hover:border-muted-foreground/50',
					value.length >= maxFiles && 'pointer-events-none opacity-60'
				)}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center gap-2">
					<ImagePlus className="h-8 w-8 text-muted-foreground" />
					<div className="text-sm text-muted-foreground">
						{isDragActive ? (
							<p>Drop the files here ...</p>
						) : (
							<p>
								Drag & drop images here, or click to select
								{maxFiles > 1 && ` (max ${maxFiles} files)`}
							</p>
						)}
					</div>
				</div>
			</div>

			{value.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
					{value.map((file, index) => (
						<div
							key={index}
							className="relative aspect-[4/3] rounded-lg overflow-hidden group"
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={previews[index]}
								alt={`Preview ${index + 1}`}
								className="h-full w-full object-cover"
							/>
							<Button
								size="icon"
								variant="destructive"
								className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={(e) => {
									e.stopPropagation();
									removeFile(index);
								}}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
