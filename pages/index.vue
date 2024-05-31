<template>
  <main>
    <section class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-4xl font-extrabold">Hello, Sandro.</h1>
        <p class="text-base">
          These are your
          <span class="lowercase">{{ selectedPeriod }}</span> summary
        </p>
      </div>

      <div>
        <USelectMenu
          :options="transactionPeriodOptions"
          v-model="selectedPeriod"
        />
      </div>
    </section>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
    >
      <Trend
        color="green"
        title="Income"
        :amount="incomeSum"
        :last-amount="prevIncomeTotal"
        :loading="pending"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="expenseSum"
        :last-amount="prevExpenseTotal"
        :loading="pending"
      />
      <Trend
        color="green"
        title="Investments"
        :amount="7000"
        :last-amount="4000"
        :loading="pending"
      />
      <Trend
        color="green"
        title="Saving"
        :amount="4000"
        :last-amount="3000"
        :loading="pending"
      />
    </section>

    <section class="flex justify-between items-center mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <p class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses
          this period
        </p>
      </div>
      <div>
        <UButton
          icon="i-heroicons-plus-circle"
          color="white"
          variant="solid"
          label="Add"
          @click="isOpen = true"
        />
        <!-- modal form -->
        <TransactionModal v-model="isOpen" @inserted="refresh()" />
      </div>
    </section>

    <section v-if="!pending">
      <div
        v-for="(transactionOnThisDay, date) in byDate"
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
          @deleted="refresh()"
        />
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </main>
</template>

<script setup>
import { transactionPeriodOptions } from "~/constants";
const selectedPeriod = ref(transactionPeriodOptions[1]);

const {toastError, toastSuccess} = useAppToast();

// const isOpen = ref(false);
const { current, previous } = useSelectedTimePeriod(selectedPeriod);

const {
  pending,
  refresh,
  isOpen,
  transactions: {
    incomeCount,
    expenseCount,
    incomeSum,
    expenseSum,
    grouped: { byDate },
  },
} = useFetchTransactions(current);

const {
  refresh: refreshPrevious, transactions: {
    // ini diberi alias btw, bukan assign value.
    incomeSum: prevIncomeTotal,
    expenseSum: prevExpenseTotal,
  },
} = useFetchTransactions(previous);
await refresh();
await refreshPrevious()


</script>

<style></style>
