export const useFetchTransactions = () => {
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
      const { data } = await useAsyncData("transactions", async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .order("created_at", { ascending: false });

        if (error) return [];

        return data;
      });

      return data.value;

    } catch (error) {
      toast.add({
        title: error,
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    const fetchedTransactions = await fetchTransactions();
    if (fetchedTransactions) {
      transactions.value = fetchedTransactions;
    }
    isOpen.value = false;
  };
  
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
        byDate: transactionsGroupedByDate
      },
      income,
      expense,
      incomeCount,
      expenseCount,
      incomeSum,
      expenseSum
    },
    refresh,
    pending,
    isOpen
  }
};
