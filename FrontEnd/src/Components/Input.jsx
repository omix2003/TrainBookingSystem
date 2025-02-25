import React, { useId, useState, useEffect } from 'react';

const Input = React.forwardRef(({
    label,
    type = "text",
    className = "",
    ...props
}, ref) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    // Check if the input has value to keep label floated
    useEffect(() => {
        if (props.value?.length > 0) {
            setIsFocused(true);
        }
    }, [props.value]);

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
    };

    return (
        <div className='relative w-full flex flex-col p-4'>
            {label && (
                <label
                    htmlFor={id}
                    className={`absolute left-6 transition-all duration-200
                    ${isFocused || hasValue ? 'top-6 bg-white px-0.5 text-xs text-orange-500 ' : 'top-10 text-base text-gray-500'}`}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`w-full border-gray-700 bg-white outline-none p-2 mt-4 ${className} ${isFocused  ? 'border-2 border-orange-500' : 'border'}`}
                ref={ref}
                {...props}
                id={id}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
            />
        </div>
    );
});

export default Input;
