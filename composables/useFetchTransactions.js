export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient();
  const transactions = ref([]);
  const pending = ref(false);
  const isOpen = ref(false);

  const income = computed(() =>
    transactions.value.filter((t) => t.type === "Income")
  );
  const incomeCount = computed(() => income.value.length);
  const incomeSum = computed(
    // reduce function returns one element from an array,
    // (sum, transaction =>, the first param is the accumulator, think of it as the variable that will be returned (i think so, idk if this is right), we need to get it a default value (notice the 0 at the end of the callback function)
    // the second param is the current element, which is the individual object of income array
    () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const expense = computed(() =>
    transactions.value.filter((t) => t.type === "Expense")
  );
  const expenseCount = computed(() => expense.value.length);
  const expenseSum = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async () => {
    pending.value = true;
    try {
      const { data } = await useAsyncData(
        `transactions-${period.value.to.toDateString()}-${period.value.from.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from("transactions")
            .select()
            // gte iku greater then or equal
            // lte iku lesser then or equal, function postgreSQL
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });

          if (error) return [];

          return data;
        }
      );

      return data.value;
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    isOpen.value = false;
    
    return transactions.value = await fetchTransactions();
  };

  watch(period, async () => await refresh());
  // watch(period, async (previousValue, currentValue) => {
  //   if (
  //     previousValue.from.toISOString() === currentValue.from.toISOString() &&
  //     previousValue.to.toISOString() === currentValue.to.toISOString()
  //   ) {
  //     return;
  //   }
    
  //   await refresh();
  // });

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

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeCount,
      expenseCount,
      incomeSum,
      expenseSum,
    },
    refresh,
    pending,
    isOpen,
  };
};
