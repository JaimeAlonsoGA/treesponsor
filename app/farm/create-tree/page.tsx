import { TreeCreationForm } from "@/components/TreeCreationForm";
import Image from "next/image";
import wateringTree from "@/assets/images/watering-tree.png";

export default function CreateTreePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create a New Tree</h1>
      <div className="flex">
        <TreeCreationForm />
        <Image src={wateringTree} className="h-fit" alt="" />
      </div>
    </div>
  );
}
