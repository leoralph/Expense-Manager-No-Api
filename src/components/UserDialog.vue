<template>
    <q-dialog v-model="show">
        <q-card style="width: 50rem; max-width: 80vw">
            <q-form @submit.prevent="save">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">ALTERAR USUÁRIO</div>
                </q-card-section>
                <q-card-section>
                    <q-input required v-model="user.name" label="Nome" />
                    <q-input required v-model="user.email" label="E-mail" />
                    <q-input type="password" v-model="user.password" label="Senha" />
                    <q-input type="password" v-model="user.password_confirmation" label="Confirmação de Senha" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" v-close-popup />
                    <q-btn color="primary" label="Salvar" type="submit" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import { api } from "src/boot/axios";
import { useAppStore } from "src/stores/app";
    import { useAuthStore } from "src/stores/auth";
    import { useMessageStore } from "src/stores/message";
    import { computed, ref } from "vue";

    const authStore = useAuthStore();
    const appStore = useAppStore();
    const messageStore = useMessageStore();

    const user = ref({
        name: authStore.user.name,
        email: authStore.user.email,
        password: "",
        password_confirmation: "",
    });

    const props = defineProps(["modelValue"]);
    const emit = defineEmits(["update:modelValue"]);

    const show = computed({
        get: () => props.modelValue,
        set: value => emit("update:modelValue", value),
    });

    async function save() {
        appStore.loading = true;

        try {
            const response = await api.put(`user/${authStore.user.id}`, user.value);

            authStore.changeUser(response.data.user);

            show.value = false;

            messageStore.addMessage(response.data.message, "positive");
        } finally {
            appStore.loading = false;
        }
    }
</script>
