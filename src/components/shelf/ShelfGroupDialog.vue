<template>
    <dialog :title="title" ref="dialog">
    </dialog>
</template>
<script>
import Dialog from 'components/common/Dialog.vue'
export default {
   name:'ShelfGroupDialog',
   components: { 
        Dialog 
    },
    computed: {
        title() {
            return this.$t('shelf.movebook')
        }
    },
    methods: {
        show() {
            this.$refs.dialog.show()
        }
    }

}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";

</style>
