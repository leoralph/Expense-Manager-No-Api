<template>
    <q-dialog v-model="show" persistent>
        <q-card>
            <q-card-section class="bg-negative text-white">
                <div class="text-h6">ATENÇÃO</div>
            </q-card-section>

            <q-card-section>
                <div class="text-h6">Deseja realmente excluir a despesa?</div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancelar" v-close-popup />
                <q-btn color="primary" label="Confirmar" @click="confirm" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import { api } from "src/boot/axios";
    import { useAppStore } from "src/stores/app";
    import { useMessageStore } from "src/stores/message";
    import { computed } from "vue";

    const appStore = useAppStore();
    const messageStore = useMessageStore();

    const props = defineProps(["modelValue", "expense"]);
    const emit = defineEmits(["update:modelValue", "expenseDeleted"]);

    const show = computed({
        get: () => props.modelValue,
        set: value => emit("update:modelValue", value),
    });

    async function confirm() {
        appStore.loading = true;
        try {
            const expenses = JSON.parse(localStorage.getItem("expenses"));

            localStorage.setItem(
                "expenses",
                JSON.stringify(expenses.filter(expense => expense.id !== props.expense.id))
            );

            emit("expenseDeleted", props.expense);

            messageStore.addMessage("Despesa excluída com sucesso!", "positive");

            show.value = false;
        } finally {
            appStore.loading = false;
        }
    }
</script>
