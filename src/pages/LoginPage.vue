<template>
    <q-form @submit.prevent="login">
        <div class="row q-my-lg justify-center">
            <div class="col-auto">
                <div class="text-h4">Fazer Login</div>
            </div>
        </div>
        <div class="row q-mt-lg justify-center">
            <div class="col col-md-4">
                <q-input label="Email" required outlined rounded type="email" v-model="email"></q-input>
            </div>
        </div>
        <div class="row q-mt-sm justify-center">
            <div class="col col-md-4">
                <q-input
                    label="Senha"
                    required
                    outlined
                    rounded
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                >
                    <template v-slot:append>
                        <q-btn
                            @click="showPassword = !showPassword"
                            :icon="showPassword ? 'visibility_off' : 'visibility'"
                            flat
                            round
                        ></q-btn>
                    </template>
                </q-input>
            </div>
        </div>
        <div class="row q-mt-sm justify-center">
            <div class="col col-md-4">
                Não possui uma conta? <router-link :to="{ name: 'register' }">Registre-se</router-link>
            </div>
        </div>
        <div class="row q-mt-sm justify-center">
            <div class="col col-md-4">
                <q-btn rounded class="full-width" type="submit" color="primary"> ENTRAR </q-btn>
            </div>
        </div>
    </q-form>
</template>

<script setup>
    import { api } from "src/boot/axios";
    import { useAppStore } from "src/stores/app";
    import { useAuthStore } from "src/stores/auth";
    import { onBeforeMount, ref } from "vue";
    import { useRouter } from "vue-router";

    const appStore = useAppStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);

    async function login() {
        appStore.loading = true;

        try {
            await api.get("csrf-cookie");

            const data = {
                email: email.value,
                password: password.value,
            };

            const response = await api.post("/auth/login", data);

            authStore.changeUser(response.data.user);

            router.push({ name: "home" });
        } finally {
            appStore.loading = false;
        }
    }

    onBeforeMount(() => {
        if (authStore.logged) {
            router.push({ name: "home" });
        }
    });
</script>
