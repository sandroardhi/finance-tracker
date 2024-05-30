<template>
  <div>
    <UModal v-model="isOpen">
      <UCard>
        <template #header> Add Transaction </template>

        <!-- :state="state" is only for the validation -->
        <UForm
          :state="state"
          :schema="schema"
          ref="form"
          @submit.prevent="save"
        >
          <UFormGroup label="Transction Type" required name="type" class="mb-4">
            <USelect
              v-model="state.type"
              placeholder="Select the transaction type"
              :options="transactionTypes"
            />
          </UFormGroup>

          <UFormGroup label="Amount" required name="amount" class="mb-4">
            <UInput
              v-model.number="state.amount"
              type="number"
              placeholder="30000"
            />
          </UFormGroup>

          <UFormGroup
            label="Transaction date"
            required
            name="created_at"
            class="mb-4"
          >
            <UInput
              type="date"
              v-model="state.date"
              icon="i-heroicons-calendar-days-20-solid"
            />
          </UFormGroup>

          <UFormGroup label="Description" name="description" class="mb-4">
            <UInput
              type="text"
              v-model="state.description"
              placeholder="Ice Cream down the block."
            />
          </UFormGroup>

          <UFormGroup
            v-if="state.type === 'Expense'"
            label="Category"
            required
            name="category"
            class="mb-4"
          >
            <USelect
              placeholder="Select the category"
              v-model="state.category"
              :options="categories"
            />
          </UFormGroup>
          <UButton label="Save" type="submit" color="black" variant="solid" />
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { categories, transactionTypes } from "~/constants.js";
import { z } from "zod";

const form = ref();

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};
const state = ref({
  ...initialState
});
const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}

const defaultSchema = z.object({
  amount: z.number().positive("Amount cant be below 0"),
  created_at: z.string(),
  description: z.string().optional(),
});

// iki mirip if? idk kurang paham sebenere, pokoe z iku zod, gae validasi form
const incomeSchema = z.object({
  type: z.literal("Income"),
});
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});
const investmentSchema = z.object({
  type: z.literal("Investment"),
});
const savingSchema = z.object({
  type: z.literal("Saving"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);

const save = async () => {
  if (form.value.error.length) return
  
  // store to supabase
};


// defineModel is a way to declare a two way data binding props for children and its parent.
// lapo o kok gak nggae props ae? isOpen e dikirim teko parent. well, props iku read only, so isOpen e mek isok di open tok gaisok di close wkakaka
const isOpen = defineModel();
watch(isOpen, () => {
  if(!isOpen.value) {
    resetForm()
  }
})

</script>

<style></style>