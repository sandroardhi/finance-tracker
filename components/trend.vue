<template>
  <div>
    <div class="font-bold" :class="[props.color]">
      {{ props.title }}
    </div>

    <div class="text-2xl font-extrabold mb-2">
      <USkeleton class="h-8 w-full" v-if="props.loading" />
      <div v-else>{{ currency }}</div>
    </div>

    <div>
      <USkeleton class="h-6 w-full" v-if="props.loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="{'green': trendingUp, 'red': !trendingUp}" />
        <div class="text-gray-500 dark:text-gray-400">{{percentageTrend}} vs last period</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});

// ini kita buat amount nya reactive biar pas si transactions e keupdate, useCurrency e keupdate jg
const {amount} = toRefs(props)

const trendingUp = computed(() => props.amount >= props.lastAmount);

const icon = computed(() =>
  trendingUp.value
    ? "i-heroicons-arrow-trending-up-20-solid"
    : "i-heroicons-arrow-trending-down-20-solid"
);

const percentageTrend = computed(() => {
  if (props.amount == 0 || props.lastAmount == 0 ) return '--%'

  const bigger = Math.max(props.amount, props.lastAmount)
  const lower = Math.min(props.amount, props.lastAmount)

  const ratio = ((bigger - lower) / lower) * 100

  return `${Math.ceil(ratio)}%`
})

// we cant do it like this, useCurrency emang computed, tapi dengan awakdewe ngirim props.amount seng ga reactive, de e gabakal ngupdate si amount e..
// so we have to make this props.amount reactive
// const {currency} = useCurrency(props.amount)
const {currency} = useCurrency(amount)

</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
