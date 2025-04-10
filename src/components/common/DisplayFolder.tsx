"use client";
import Image from "next/image";
import Link from "next/link";
import ExportIcn from "../../assets/icons/ExportOnlineResource.svg";
import folder from "@/assets/icons/folder.svg";

interface FolderProps {
  resource: {
    id: string;
    name: string;
    count: number;
  };
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
      <Link
        href={`https://drive.google.com/drive/folders/${resource.id}`}
        target="_blank"
        className="flex items-start"
      >
        <div className="relative w-full h-[180px] ml-3 mt-3">
          <div className="absolute right-2 flex space-x-1 ">
            <Image src={ExportIcn} alt="export icon" width={25} height={25} />
          </div>
          <div className="absolute bottom-0 left-0 text-left mt-5 mb-4">
            <Image
              src={folder}
              alt="folder icon"
              width={40}
              height={40}
              className="p-1"
            />
            <h3 className="text-lg text-black font-semibold pt-2">
              {resource.name}
            </h3>
            <p>{resource.count} resources in this folder</p>
          </div>
        </div>
      </Link>{" "}
    </div>
  );
};

export default DisplayFolder;
