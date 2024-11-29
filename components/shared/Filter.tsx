import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  filters: { name: string; value: string }[];
  containerClasses: string;
  otherClasses: string;
}

export default function Filter({
  filters,
  containerClasses,
  otherClasses,
}: Props) {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select >
        <SelectTrigger
    
          className={`${otherClasses} body-regular 
          background-light800_dark300 light-border 
          text-dark500_light700 
          min-h-[56px] border px-4 py-2.5 focus:ring-0 focus:ring-offset-1 `}
        >
          <SelectValue placeholder="Select Filter" />
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem value={filter.value} key={filter.value} className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400">
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
