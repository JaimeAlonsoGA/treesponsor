import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  images: File[];
  setImages: any;
}

export function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages((prevImages: File[]) => [...prevImages, ...acceptedFiles]);
    },
    [setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = (index: number) => {
    setImages((prevImages: File[]) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer rounded-md hover:border-primary transition-colors duration-200">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((file, index) => (
          <div key={index} className="relative h-24 w-24 group">
            <Image src={URL.createObjectURL(file) || "/placeholder.svg"} alt={`Uploaded image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
            <Button type="button" variant="destructive" size="icon" className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={() => removeImage(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
