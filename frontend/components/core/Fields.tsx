import React, { useId } from "react";
import { Controller, UseFormRegister } from "react-hook-form";
import Select from "react-select";

const formClasses = "input input-bordered w-full form-fix";

function Label({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
            {children}
        </label>
    );
}

type Types = "text" | "password" | "email" | "number";

type RulesProps = {
    min?: number;
    max?: number;
    required?: boolean | string;
    email?: boolean;
    confirmPassword?: {};
};

type FieldProps = {
    name: string;
    label?: string;
    className?: string;
    type?: Types;
    rules?: RulesProps;
    register: UseFormRegister<any>;
    [key: string]: any;
};

type Rules = {
    required?: boolean | string;
    minLength?: {
        value: number;
        message: string;
    };
    maxLength?: {
        value: number;
        message: string;
    };
    pattern?: {
        value: RegExp;
        message: string;
    };
    // eslint-disable-next-line no-unused-vars
    validate?: (value: {}) => boolean | string;
};

export function TextField({ name, label, type = "text", className, register, rules, error, ...props }: FieldProps) {
    let id = useId();
    const formRules: Rules = {};
    const { min, max, email, confirmPassword, required } = rules || {};

    if (required) {
        formRules["required"] = typeof required === "boolean" ? `${label} is required` : required;
    }

    if (min) {
        formRules["minLength"] = {
            value: min,
            message: `${label} must have a minimum of ${min} characters`,
        };
    }

    if (max) {
        formRules["maxLength"] = {
            value: max,
            message: `${label} must have a minimum of ${max} characters`,
        };
    }

    if (email) {
        formRules["pattern"] = {
            value: /\S+@\S+\.\S+/,
            message: "Entered value does not match email format",
        };
    }

    if (confirmPassword) {
        formRules["validate"] = (value: {}) => value === confirmPassword || "Passwords do not match";
    }

    return (
        <div className={className}>
            {label && <Label id={id}>{label}</Label>}
            <input id={id} type={type} {...props} className={formClasses} {...register(name, formRules)} />
            {error && <span className="text-xs text-red-400">{error.message}</span>}
        </div>
    );
}

export function SelectField({ name, label, className, register, ...props }: FieldProps) {
    let id = useId();

    return (
        <div className={className}>
            {label && <Label id={id}>{label}</Label>}
            <select id={id} {...props} className={formClasses} {...register(name)} />
        </div>
    );
}

export function CheckBoxField({ name, label, className, register, ...props }: FieldProps) {
    let id = useId();
    const formRules: Rules = {};

    return (
        <div className={className}>
            {label && <Label id={id}>{label}</Label>}
            <input id={id} type="checkbox" {...props} className="toggle toggle-primary" {...register(name, formRules)} />
        </div>
    );
}

export function MutiSelectField({ name, label, className, options, control, defaultValue }: any) {
    let id = useId();

    return (
        <div className={className}>
            {label && <Label id={id}>{label}</Label>}
            <Controller
                control={control}
                defaultValue={defaultValue}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Select isMulti classNamePrefix="select" options={options} onChange={onChange} onBlur={onBlur} value={value} />
                )}
            />
        </div>
    );
}
