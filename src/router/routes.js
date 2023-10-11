import MainLayout from "layouts/MainLayout.vue";
import HomePage from "pages/HomePage.vue";

const routes = [
    {
        path: "/",
        component: MainLayout,
        children: [
            {
                path: "",
                name: "home",
                meta: {
                    requiresAuth: true,
                },
                component: HomePage,
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
    },
];

export default routes;
