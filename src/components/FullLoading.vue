<template>
    <div id="loading-screen">
        <q-spinner color="primary" size="5em" />
    </div>
</template>

<style scoped>
    #loading-screen {
        min-height: 100vh;
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 9999;
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
