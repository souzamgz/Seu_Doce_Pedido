export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-[#613d20] shadow-sm focus:ring-[#613d20] ' +
                className
            }
        />
    );
}
 