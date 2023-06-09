<template>
    <q-table
        ref="expenseTable"
        v-model:pagination="pagination"
        :rows="expenses"
        :columns="columns"
        :loading="loading"
        @request="loadExpenses"
        loading-label="Carregando despesas..."
    >
        <template v-slot:top-left>
            <div class="text-h5">Despesas</div>
        </template>
        <template v-slot:body-cell-actions="options">
            <q-td class="text-center">
                <q-btn
                    @click="openExpenseModal(options.row)"
                    color="primary"
                    class="q-mr-sm"
                    icon="edit"
                    round
                    size="sm"
                ></q-btn>
                <q-btn
                    @click="deleteExpense(options.row)"
                    color="negative"
                    class="q-ml-sm"
                    icon="delete"
                    round
                    size="sm"
                ></q-btn>
            </q-td>
        </template>

        <template v-slot:top-right>
            <q-input clearable v-model="filter" label="Pesquisar" class="q-mr-md" filled>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
            <q-btn @click="openExpenseModal()" color="primary" icon="add" label="Nova despesa" />
        </template>
    </q-table>

    <ConfirmExpenseDeletionDialog
        @expense-deleted="reloadExpenses"
        v-model="showDeleteDialog"
        :expense="currentDeletionExpense"
    />

    <ExpenseDialog @expense-saved="reloadExpenses" v-model="showExpenseDialog" :expense="currentExpense" />
</template>

<script setup>
    import { api } from "src/boot/axios";
    import { onMounted, ref, watch } from "vue";
    import ConfirmExpenseDeletionDialog from "./ConfirmExpenseDeletionDialog.vue";
    import ExpenseDialog from "./ExpenseDialog.vue";

    const showDeleteDialog = ref(false);
    const currentDeletionExpense = ref(null);

    const showExpenseDialog = ref(false);
    const currentExpense = ref(null);

    const expenseTable = ref();
    const loading = ref(true);
    const expenses = ref([]);
    const filter = ref("");
    const filterTimer = ref(null);
    const pagination = ref({
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0,
        sortBy: null,
        descending: false,
    });

    const columns = [
        { name: "description", label: "Descrição", align: "left", field: "description", sortable: true },
        { name: "value", label: "Valor", align: "left", field: "value", sortable: true },
        { name: "date", label: "Data", align: "left", field: "date", sortable: true },
        { name: "actions", label: "Ações", align: "center", field: "actions" },
    ];

    async function loadExpenses(props) {
        loading.value = true;

        try {
            const response = await api.get("expense", {
                params: {
                    page: props.pagination.page,
                    per_page: props.pagination.rowsPerPage,
                    sort_by: props.pagination.sortBy,
                    sort_direction: props.pagination.descending ? "desc" : "asc",
                    search: filter.value,
                },
            });

            expenses.value = response.data.data;

            pagination.value.page = response.data.meta.current_page;
            pagination.value.rowsNumber = response.data.meta.total;
            pagination.value.rowsPerPage = response.data.meta.per_page;
            pagination.value.sortBy = props.pagination.sortBy;
            pagination.value.descending = props.pagination.descending;
        } finally {
            loading.value = false;
        }
    }

    function deleteExpense(expense) {
        currentDeletionExpense.value = expense;
        showDeleteDialog.value = true;
    }

    function openExpenseModal(expense = null) {
        currentExpense.value = expense;
        showExpenseDialog.value = true;
    }

    function reloadExpenses() {
        expenseTable.value.requestServerInteraction();
    }

    watch(filter, value => {
        clearTimeout(filterTimer.value);

        filterTimer.value = setTimeout(() => {
            reloadExpenses();
        }, 750);
    });

    onMounted(reloadExpenses);
</script>
