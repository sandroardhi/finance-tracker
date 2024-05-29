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
        :amount="4000"
        :last-amount="3000"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="4000"
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

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transactions").select();

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
