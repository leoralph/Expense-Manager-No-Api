<template>
    <q-header elevated>
        <q-toolbar>
            <q-toolbar-title> Gestor de Despesas </q-toolbar-title>
            <template v-if="authStore.logged">
                <q-btn @click="showUserDialog = true" flat>
                    {{ authStore.user.name }}
                    <q-icon name="account_circle"></q-icon>
                </q-btn>
                <q-btn @click="logout" flat>Sair</q-btn>
            </template>
        </q-toolbar>
    </q-header>

    <UserDialog v-model="showUserDialog" />
</template>

<script setup>
    import UserDialog from "./UserDialog.vue";
    import { api } from "src/boot/axios";
    import { useAppStore } from "src/stores/app";
    import { useAuthStore } from "src/stores/auth";
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    const authStore = useAuthStore();
    const appStore = useAppStore();
    const router = useRouter();

    const showUserDialog = ref(false);

    function logout() {
        appStore.loading = true;

        try {
            api.post("auth/logout");
        } finally {
            authStore.logout();
            appStore.loading = false;
            router.push({ name: "login" });
        }
    }
</script>
