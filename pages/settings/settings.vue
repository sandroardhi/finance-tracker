<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose the default period for viewing transaction"
    >
      <USelect
        v-model="state.transactionPeriod"
        :options="transactionPeriodOptions"
      />
    </UFormGroup>
    <UFormGroup
      label="Theme"
      class="mb-4"
      help="Choose the default theme for this website"
    >
      <USelect
        :ui="{ base: 'capitalize' }"
        v-model="state.colorMode"
        :options="colorModes"
      />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
import { z } from "zod";
import { transactionPeriodOptions, colorModes } from "~/constants.js";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const colorMode = useColorMode();

const state = ref({
  transactionPeriod:
    user.value.user_metadata?.preferences?.transaction_period ??
    transactionPeriodOptions[1],
  colorMode: user.value.user_metadata?.preferences?.color_mode ?? colorModes[0],
});

watch(state.value, () => {
  colorMode.preference = state.value.colorMode;
}, {immediate: true});

const schema = z.object({
  transactionPeriod: z.enum(transactionPeriodOptions),
});
const saveSettings = async () => {
  pending.value = true;
  try {
    const data = {
      data: {
        preferences: {
          transaction_period: state.value.transactionPeriod,
          color_mode: state.value.colorMode,
        },
      },
    };
    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;
    toastSuccess({
      title: "Settings updated",
    });
  } catch (error) {
    toastError({
      title: "Error updating settings",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
