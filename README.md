<div align="center">
    <a href="https://www.npmjs.com/package/@evilkiwi/obs" target="_blank">
        <img src="https://img.shields.io/npm/v/@evilkiwi/obs?style=flat-square" alt="NPM" />
    </a>
    <a href="https://discord.gg/3S6AKZ2GR9" target="_blank">
        <img src="https://img.shields.io/discord/1000565079789535324?color=7289DA&label=discord&logo=discord&logoColor=FFFFFF&style=flat-square" alt="Discord" />
    </a>
    <img src="https://img.shields.io/npm/l/@evilkiwi/obs?style=flat-square" alt="Apache-2.0" />
    <h3>OBS Studio WebSocket Client</h3>
</div>

`@evilkiwi/obs` provides a simple hook which can be used to connect to and consume the OBS Studio WebSocket API.

## Installation

This package is available via NPM:

```bash
yarn add @evilkiwi/obs

# or

npm install @evilkiwi/obs
```

## Usage

```typescript
import { obs } from '@evilkiwi/obs';

const client = await obs({ debug: true });

// Asynchronous requests.
const allScenes = await client.request('GetSceneList');

// Subscriptions.
client.events.on('SwitchScenes', ({ sceneName }: any) => {
    console.log(`Active Scene was changed to ${sceneName}`);
});
```

## To-do

- Fully type the responses and provided methods from XJS
- Allow running in NodeJS via `ws`

