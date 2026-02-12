<script lang="ts">
  import type { CalendarEvent } from "$lib/types";
  import { formatDate } from "$lib/dateUtils";

  interface Props {
    selectedDate: Date | null;
    onClose: () => void;
    onSubmit: (event: Omit<CalendarEvent, "id">) => void;
  }

  let { selectedDate, onClose, onSubmit }: Props = $props();

  let title = $state("");
  let description = $state("");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date: formatDate(selectedDate),
    });

    title = "";
    description = "";
    onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if selectedDate}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Criar Novo Evento</h3>
      <p class="text-sm text-base-content/70 mb-4">
        {selectedDate.toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <form onsubmit={handleSubmit}>
        <div class="form-control mb-4">
          <label class="label" for="event-title">
            <span class="label-text">Título</span>
          </label>
          <input
            id="event-title"
            type="text"
            placeholder="Nome do evento"
            class="input input-bordered w-full"
            bind:value={title}
            required
            autofocus
          />
        </div>

        <div class="form-control mb-6">
          <label class="label" for="event-description">
            <span class="label-text">Descrição (opcional)</span>
          </label>
          <textarea
            id="event-description"
            class="textarea textarea-bordered h-24"
            placeholder="Adicione detalhes..."
            bind:value={description}
          ></textarea>
        </div>

        <div class="modal-action">
          <button type="button" class="btn" onclick={onClose}>Cancelar</button>
          <button
            type="submit"
            class="btn btn-primary"
            disabled={!title.trim()}
          >
            Criar Evento
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
