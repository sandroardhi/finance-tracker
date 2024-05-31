<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800"
  >
    <div class="flex justify-between items-center space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>
          <span class="font-semibold">{{ props.transaction.type }}</span> |
          {{ props.transaction.description }}
        </div>
      </div>
      <div>
        <UBadge color="white" v-if="props.transaction.category">{{
          props.transaction.category
        }}</UBadge>
      </div>
    </div>
    <div class="flex justify-end space-x-3 items-center">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(["deleted"]);

const isLoading = ref(false);
const {toastError, toastSuccess} = useAppToast();
const supabase = useSupabaseClient();

const isIncome = computed(() => props.transaction.type === "Income");
const icon = computed(() => {
  return isIncome.value
    ? "i-heroicons-arrow-up-right-solid"
    : "i-heroicons-arrow-down-left-solid";
});

const iconColor = computed(() => {
  return isIncome.value ? "text-green-600" : "text-red-600";
});

const deleteTransaction = async (id) => {
  isLoading.value = true;

  try {
    await supabase.from("transactions").delete().eq("id", props.transaction.id);
    toastSuccess({
      title: "Deleted succesfully",
    });
    emit("deleted", props.transaction.id);
  } catch (e) {
    toastError({
      title: e,
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];

const { currency } = useCurrency(props.transaction.amount);
</script>

<style></style>
