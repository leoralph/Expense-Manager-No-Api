<template>
    <q-form @submit.prevent="register">
        <div class="row q-my-lg justify-center">
            <div class="col-auto">
                <div class="text-h4">Realizar Cadastro</div>
            </div>
        </div>
        <div class="row q-mt-lg justify-center">
            <div class="col col-md-4">
                <q-input label="Nome" required outlined rounded v-model="name"></q-input>
            </div>
        </div>
        <div class="row q-mt-sm justify-center">
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
                <q-input
                    label="Confirmar Senha"
                    required
                    outlined
                    rounded
                    :type="showPassword ? 'text' : 'password'"
                    v-model="passwordConfirmation"
                >
                </q-input>
            </div>
        </div>
        <div class="row q-mt-sm justify-center">
            <div class="col col-md-4">
                Já possui uma conta? <router-link :to="{ name: 'login' }">Fazer login</router-link>
            </div>
        </div>
        <div class="row q-mt-sm justify-center">
            <div class="col col-md-4">
                <q-btn rounded class="full-width" type="submit" color="primary"> CADASTRAR </q-btn>
            </div>
        </div>
    </q-form>
</template>

<script setup>
    import { api } from "src/boot/axios";
    import { useAppStore } from "src/stores/app";
    import { useAuthStore } from "src/stores/auth";
    import { useMessageStore } from "src/stores/message";
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    const appStore = useAppStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const messageStore = useMessageStore();

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const passwordConfirmation = ref("");
    const showPassword = ref(false);

    async function register() {
        appStore.loading = true;

        try {
            await api.get("csrf-cookie");

            const data = {
                name: name.value,
                email: email.value,
                password: password.value,
                password_confirmation: passwordConfirmation.value,
            };

            const response = await api.post("user", data);

            authStore.changeUser(response.data.user);

            router.push({ name: "home" });

            messageStore.addMessage(response.data.message, "positive");
        } finally {
            appStore.loading = false;
        }
    }
</script>
