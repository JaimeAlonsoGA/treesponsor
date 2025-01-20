"use client";

import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import Image1 from "@/assets/images/first-tree.png";
import Image from "next/image";

export const SponsorYourFirstTree = () => {
  return (
    <div className="flex gap-4 shadow-md w-fit mx-auto rounded-md p-4">
      <Image src={Image1} className="rounded-md" alt="farmer" objectFit="cover" height={200} />
      <div className="flex flex-grow justify-between flex-col w-full ">
        <div>
          <h2 className="text-3xl font-semibold">Mision: Sponsor your first tree</h2>
          <p className="text-lg">Lets get started by finding just the right tree for you.</p>
        </div>
        <Button className="self-end" size={"lg"} onClick={() => redirect("/trees")}>
          Find a tree
        </Button>
      </div>
    </div>
  );
};
