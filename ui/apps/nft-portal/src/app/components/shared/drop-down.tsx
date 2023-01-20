type OptionValue = number | string;

type Option<Type extends OptionValue> = {
  value: Type;
  label: string;
};

type DropDownProps<Type extends OptionValue> = {
  label: string,
  options: Option<Type>[];
  value: Type,
  onChange: (value: Type) => void;
};

export function DropDown<Type extends OptionValue>({ label, value, onChange, options }: DropDownProps<Type>) {

  function handleOnChange(e: React.FormEvent<HTMLSelectElement>) {
    const { selectedIndex } = e.currentTarget;
    const selectedOption = options[selectedIndex];
    onChange(selectedOption.value);
  }

  return (
      <select value={value} onChange={handleOnChange} className={`h-12 w-full form-select border-gray-300 text-sm cursor-pointer border-primary-gray-dark rounded-lg focus:outline-none`}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
  );
} 