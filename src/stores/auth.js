import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const logged = ref(false);
    const loadedUser = ref(false);
    const user = ref(null);

    async function loadUser() {
        loadedUser.value = true;

        try {
            const response = await api.get("/auth/user");

            changeUser(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function changeUser(newUser) {
        logged.value = true;
        user.value = newUser;
    }

    function logout() {
        logged.value = false;
        user.value = null;
    }

    return { logged, loadUser, loadedUser, user, changeUser, logout };
});
