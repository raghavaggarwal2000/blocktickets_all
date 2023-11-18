const TextInput = ({
    title,
    placeholder,
    multi,
    date,
    time,
    password,
    state,
    setState,
    required,
    disabled,
}) => {
    const handleChange = (e) => {
        setState(e.target.value);
    };
    return (
        <div className="flex flex-col w-full">
            <span className="font-semibold mb-1 text-silver">
                {title}
                {required && <span className="text-[#dc4437]"> *</span>}
            </span>
            {time ? (
                <input
                    type="time"
                    onChange={handleChange}
                    name={state}
                    value={state}
                    className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
                />
            ) : date ? (
                <input
                    type="date"
                    onChange={handleChange}
                    value={state}
                    name={state}
                    placeholder={placeholder}
                    className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
                />
            ) : multi ? (
                <textarea
                    rows="6"
                    onChange={handleChange}
                    value={state}
                    name={state}
                    placeholder={placeholder}
                    className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
                />
            ) : (
                <input
                    type={password ? "password" : "text"}
                    onChange={handleChange}
                    value={state}
                    name={state}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
                />
            )}
        </div>
    );
};
export default TextInput;
