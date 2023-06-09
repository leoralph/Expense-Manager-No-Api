import { defineStore } from "pinia";
import { Notify } from "quasar";

export const useMessageStore = defineStore("message", () => {
    function addMessage(message, color) {
        Notify.create({
            message,
            position: "top-right",
            color: color,
        });
    }

    return { addMessage };
});
