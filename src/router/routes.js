import MainLayout from "layouts/MainLayout.vue";
import LoginPage from "pages/LoginPage.vue";
import HomePage from "pages/HomePage.vue";
import RegisterPage from "pages/RegisterPage.vue";

const routes = [
    {
        path: "/",
        component: MainLayout,
        children: [
            {
                path: "login",
                name: "login",
                component: LoginPage,
            },
            {
                path: "register",
                name: "register",
                component: RegisterPage,
            },
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
