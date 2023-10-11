<template>
    <q-dialog v-model="show" persistent>
        <q-card style="width: 100rem; max-width: 85vw">
            <q-form @submit.prevent="save">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">{{ expenseId ? "ALTERAR" : "CADASTRAR" }} DESPESA</div>
                </q-card-section>

                <q-card-section>
                    <q-input required v-model="editableExpense.description" label="Descrição" />

                    <q-input required v-model="computedValue" label="Valor" />

                    <q-input type="date" v-model="editableExpense.date" label="Data" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" v-close-popup />
                    <q-btn type="submit" color="primary" label="Confirmar" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import { api } from "src/boot/axios";
    import { useAppStore } from "src/stores/app";
    import { useMessageStore } from "src/stores/message";
    import { computed, ref, watch } from "vue";

    const appStore = useAppStore();
    const messageStore = useMessageStore();

    const editableExpense = ref(null);

    const expenseId = ref(null);

    const props = defineProps(["modelValue", "expense"]);
    const emit = defineEmits(["update:modelValue", "expenseSaved"]);

    const show = computed({
        get: () => props.modelValue,
        set: value => emit("update:modelValue", value),
    });

    const computedValue = computed({
        get() {
            return editableExpense.value.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
        },
        set(value) {
            editableExpense.value.value = value.toString().replace(/\D/g, "") / 100;
        },
    });

    async function save() {
        appStore.loading = true;

        try {
            const currentExpenses = JSON.parse(localStorage.getItem("expenses"));

            if (expenseId.value !== null) {
                currentExpenses[expenseId.value] = editableExpense.value;
            } else {
                currentExpenses.push({ ...editableExpense.value, id: currentExpenses.length });
            }

            localStorage.setItem("expenses", JSON.stringify(currentExpenses));

            emit("expenseSaved");

            show.value = false;

            messageStore.addMessage("Despesa criada com sucesso", "positive");
        } finally {
            appStore.loading = false;
        }
    }

    watch(show, value => {
        if (!value) return;

        if (props.expense) {
            expenseId.value = props.expense.id;

            editableExpense.value = {
                id: props.expense.id,
                description: props.expense.description,
                date: props.expense.date.split("/").reverse().join("-"),
            };

            computedValue.value = props.expense.value;
        } else {
            expenseId.value = null;

            editableExpense.value = {
                description: "",
                value: 0,
                date: null,
            };
        }
    });
</script>
