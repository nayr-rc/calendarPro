<script lang="ts">
    import { monthNames, weekDays } from "$lib/dateUtils";

    interface Props {
        onCreateClick: () => void;
    }

    let { onCreateClick }: Props = $props();

    const calendars = [
        { name: "Lucas Speranza", color: "bg-blue-500", checked: true },
        { name: "Birthdays", color: "bg-green-500", checked: true },
        { name: "Family", color: "bg-yellow-500", checked: true },
        { name: "Tasks", color: "bg-purple-500", checked: false },
    ];

    // Mini calendar logic (fixo para o mês atual para efeito visual)
    const currentMiniDate = new Date();
    const daysInMonth = new Date(
        currentMiniDate.getFullYear(),
        currentMiniDate.getMonth() + 1,
        0,
    ).getDate();
    const firstDay = new Date(
        currentMiniDate.getFullYear(),
        currentMiniDate.getMonth(),
        1,
    ).getDay();
    const miniDays = Array(firstDay)
        .fill(null)
        .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
</script>

<aside
    class="w-64 bg-[#1e1e1e] border-r border-gray-700 flex flex-col p-4 hidden md:flex"
>
    <!-- Create Button -->
    <button
        class="btn btn-primary rounded-full px-6 py-3 w-fit shadow-lg mb-8 flex items-center gap-2 normal-case text-lg font-medium bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa] border-none"
        onclick={onCreateClick}
    >
        <span class="text-2xl font-light">+</span> Create
    </button>

    <!-- Mini Calendar (Visual Only) -->
    <div class="mb-8 px-2">
        <div
            class="flex justify-between mb-4 text-sm font-medium text-gray-300"
        >
            <span
                >{monthNames[currentMiniDate.getMonth()]}
                {currentMiniDate.getFullYear()}</span
            >
            <div class="flex gap-2">
                <button
                    class="hover:bg-gray-700 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                    >‹</button
                >
                <button
                    class="hover:bg-gray-700 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                    >›</button
                >
            </div>
        </div>
        <div
            class="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400"
        >
            {#each weekDays as day}
                <span>{day.charAt(0)}</span>
            {/each}
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs">
            {#each miniDays as day}
                <button
                    class={`w-6 h-6 rounded-full flex items-center justify-center
            ${day ? "hover:bg-gray-700 text-gray-300" : ""}
            ${day === currentMiniDate.getDate() ? "bg-[#8ab4f8] text-[#202124] font-bold" : ""}
          `}
                >
                    {day || ""}
                </button>
            {/each}
        </div>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
        <input
            type="text"
            placeholder="Search for people"
            class="input input-sm w-full bg-[#202124] border-gray-600 text-gray-300 rounded-lg pl-8"
        />
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 absolute left-2 top-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    </div>

    <!-- My Calendars -->
    <div class="flex-1 overflow-y-auto">
        <h3
            class="text-sm font-medium text-gray-400 mb-3 flex justify-between cursor-pointer hover:bg-gray-800 p-1 rounded"
        >
            <span>My calendars</span>
            <span>^</span>
        </h3>
        <div class="space-y-2">
            {#each calendars as cal}
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={cal.checked}
                        class={`checkbox checkbox-sm rounded-sm border-0 ${cal.color}`}
                    />
                    <span class="text-sm text-gray-300 group-hover:text-white"
                        >{cal.name}</span
                    >
                </label>
            {/each}
        </div>
    </div>
</aside>
