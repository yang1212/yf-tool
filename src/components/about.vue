<template>
  <div>
    <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" />
    <button @click="fetchMachinesData">搜索</button>
    <table border="1">
      <tr>
        <th>日期</th>
        <th></th>
        <th :colspan="16">{{ selectedDate }}</th>
      </tr>
      <tr>
        <th>班次</th>
        <th></th>
        <th :colspan="8">白班</th>
        <th :colspan="8">晚班</th>
      </tr>
      <tr>
        <th>班台</th>
        <th>应用范围</th>
        <th v-for="i in 16" :key="i">{{ i + 7 }}时</th>
      </tr>
      <tr v-for="(machine, index) in machines" :key="index">
        <td>{{ machine.name }}</td>
        <td>{{ machine.range }}</td>
        <td v-for="i in 16" :key="i" :style="{ backgroundColor: getColor(machine, i + 7) }">
          <!-- 显示内容 -->
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'HomePage',
  data() {
    return {
      selectedDate: null,
      machines: [],
    };
  },
  methods: {
    async fetchMachinesData() {
      if (!this.selectedDate) return;

      // 在这里根据日期 fetch 数据（假设有一个API返回班台数据）
      // 这里只是示例数据，实际中会替换成API请求
      const response = [
        { name: "激光开料机", range: "Φ19.05~Φ44碳钢管", tasks: { 8: "working", 9: "working", 10: "working" } },
        { name: "银光开料机_1", range: "Φ7.94~Φ44碳钢管，及各种型号管", tasks: { 8: "idle", 9: "idle", 14: "working" } },
        { name: "银光开料机_2", range: "Φ7.94~Φ44碳钢管", tasks: { 10: "working", 15: "working" } },
      ];
      
      // 将返回的数据赋值给 machines
      this.machines = response;
    },
    getColor(machine, hour) {
      // 根据 hour 获取 tasks 的状态并返回对应颜色
      const taskStatus = machine.tasks[hour];
      if (taskStatus === "working") return "blue";
      if (taskStatus === "idle") return "gray";
      return "white"; // 默认颜色
    },
  },
};
</script>

<style>
th {
  width: 100px;
}
</style>
