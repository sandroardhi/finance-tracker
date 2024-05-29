<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-arrow-up-right-solid" class="text-green-600" />
        <div>Salary</div>
      </div>
      <div><UBadge color="white">Category</UBadge></div>
    </div>
    <div class="flex justify-end space-x-3 items-center">
      <div>{{currency}}</div>
      <div>
        <UDropdown
          :items="items"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid'
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid'
    },
  ]
]

const {currency} = useCurrency(3000)
</script>

<style></style>
