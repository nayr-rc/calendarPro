<script lang="ts">
  import type { CalendarEvent } from '$lib/types';
  import { getWeekDays, weekDays, isSameDay } from '$lib/dateUtils';

  interface Props {
    currentDate: Date;
    events: CalendarEvent[];
    onDayClick: (date: Date) => void;
  }

  let { currentDate, events, onDayClick }: Props = $props();

  let weekDates = $derived(getWeekDays(currentDate));

  function getEventsForDay(date: Date): CalendarEvent[] {
    return events.filter((event) => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return isSameDay(eventDate, date);
    });
  }

  function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }
</script>

<div class="overflow-x-auto">
  <div class="min-w-[700px]">
    <div class="grid grid-cols-7 gap-2">
      {#each weekDates as day, index}
        <button
          class={`
            border rounded-lg p-4 text-left min-h-[200px] transition-all duration-200
            hover:border-primary hover:shadow-lg cursor-pointer
            ${isToday(day) ? 'border-primary border-2 bg-primary/5' : 'border-base-300 bg-base-100'}
          `}
          onclick={() => onDayClick(day)}
        >
          <div class="flex flex-col h-full">
            <div class="mb-3">
              <div class="text-xs text-base-content/60 font-medium">
                {weekDays[index]}
              </div>
              <div class={`
                text-2xl font-bold
                ${isToday(day) ? 'text-primary' : 'text-base-content'}
              `}>
                {day.getDate()}
              </div>
            </div>

            <div class="flex-1 overflow-y-auto space-y-2">
              {#each getEventsForDay(day) as event}
                <div class="card bg-primary text-primary-content shadow-sm">
                  <div class="card-body p-3">
                    <h4 class="card-title text-sm">{event.title}</h4>
                    {#if event.description}
                      <p class="text-xs opacity-80">{event.description}</p>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
