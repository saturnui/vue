import { defineComponent, onMounted, ref } from 'vue';
import './FileDropElement.js';
export default defineComponent({
    emit: ['change'],
    setup(_, { emit }) {
        const dropzone = ref();
        const files = ref([]);
        let _selectedFiles = [];
        onMounted(() => {
            dropzone.value.addEventListener('filedrop', (event) => {
                files.value = [];
                _selectedFiles.length = 0;
                event.files.forEach(async (item) => {
                    if (!_selectedFiles.includes(item.name)) {
                        _selectedFiles.push(item.name);
                        files.value.push(item); // TODO: should not be never
                    }
                    emit('change', files.value);
                });
            });
        });
        return {
            dropzone,
            files,
        };
    },
});
