import { InputSelectorData } from "@/components/InputSelector"

export type SelectorOption = {
    value: InputSelectorData;
    isDisabled?: boolean;
}

export interface BaseSelectorProps {
    value?: InputSelectorData | InputSelectorData[]
    onChange: (value: InputSelectorData | InputSelectorData[]) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    isMulti?: boolean
}
