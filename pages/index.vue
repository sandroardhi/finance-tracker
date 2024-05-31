<template>
  <main>
    <section class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-4xl font-extrabold">Hello, Sandro.</h1>
        <p class="text-base">
          These are your
          <span class="lowercase">{{ selectedView }}</span> summary
        </p>
      </div>

      <div>
        <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
      </div>
    </section>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
    >
      <Trend
        color="green"
        title="Income"
        :amount="incomeSum"
        :last-amount="3000"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="expenseSum"
        :last-amount="13000"
        :loading="isLoading"
      />
      <Trend
        color="green"
        title="Investments"
        :amount="7000"
        :last-amount="4000"
        :loading="isLoading"
      />
      <Trend
        color="green"
        title="Saving"
        :amount="4000"
        :last-amount="3000"
        :loading="isLoading"
      />
    </section>

    <section class="flex justify-between items-center mb-10">
        <div>
          <h2 class="text-2xl font-extrabold">Transactions</h2>
          <p class="text-gray-500 dark:text-gray-400">You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period</p>
        </div>
        <div>
          <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true"/>
          <!-- modal form -->
          <TransactionModal v-model="isOpen"/>
        </div>
    </section>

    <section v-if="!isLoading">
      <div
        v-for="(transactionOnThisDay, date) in transactionsGroupedByDate"
        :key="date"
        class="mb-10"
      >
        <DailyTransactionSummary
          :date="date"
          :transactions="transactionOnThisDay"
        />
        <!-- 
          @deleted="fetchTransaction"
          is handling emitted event from the child component (Transaction component), the "deleted" is the name of the emitted function
         -->
        <Transaction
          v-for="transaction in transactionOnThisDay"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refreshTransactions()"
        />
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i"/>
    </section>
  </main>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);

const supabase = useSupabaseClient();

const transactions = ref([]);
const isLoading = ref(false);
const toast = useToast();
const isOpen = ref(false)

const income = computed (
  () => transactions.value.filter(t => t.type === 'Income')
)
const incomeCount = computed (
  () => income.value.length
)
const incomeSum = computed (
  // reduce function returns one element from an array, 
  // (sum, transaction =>, the first param is the accumulator, think of it as the variable that will be returned (i think so, idk if this is right), we need to get it a default value (notice the 0 at the end of the callback function)
  // the second param is the current element, which is the individual object of income array
  () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const expense = computed(
  () => transactions.value.filter(t => t.type === 'Expense')
)
const expenseCount = computed (
  () => expense.value.length
)
const expenseSum = computed (
  () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)


const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transactions").select().order('created_at', {ascending: false});

      if (error) return [];

      return data;
    });

    return data.value
  } catch (error) {
    toast.add({
      title: error,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () => transactions.value = await fetchTransactions()

transactions.value = await fetchTransactions()

const transactionsGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }

  return grouped;
});
</script>

<style></style>
