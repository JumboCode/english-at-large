import { CustomChangeEvent } from "@/lib/util/types";
import TagButton from "../button/TagButton";
import { useMemo } from "react";

interface SelectableTagProps<T extends string | PropertyKey> {
  name: string;
  label: T;
  value: T[];
  onSelect: (event: CustomChangeEvent<T[]>) => void;
  className?: string;
}

const SelectableTag = <T extends string | PropertyKey>({
  name,
  label,
  value,
  onSelect,
  className,
}: SelectableTagProps<T>) => {
  // check if tag is selected
  const isSelected = useMemo(() => {
    if (Array.isArray(value)) {
      return value.includes(label);
    } else {
      return label === value;
    }
  }, [label, value]);

  const toggleSelected = () => {
    let newValue: T | T[];

    if (Array.isArray(value)) {
      newValue = isSelected
        ? value.filter((item) => item !== label)
        : [...value, label];
    } else {
      newValue = isSelected ? value : [value];
    }

    onSelect({
      target: {
        name,
        value: newValue,
      },
    });
  };

  return (
    <TagButton
      label={String(label)}
      isSelected={isSelected}
      onClick={toggleSelected}
      className={className}
    />
  );
};

export default SelectableTag;
