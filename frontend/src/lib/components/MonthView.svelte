<script lang="ts">
  import type { CalendarEvent } from '$lib/types';
  import { getDaysInMonth, getFirstDayOfMonth, weekDays, formatDate, isSameDay } from '$lib/dateUtils';

  interface Props {
    currentDate: Date;
    events: CalendarEvent[];
    onDayClick: (date: Date) => void;
  }

  let { currentDate, events, onDayClick }: Props = $props();

  let calendarDays = $derived(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  });

  function getEventsForDay(date: Date | null): CalendarEvent[] {
    if (!date) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return isSameDay(eventDate, date);
    });
  }

  function isToday(date: Date | null): boolean {
    if (!date) return false;
    return isSameDay(date, new Date());
  }
</script>

<div class="overflow-x-auto">
  <div class="min-w-[700px]">
    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      {#each weekDays as day}
        <div class="text-center font-semibold text-sm py-2 text-base-content/70">
          {day}
        </div>
      {/each}
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-1">
      {#each calendarDays() as day}
        <button
          class={`
            min-h-[120px] border rounded-lg p-2 text-left transition-all duration-200
            ${day ? 'hover:border-primary hover:shadow-md cursor-pointer bg-base-100' : 'bg-base-200 cursor-default'}
            ${isToday(day) ? 'border-primary border-2 bg-primary/5' : 'border-base-300'}
          `}
          onclick={() => day && onDayClick(day)}
          disabled={!day}
        >
          {#if day}
            <div class="flex flex-col h-full">
              <div class={`
                text-sm font-medium mb-2
                ${isToday(day) ? 'text-primary font-bold' : 'text-base-content'}
              `}>
                {day.getDate()}
              </div>

              <div class="flex-1 overflow-y-auto space-y-1">
                {#each getEventsForDay(day) as event}
                  <div
                    class="text-xs px-2 py-1 rounded bg-primary text-primary-content truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>
