import { computed } from 'vue';
import { useField } from 'vee-validate';
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        autocomplete: String,
        error: String,
        label: String,
        loading: Boolean,
        mask: String,
        modelValue: String,
        options: {
            type: Array,
            default: [],
        },
        // placeholder: String,
        required: Boolean,
        // type: {
        //   type: String,
        //   default: 'text',
        // },
        rules: Function,
    },
    emits: ['update:modelValue'],
    setup(props) {
        const { value, errorMessage, handleBlur, handleChange, meta } = useField(props.name, props.rules, {
            initialValue: props.modelValue,
        });
        const customClass = computed(() => {
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
            value,
            meta,
            customClass,
        };
    },
};
