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
    <div className="md:flex md:items-center my-6">
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <select value={value} onChange={handleOnChange} className={`w-11/12 form-select shadow-sm rounded border-gray-300 bg-gray-50 text-sm cursor-pointer focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 