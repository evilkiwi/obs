<template>
    <div class="page">
        <h3>{{ connected ? 'Connected!' : 'Not Connected' }}</h3>
        <p><strong>Active Scene:</strong> {{ active }}</p>
        <p><strong>All Scenes:</strong></p>
        <ul>
            <li :key="i" v-for="(name, i) in scenes">{{ name }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import type { PromiseType } from 'utility-types';
    import { onMounted, ref } from 'vue';
    import { obs } from '@/../..';

    const connected = ref(false);
    const scenes = ref<any[]>([]);
    const active = ref('Unknown');

    let client!: PromiseType<ReturnType<typeof obs>>;

    onMounted(async () => {
        client = await obs({
            // password: 'test',
            debug: true,
        });
        connected.value = true;

        // Process the initial Scenes.
        await fetchAll();

        // Listen to when Scenes change.
        client.events.on('ScenesChanged', () => fetchAll());

        // Set the active Scene whenever it changes.
        client.events.on('SwitchScenes', ({ sceneName }: any) => {
            active.value = sceneName;
        });
    });

    const fetchAll = async () => {
        const { currentScene, scenes: all } = await client.request('GetSceneList') as any;
        const total = all.length;

        scenes.value = [];

        for (let i = 0; i < total; i++) {
            const scene = all[i];

            scenes.value = [
                ...scenes.value,
                scene.name,
            ];
        }

        active.value = currentScene;
    };
</script>

<style>
    html,
    body,
    #app {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .page {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
    }
</style>
