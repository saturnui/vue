export default {
    emits: ['update:modelValue', 'submit'],
    props: {
        title: {
            type: String,
            default: '',
        },
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
};
