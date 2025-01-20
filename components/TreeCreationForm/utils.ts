import L from 'leaflet';
import MapIcon from '@/assets/images/map-pin-alt.png';

export const customIcon = new L.Icon({
	iconUrl: MapIcon.src,
	iconSize: [48, 48],
	iconAnchor: [24, 48],
	popupAnchor: [0, -48],
})

export async function processImage(file: File): Promise<File> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					reject(new Error('Failed to get canvas context'));
					return;
				}

				// Calculate new dimensions (max 800x600)
				const scale = Math.min(800 / img.width, 600 / img.height, 1);
				canvas.width = img.width * scale;
				canvas.height = img.height * scale;

				// Draw image on canvas
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// Convert to WebP
				canvas.toBlob((blob) => {
					if (blob) {
						const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
							type: "image/webp",
						});
						resolve(newFile);
					} else {
						reject(new Error('Failed to create blob'));
					}
				}, 'image/webp', 0.8);
			};
			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = event.target?.result as string;
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}
