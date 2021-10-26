import { computed, watch } from 'vue';
import { useField } from 'vee-validate';
export default {
    props: {
        autocomplete: String,
        loading: Boolean,
        error: String,
        label: String,
        mask: String,
        customClass: String,
        modelValue: String,
        name: {
            type: String,
            required: true,
        },
        placeholder: String,
        required: Boolean,
        rules: Function,
        type: {
            type: String,
            default: 'text',
        },
    },
    emits: ['update:modelValue'],
    setup(props) {
        const { value: inputValue, errorMessage, handleBlur, handleChange, meta, } = useField(props.name, props.rules, {
            initialValue: props.modelValue,
        });
        watch(() => props.modelValue, val => (inputValue.value = val));
        const textareaClass = computed(() => {
            if (meta.valid || !meta.validated) {
                return 'focus-within:border-primary text-primary';
            }
            return 'border-red-600 text-red-600';
        });
        const errorLabel = computed(() => {
            return props.error || errorMessage.value;
        });
        return {
            handleChange,
            handleBlur,
            errorLabel,
            inputValue,
            meta,
            textareaClass,
        };
    },
};
