<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
  >
    <div class="flex justify-between items-center">
      {{ date }}
    </div>
    <div class="flex justify-end space-x-3 items-center mr-11">
      {{ currency }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
  transactions: Array,
});

const sum = computed(() => {
  let total = 0;
  if (!Array.isArray(props.transactions)) {
    return 0;
  }

  for (const transaction of props.transactions) {
    if (transaction.type === "Income") {
      total += transaction.amount;
    } else {
      total -= transaction.amount;
    }
  }
  return total;
});
const { currency } = useCurrency(sum);
</script>

<style></style>
