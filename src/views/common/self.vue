<template>
    <div>
        个人中心
    </div>
</template>

<script>
export default {
    data () {

    },
    created () {
        this.$http('api/paper/list').then(({data}) =>　{
            console.log('data', data)
        })
    },
    methods: {

    }
}
</script>


