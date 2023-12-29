import {
    TextField,
    MenuItem,
} from '@mui/material';
import ImageUpload from '@/components/ImageUpload';
import { useCallback, useEffect, useState } from 'react';

export default function TableColumnEditField(props) {
    const { col, validationErrors, setValidationErrors, onChange, value } = props

    if (!col.input)
        return

    const [localValue, setValue] = useState()
    useEffect(() => {
        setValue(value)
    },[value])

    const CustomOnChange = useCallback((e) => {
        setValue(e.target.value)
    },[])

    var input = col.input
    if (input.type == "image")
        return (
            <ImageUpload
                images={value}
                maxNumber={1}
                name={col.accessorKey}
                onChange={onChange}
            ></ImageUpload>
        )
    else
        return (
            <TextField
                label={col.header}
                name={col.accessorKey}
                required={input.required}
                type={input.type}
                variant={input.variant}
                fullWidth
                value={localValue || ""}
                multiline={input.multiline}
                InputProps={input.InputProps}
                select={input.optionList?.length >= 1}
                onChange={input.optionList?.length >= 1 ? onChange : CustomOnChange}
                onBlurCapture={onChange}

                InputLabelProps={{ shrink: true }}

                error={!!validationErrors?.[col.accessorKey]}
                helperText={validationErrors?.[col.accessorKey]}
                onFocus={() =>
                    setValidationErrors({
                        ...validationErrors,
                        [col.accessorKey]: undefined,
                    })}
            >
                {input.optionList?.map((e) => {
                    var value = input.optionValueAccessorFn?.(e) || e.value
                    var label = input.optionLabelAccessorFn?.(e) || e.label
                    return (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    )
                })}
            </TextField>
        )

}