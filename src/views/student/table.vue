<template>
    <div>
        <table class="inpu">
            <thead>
                <th >姓名</th>
                <th >性别</th>
                <th >密码</th>
            </thead>
            <tbody>
                <tr v-for="i in tableRowLength">
                    <td contenteditable="true">tableData[i][0]</td>
                    <td contenteditable="true">tableData[i][1]</td>
                    <td contenteditable="true">tableData[i][2]</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tableRowLength: 10,
            tableData: [
                ['John', '男']
            ]
        }
    }
}
</script>
<style lang="scss">
    
</style>