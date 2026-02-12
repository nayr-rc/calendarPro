<script lang="ts">
    import { onMount } from "svelte";
    import type { CalendarEvent, ViewMode } from "$lib/types";
    import { api } from "$lib/api";
    import {
        monthNames,
        weekDays,
        addMonths,
        addDays,
        getWeekDays,
        getDaysInMonth,
        getFirstDayOfMonth,
        isSameDay,
    } from "$lib/dateUtils";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import EventModal from "$lib/components/EventModal.svelte";

    // --- States ---
    let currentDate = $state(new Date());
    let viewMode = $state<ViewMode>("month");
    let events = $state<CalendarEvent[]>([]);
    let selectedDate = $state<Date | null>(null);
    let loading = $state(true);

    // --- Lifecycle ---
    onMount(() => {
        loadEvents();
    });

    // --- API Handlers ---
    async function loadEvents() {
        loading = true;
        try {
            events = await api.getEvents();
        } catch {
            events = [];
        }
        loading = false;
    }

    async function handleCreateEvent(event: Omit<CalendarEvent, "id">) {
        try {
            const newEvent = await api.createEvent(event);
            if (newEvent) {
                events = [...events, newEvent];
            } else {
                // Fallback for demo without backend
                const localEvent: CalendarEvent = {
                    ...event,
                    id: crypto.randomUUID(),
                };
                events = [...events, localEvent];
            }
        } catch {
            // Fallback for demo
            const localEvent: CalendarEvent = {
                ...event,
                id: crypto.randomUUID(),
            };
            events = [...events, localEvent];
        }
    }

    // --- Interactions ---
    function handleDayClick(date: Date) {
        selectedDate = date;
    }

    function handleCreateButtonClick() {
        selectedDate = new Date();
    }

    function handleCloseModal() {
        selectedDate = null;
    }

    // --- Navigation ---
    function navigateNext() {
        currentDate =
            viewMode === "month"
                ? addMonths(currentDate, 1)
                : addDays(currentDate, 7);
    }

    function navigatePrevious() {
        currentDate =
            viewMode === "month"
                ? addMonths(currentDate, -1)
                : addDays(currentDate, -7);
    }

    function goToToday() {
        currentDate = new Date();
    }

    function toggleView(mode: ViewMode) {
        viewMode = mode;
    }

    // --- Derived State ---
    let headerTitle = $derived(() => {
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    });

    // --- Helpers for Grid Rendering ---
    function getEventsForDay(date: Date): CalendarEvent[] {
        return events.filter((e) =>
            isSameDay(new Date(e.date + "T00:00:00"), date),
        );
    }
</script>

<div
    class="flex h-screen bg-[#202124] text-[#e8eaed] overflow-hidden font-sans"
>
    <!-- Sidebar -->
    <Sidebar onCreateClick={handleCreateButtonClick} />

    <!-- Main Content -->
    <main class="flex flex-col flex-1 h-full min-w-0">
        <!-- Top Header (Navigation) -->
        <header
            class="h-16 flex items-center justify-between px-6 border-b border-[#3c4043] bg-[#202124] shrink-0"
        >
            <div class="flex items-center gap-6">
                <h1 class="text-2xl font-normal text-[#9aa0a6] hidden md:block">
                    Calendar
                </h1>
                <button
                    class="btn btn-sm btn-outline border border-[#5f6368] text-[#e8eaed] hover:bg-[#3c4043] rounded px-4 normal-case font-medium"
                    onclick={goToToday}
                >
                    Today
                </button>
                <div class="flex items-center gap-1">
                    <button
                        class="btn btn-circle btn-sm btn-ghost hover:bg-[#3c4043]"
                        onclick={navigatePrevious}>‹</button
                    >
                    <button
                        class="btn btn-circle btn-sm btn-ghost hover:bg-[#3c4043]"
                        onclick={navigateNext}>›</button
                    >
                </div>
                <h2 class="text-xl font-normal text-[#e8eaed] ml-2">
                    {headerTitle()}
                </h2>
            </div>

            <div class="flex items-center gap-4">
                <!-- View Switcher -->
                <div class="join border border-[#5f6368] rounded">
                    <button
                        class={`join-item btn btn-sm px-4 normal-case ${viewMode === "month" ? "bg-[#8ab4f8] text-[#202124] border-none" : "bg-transparent text-[#e8eaed] border-none hover:bg-[#3c4043]"}`}
                        onclick={() => toggleView("month")}
                    >
                        Month
                    </button>
                    <button
                        class={`join-item btn btn-sm px-4 normal-case ${viewMode === "week" ? "bg-[#8ab4f8] text-[#202124] border-none" : "bg-transparent text-[#e8eaed] border-none hover:bg-[#3c4043]"}`}
                        onclick={() => toggleView("week")}
                    >
                        Week
                    </button>
                </div>

                <!-- User Avatar Placeholder -->
                <div class="avatar placeholder">
                    <div
                        class="bg-primary text-neutral-content rounded-full w-8 h-8 flex items-center justify-center text-xs"
                    >
                        <span>U</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Calendar Area -->
        <div class="flex-1 overflow-auto bg-[#202124] relative">
            {#if viewMode === "month"}
                <!-- Month Grid -->
                <div
                    class="grid grid-cols-7 h-full border-l border-t border-[#3c4043]"
                >
                    <!-- Weekday Headers -->
                    {#each weekDays as day}
                        <div
                            class="h-8 flex items-center justify-center text-xs font-medium text-[#9aa0a6] border-b border-r border-[#3c4043] uppercase tracking-wider bg-[#202124]"
                        >
                            {day}
                        </div>
                    {/each}

                    <!-- Days Cells -->
                    {#each (() => {
                        const y = currentDate.getFullYear();
                        const m = currentDate.getMonth();
                        const dim = getDaysInMonth(y, m);
                        const fd = getFirstDayOfMonth(y, m);
                        // Pad empty days
                        const blanks = Array(fd).fill(null);
                        const days = Array.from({ length: dim }, (_, i) => new Date(y, m, i + 1));
                        return [...blanks, ...days];
                    })() as day}
                        <div
                            class={`min-h-[100px] border-b border-r border-[#3c4043] p-1 flex flex-col relative group transition-colors
                ${day ? "hover:bg-[#28292c] cursor-pointer" : "bg-[#18181a]"}
              `}
                            onclick={() => day && handleDayClick(day)}
                            role="button"
                            tabindex="0"
                            onkeydown={(e) =>
                                e.key === "Enter" && day && handleDayClick(day)}
                        >
                            {#if day}
                                <span
                                    class={`text-xs p-1 w-6 h-6 flex items-center justify-center rounded-full font-medium mb-1 self-center
                  ${isSameDay(day, new Date()) ? "bg-[#8ab4f8] text-[#202124]" : "text-[#9aa0a6]"}
                `}
                                >
                                    {day.getDate()}
                                </span>

                                <!-- Events List -->
                                <div
                                    class="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar"
                                >
                                    {#each getEventsForDay(day) as event}
                                        <div
                                            class="bg-[#3c4043] text-[#e8eaed] text-xs px-2 py-0.5 rounded truncate border-l-2 border-[#8ab4f8] hover:bg-[#4a4e51] shadow-sm"
                                        >
                                            {event.title}
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                <!-- Week View -->
                <div class="flex flex-col h-full">
                    <!-- Week Header -->
                    <div
                        class="grid grid-cols-7 border-b border-[#3c4043] bg-[#202124]"
                    >
                        {#each getWeekDays(currentDate) as day}
                            <div
                                class={`py-3 flex flex-col items-center border-r border-[#3c4043]
                 ${isSameDay(day, new Date()) ? "text-[#8ab4f8]" : "text-[#9aa0a6]"}
               `}
                            >
                                <span
                                    class="text-xs font-medium uppercase tracking-wider mb-1"
                                    >{weekDays[day.getDay()]}</span
                                >
                                <div
                                    class={`text-2xl font-normal w-10 h-10 flex items-center justify-center rounded-full
                   ${isSameDay(day, new Date()) ? "bg-[#8ab4f8] text-[#202124]" : "hover:bg-[#3c4043] cursor-pointer"}
                 `}
                                    onclick={() => handleDayClick(day)}
                                    role="button"
                                    tabindex="0"
                                    onkeydown={() => {}}
                                >
                                    {day.getDate()}
                                </div>
                            </div>
                        {/each}
                    </div>

                    <!-- Week Grid (Time simulation) -->
                    <div class="flex-1 overflow-y-auto relative bg-[#202124]">
                        <!-- Grid Lines (Background) -->
                        <div
                            class="absolute inset-0 grid grid-cols-7 pointer-events-none"
                        >
                            {#each Array(7) as _}
                                <div
                                    class="border-r border-[#3c4043] h-full"
                                ></div>
                            {/each}
                        </div>

                        <!-- Horizontal Time Lines (Visual Only) -->
                        <div
                            class="absolute inset-x-0 top-0 h-full pointer-events-none opacity-20 z-0"
                        >
                            {#each Array(24) as _, i}
                                <div
                                    class="h-16 border-b border-[#5f6368] w-full flex items-start pl-1"
                                ></div>
                            {/each}
                        </div>

                        <!-- Events (In columns) -->
                        <div
                            class="grid grid-cols-7 h-[1540px] relative z-10 w-full"
                        >
                            <!-- 24h * 64px approx -->
                            {#each getWeekDays(currentDate) as day}
                                <div
                                    class="relative h-full"
                                    role="button"
                                    tabindex="0"
                                    onclick={() => handleDayClick(day)}
                                    onkeydown={() => {}}
                                >
                                    <!-- Stack events nicely -->
                                    <div class="p-1 space-y-1">
                                        {#each getEventsForDay(day) as event}
                                            <div
                                                class="bg-[#3c4043] border border-[#5f6368] rounded p-2 text-xs text-[#e8eaed] shadow-md hover:z-20 relative cursor-pointer hover:bg-[#4a4e51] transition-all"
                                            >
                                                <div
                                                    class="font-bold text-[#8ab4f8] mb-0.5"
                                                >
                                                    {event.title}
                                                </div>
                                                {#if event.description}
                                                    <div
                                                        class="opacity-70 truncate text-[10px]"
                                                    >
                                                        {event.description}
                                                    </div>
                                                {/if}
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </main>

    <EventModal
        {selectedDate}
        onClose={handleCloseModal}
        onSubmit={handleCreateEvent}
    />
</div>

<style>
    /* Custom Scrollbar for dark theme */
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #202124;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #5f6368;
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #70757a;
    }
</style>
