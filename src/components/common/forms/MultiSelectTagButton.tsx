"use client";
import { CustomChangeEvent } from "@/lib/util/types";
import TagButton from "../button/TagButton";
import { useMemo } from "react";

/**
 * Interface for the MultiSelect Tag Button props
 * @template T - The type of the value (must be string or PropertyKey)
 */
interface MultiSelectTagButtonProps<T extends string | PropertyKey> {
  name: string;
  label: T;
  value: T[];
  onSelect: (event: CustomChangeEvent<T[]>) => void;
  className?: string;
}

/**
 * A reusable, atomic MultiSelect Tag Button component that allows users to toggle selection
 * of individual tags within a group. This component is designed to be used in forms
 * where multiple selections are allowed.
 *
 * @template T - The type of the value (must be string or PropertyKey)
 *
 * @example
 * // Basic usage with string values
 * function MyForm() {
 *   const [selected, setSelected] = useState<string[]>([]);
 *
 *   const handleSelect = (event: CustomChangeEvent<string[]>) => {
 *     setSelected(event.target.value);
 *   };
 *
 *   return (
 *     <div>
 *       <SelectableTag
 *         name="categories"
 *         label="Fiction"
 *         value={selected}
 *         onSelect={handleSelect}
 *       />
 *       <SelectableTag
 *         name="categories"
 *         label="Non-Fiction"
 *         value={selected}
 *         onSelect={handleSelect}
 *       />
 *     </div>
 *   );
 * }
 *
 * @example
 * // Usage with custom types
 * type BookCategory = 'fiction' | 'non-fiction' | 'science' | 'history';
 *
 * function BookCategorySelector() {
 *   const [categories, setCategories] = useState<BookCategory[]>([]);
 *
 *   const handleSelect = (event: CustomChangeEvent<BookCategory[]>) => {
 *     setCategories(event.target.value);
 *   };
 *
 *   return (
 *     <div className="flex gap-2">
 *       <SelectableTag
 *         name="bookCategories"
 *         label="fiction"
 *         value={categories}
 *         onSelect={handleSelect}
 *         className="bg-blue-100"
 *       />
 *       <SelectableTag
 *         name="bookCategories"
 *         label="science"
 *         value={categories}
 *         onSelect={handleSelect}
 *         className="bg-green-100"
 *       />
 *     </div>
 *   );
 * }
 * @example
 * // Usage with object state - updating specific fields using [name]: value
 * interface BookFormData {
 *   title: string;
 *   categories: string[];
 *   tags: string[];
 * }
 *
 * function BookForm() {
 *   const [formData, setFormData] = useState<BookFormData>({
 *     title: '',
 *     categories: [],
 *     tags: []
 *   });
 *
 *   // This handler works with any field in the form data
 *   const handleChange = (event: CustomChangeEvent<any>) => {
 *     const { name, value } = event.target;
 *     setFormData(prev => ({
 *       ...prev,
 *       [name]: value
 *     }));
 *   };
 *
 *   return (
 *     <form>
 *       <input
 *         name="title"
 *         value={formData.title}
 *         onChange={handleChange}
 *       />
 *
 *       <div className="flex gap-2">
 *         <SelectableTag
 *           name="categories"
 *           label="fiction"
 *           value={formData.categories}
 *           onSelect={handleChange}
 *         />
 *         <SelectableTag
 *           name="categories"
 *           label="non-fiction"
 *           value={formData.categories}
 *           onSelect={handleChange}
 *         />
 *       </div>
 *
 *       <div className="flex gap-2">
 *         <SelectableTag
 *           name="tags"
 *           label="bestseller"
 *           value={formData.tags}
 *           onSelect={handleChange}
 *         />
 *         <SelectableTag
 *           name="tags"
 *           label="new-release"
 *           value={formData.tags}
 *           onSelect={handleChange}
 *         />
 *       </div>
 *     </form>
 *   );
 * }
 * @param props - The component props
 * @param props.name - The name of the field or property you are modifying
 * @notes - You can use this handle custom fields within and object  `target.name` and `[name]: value`
 * @returns A toggleable tag button that can be part of a multi-select group
 */
const MultiSelectTagButton = <T extends string | PropertyKey>({
  name,
  label,
  value,
  onSelect,
  className,
}: MultiSelectTagButtonProps<T>) => {
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

export default MultiSelectTagButton;
