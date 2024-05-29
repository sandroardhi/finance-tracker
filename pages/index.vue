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

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false"/>
      <Trend color="red" title="Expense" :amount="4000" :last-amount="13000" :loading="false"/>
      <Trend color="green" title="Investments" :amount="7000" :last-amount="4000" :loading="false"/>
      <Trend color="green" title="Saving" :amount="4000" :last-amount="3000" :loading="true"/>
    </section>

    <section>
      <Transaction />
      <Transaction />
      <Transaction />
      <Transaction />
    </section>
  </main>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);
</script>

<style></style>
