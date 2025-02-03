"use client";
import { OnlineResource } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../assets/images/harry_potter.jpg";
import Link from "next/link";


interface ResourceProps {
  resource: OnlineResource;
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */
const ResourceInfo = (props: ResourceProps) => {
  const { resource } = props;

  return (
    <div>
      <Link
        href={`books/${resource.id}`}
        className="flex items-start"
      >
        <div className="w-[568px] h-[326px] ml-3 mt-3">
          <Image
            src={imageToAdd.src}
            alt="Book Cover"
            width={210}
            height={300}
            className="w-[121px] h-[160px]"
          />
            <div className="text-left mt-6 mb-4">
            <h3 className="text-lg text-black font-semibold">{resource.name}</h3>
                <p className="text-black mt-1">{resource.level.replace("_", " ")}<span className="mx-1">•</span>{resource.topic}</p>
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

        <div className="align-middle">
          
        </div>
      </Link>
    </div>
  );
};

export default ResourceInfo;
