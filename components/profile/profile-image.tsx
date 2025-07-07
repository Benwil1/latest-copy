import Image from 'next/image';
import type { FC } from 'react';

export interface ProfileImageProps {
	src: string;
	alt: string;
}

export const ProfileImage: FC<ProfileImageProps> = ({ src, alt }) => (
	<div className="w-40 h-40 sm:w-56 sm:h-56 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
		<Image
			src={src}
			alt={alt}
			width={224}
			height={224}
			className="object-cover w-full h-full"
			loading="lazy"
			quality={90}
			style={{ background: '#222' }}
			placeholder="blur"
			blurDataURL="/placeholder.webp"
			sizes="(max-width: 640px) 160px, 224px"
			priority={false}
		/>
	</div>
);
