<template>
    <q-layout view="lHh Lpr lFf">
        <FullLoading v-if="appStore.loading" />

        <AppHeader />

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
    import AppHeader from "src/components/AppHeader.vue";
    import FullLoading from "src/components/FullLoading.vue";
    import { useAppStore } from "src/stores/app";
    import { useAuthStore } from "src/stores/auth";
    import { useMessageStore } from "src/stores/message";

    const appStore = useAppStore();
</script>
