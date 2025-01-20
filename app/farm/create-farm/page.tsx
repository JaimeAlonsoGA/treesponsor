import Image from "next/image";
import wateringTree from "@/assets/images/watering-tree.png";
import { FarmCreationForm } from "@/components/FarmCreationForm/FarmCreattionForm";

export default function CreateTreePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create a New Farm</h1>
      <div className="flex w-full">
        <FarmCreationForm />
      </div>
    </div>
  );
}
