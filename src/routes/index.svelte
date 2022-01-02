<script lang="ts" context="module">
    export async function load({ fetch }) {
        const res: Response = await fetch(`http://localhost:3000/index.json`);
        if (res.ok) {
            const data: Developer[] = await res.json()
            return {
                props: { data }
            }
        }
    }
</script>

<script lang="ts">
    import type { Developer } from '../types/data.type';

    export let data: Developer[];
    let name: string = '';
    let bio: string = '';
    let avatar: string = '';
    let url: string = '';
    let keyword: string = '';

    async function save(): Promise<void> {
        await fetch('/index.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, bio, avatar, url })
        })
        .then((res) => res.json())
        .then((newData: Developer) => (data = [newData, ...data]));
    }

    async function deletePerson(id: string): Promise<void> {
        await fetch(`/index.json?id=${id}`, {
            method: 'DELETE'
        })
        .then(() => data = data.filter((d) => d.id !== id));
    }

    async function search(): Promise<void> {
        await fetch(`/index.json?keyword=${keyword}`)
        .then((res) => res.json())
        .then((newData: Developer[]) => (data = newData));
    }
</script>

<svelte:head>
    <title>DevHub Svelte App</title>
</svelte:head>

<h1>Welcome to DevHub</h1>

<form on:submit|preventDefault={search}>
    <div class="input-group mb-3">
        <input type="text" class="form-control" name="keyword" bind:value={keyword} placeholder="Search" />
        <input type="submit" value="Search" class="form-control" />
    </div>
</form>

<form on:submit|preventDefault={save}>
    <div class="input-group mb-3">
        <input type="text" class="form-control" name="name" bind:value={name} placeholder="Name" />
        <input type="text" class="form-control" name="bio" bind:value={bio} placeholder="Bio" />
        <input type="text" class="form-control" name="avatar" bind:value={avatar} placeholder="Avatar url" />
        <input type="text" class="form-control" name="url" bind:value={url} placeholder="Your url" />
        <input type="submit" value="Save" class="form-control" />
    </div>
</form>

{#each data as { id, name, bio, avatar, url}}
    <div class="card" style="width: 18rem; margin: 1rem; float: left;">
        <img src={avatar} class="card-img-to" alt={name} />
        <div class="card-body">
            <h5 class="card-title">{name}</h5>
            <p class="card-text">{bio}</p>
        </div>
        <div class="card-footer text-muted">
            <a href={url} class="btn btn-success">More info</a>
            <div class="btn btn-danger" on:click|preventDefault={() => deletePerson(id)}>Delete</div>
        </div>
    </div>
{/each}

