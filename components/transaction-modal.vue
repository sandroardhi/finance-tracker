<template>
  <div>
    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          {{ isEditing ? "Edit" : "Add" }} Add Transaction
        </template>

        <!-- :state="state" is only for the validation -->
        <UForm :state="state" :schema="schema" ref="form" @submit="save">
          <UFormGroup label="Transction Type" required name="type" class="mb-4">
            <USelect
              :disabled="isEditing"
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
              v-model="state.created_at"
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
          <UButton
            :loading="isLoading"
            label="Save"
            type="submit"
            color="black"
            variant="solid"
          />
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { categories, transactionTypes } from "~/constants.js";
import { z } from "zod";

const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const props = defineProps({
  transaction: {
    type: Object,
    required: false,
  },
});

const isEditing = computed(() => !!props.transaction);

const emit = defineEmits(["inserted"]);
const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const state = ref(
  isEditing.value
    ? {
        type: props.transaction.type,
        amount: props.transaction.amount,
        created_at: props.transaction.created_at.split('T')[0],
        description: props.transaction.description,
        category: props.transaction.category,
      }
    : {
        ...initialState,
      }
);
const resetForm = () => {
  Object.assign(
    state.value,
    isEditing.value
      ? {
          type: props.transaction.type,
          amount: props.transaction.amount,
          created_at: props.transaction.created_at.split('T')[0],
          description: props.transaction.description,
          category: props.transaction.category,
        }
      : initialState
  );
  form.value.clear();
};

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
  if (form.value.errors.length) return;

  // store to supabase
  isLoading.value = true;
  try {
    const { error } = await supabase.from("transactions").upsert({
      ...state.value,
      // di supabase, upsert itu bisa ngerangkap jadi update/insert sesuai dg param/data yg diberi
      // kalo gaada id, dia bakal bikin record baru, kalo ada dia bakal ngupdate sesuai id nya. nah ini kita check aja ada transaction g di props yg dikirm? kalo ga adaa berarti ini value id nya bakal undefined dan upsert nya jadi insert aja
      id: props.transaction?.id,
    });

    if (!error) {
      toastSuccess({
        title: "Transaction saved succesfully",
      });
      emit("inserted");
      return;
    }

    throw error;
  } catch (error) {
    toastError({
      title: "Transaction not saved",
      description: error.message,
    });
  } finally {
    isLoading.value = false;
  }
};

// defineModel is a way to declare a two way data binding props for children and its parent.
// lapo o kok gak nggae props ae? isOpen e dikirim teko parent. well, props iku read only, so isOpen e mek isok di open tok gaisok di close wkakaka
const isOpen = defineModel();
watch(isOpen, () => {
  if (!isOpen.value) {
    resetForm();
  }
  console.log(isEditing.value, props.transaction, state.value);
});
</script>

<style></style>
