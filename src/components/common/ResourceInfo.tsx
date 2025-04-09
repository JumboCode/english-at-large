"use client";
import { OnlineResource } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import imageToAdd from "../../assets/images/harry_potter.jpg";
import ExportIcn from "../../assets/icons/ExportOnlineResource.svg";
import SaveIcn from "@/assets/icons/SaveOnlineResource.svg";

interface FolderProps {
  resource: OnlineResource;
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */
const DisplayFolder = (props: FolderProps) => {
  const { resource } = props;

  return (
    <div>
      <Link href={`books/${resource.id}`} className="flex items-start">
        <div className="relative w-full h-[367px] ml-3 mt-3">
          <div className="absolute right-2 flex space-x-1 ">
            <Image src={SaveIcn} alt="save icon" width={25} height={25} />
            <Image src={ExportIcn} alt="export icon" width={25} height={25} />
          </div>

          <Image
            src={imageToAdd.src}
            alt="Book Cover"
            width={210}
            height={300}
            className="w-[121px] h-[170px]"
          />
          <div className="text-left mt-5 mb-4">
            <h3 className="text-lg text-black font-semibold">
              {resource.name}
            </h3>
            <p className="text-black mt-1">
              {resource.level.replace("_", " ")}
              <span className="mx-1">•</span>
              {resource.topic}
            </p>
          </div>

          <div className="flex flex-wrap items-start">
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="flex flex-wrap gap-2">
                {resource.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center"
                  >
                    {skill.replace("_", " ")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DisplayFolder;
