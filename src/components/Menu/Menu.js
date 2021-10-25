import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { SelectorIcon } from 'vue-tabler-icons';
export default {
    props: {
        options: {
            type: Array,
            default: [],
        },
    },
    components: { Menu, MenuButton, MenuItems, MenuItem, SelectorIcon },
    setup() { },
};
