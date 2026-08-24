<script setup>
// Modal "Elige tu color" (inspirado en el selector de Pintuco): dos pestañas — Familias (matriz
// por familia de color) y Buscar (por nombre o código) — sobre el catálogo completo de 100 colores.
import { ref, computed, watch } from 'vue'
import { FAMILIAS_COLOR, TODOS_LOS_COLORES, buscarColorPorNombre } from '../../data/paletaColores'

const props = defineProps({
  mostrar: { type: Boolean, default: false },
  colorInicial: { type: String, default: '' },
})
const emit = defineEmits(['cerrar', 'color-confirmado'])

const colorDetectado = computed(() => buscarColorPorNombre(props.colorInicial))

const tab = ref('familias') // 'familias' | 'buscar'
const familiaActiva = ref(colorDetectado.value?.familiaId || FAMILIAS_COLOR[0].id)
const colorSeleccionado = ref(colorDetectado.value || FAMILIAS_COLOR[0].colores[0])
const busqueda = ref('')

watch(
  () => props.mostrar,
  (val) => {
    if (!val) return
    tab.value = 'familias'
    busqueda.value = ''
    familiaActiva.value = colorDetectado.value?.familiaId || familiaActiva.value
  }
)

const coloresFamiliaActiva = computed(() => FAMILIAS_COLOR.find((f) => f.id === familiaActiva.value)?.colores || [])
const resultadosBusqueda = computed(() => {
  const term = busqueda.value.trim().toLowerCase()
  if (!term) return TODOS_LOS_COLORES
  return TODOS_LOS_COLORES.filter(
    (c) => c.nombre.toLowerCase().includes(term) || c.codigo.toLowerCase().includes(term)
  )
})

function confirmarColor() {
  emit('color-confirmado', colorSeleccionado.value)
  emit('cerrar')
}
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrar" class="confirm-modal-overlay" @click.self="$emit('cerrar')">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal color-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="$emit('cerrar')"><i class="ri-close-line"></i></button>
          <h3 class="confirm-modal-title">Elige tu color</h3>

          <div class="color-modal-tabs">
            <button type="button" class="color-modal-tab" :class="{ active: tab === 'familias' }" @click="tab = 'familias'">
              <i class="ri-grid-line"></i> Familias
            </button>
            <button type="button" class="color-modal-tab" :class="{ active: tab === 'buscar' }" @click="tab = 'buscar'">
              <i class="ri-search-line"></i> Buscar
            </button>
          </div>

          <template v-if="tab === 'familias'">
            <div class="color-modal-familias">
              <button
                v-for="f in FAMILIAS_COLOR"
                :key="f.id"
                type="button"
                class="color-modal-familia"
                :class="{ active: f.id === familiaActiva }"
                @click="familiaActiva = f.id"
              >
                <span class="color-modal-familia-swatch" :style="{ backgroundColor: f.colores[9].hex }"></span>
                {{ f.nombre }}
              </button>
            </div>

            <div class="color-modal-grid">
              <button
                v-for="c in coloresFamiliaActiva"
                :key="c.codigo"
                type="button"
                class="color-modal-cell"
                :class="{ active: colorSeleccionado?.codigo === c.codigo }"
                :title="`${c.nombre} · ${c.codigo}`"
                @click="colorSeleccionado = c"
              >
                <span class="color-modal-cell-swatch" :style="{ backgroundColor: c.hex }">
                  <i v-if="colorSeleccionado?.codigo === c.codigo" class="ri-check-line"></i>
                </span>
                <span class="color-modal-cell-code">{{ c.codigo }}</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="color-modal-search">
              <i class="ri-search-line"></i>
              <input v-model="busqueda" type="text" placeholder="Busca por nombre o código (ej. Terracota, CA-07)..." autofocus />
            </div>
            <p v-if="!resultadosBusqueda.length" class="color-modal-empty">No encontramos colores con ese nombre o código.</p>
            <div v-else class="color-modal-grid color-modal-grid-search">
              <button
                v-for="c in resultadosBusqueda"
                :key="c.codigo"
                type="button"
                class="color-modal-cell"
                :class="{ active: colorSeleccionado?.codigo === c.codigo }"
                :title="`${c.nombre} · ${c.codigo} · ${c.familiaNombre}`"
                @click="colorSeleccionado = c"
              >
                <span class="color-modal-cell-swatch" :style="{ backgroundColor: c.hex }">
                  <i v-if="colorSeleccionado?.codigo === c.codigo" class="ri-check-line"></i>
                </span>
                <span class="color-modal-cell-code">{{ c.codigo }}</span>
              </button>
            </div>
          </template>

          <div class="color-modal-footer">
            <div class="color-modal-seleccion">
              <span class="color-modal-seleccion-swatch" :style="{ backgroundColor: colorSeleccionado?.hex }"></span>
              <div>
                <strong>{{ colorSeleccionado?.nombre }}</strong>
                <span>Código {{ colorSeleccionado?.codigo }}</span>
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-lg" @click="confirmarColor">
              <i class="ri-check-double-line"></i> Confirmar Color
            </button>
          </div>
          <p class="color-modal-disclaimer">*Los colores mostrados son referenciales y pueden variar según tu pantalla. Se preparan a pedido.</p>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style>
/* No scoped: reutiliza .confirm-modal/.confirm-modal-overlay globales, igual que CalculadoraPinturaModal. */
.color-modal { text-align: left; max-width: 640px; max-height: 88vh; overflow-y: auto; }
.color-modal .confirm-modal-title { text-align: center; margin-bottom: 16px; }

.color-modal-tabs { display: flex; gap: 8px; margin-bottom: 18px; border-bottom: 2px solid var(--border); }
.color-modal-tab {
  display: flex; align-items: center; gap: 6px; padding: 10px 18px; margin-bottom: -2px;
  border-bottom: 3px solid transparent; font-family: var(--font-main); font-weight: 700;
  font-size: 0.85rem; color: var(--text-muted); transition: var(--transition);
}
.color-modal-tab:hover { color: var(--secondary); }
.color-modal-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

.color-modal-familias { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; justify-content: center; }
.color-modal-familia {
  display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px 7px 8px; border-radius: 20px;
  background: var(--off-white); border: 1.5px solid var(--border); font-size: 0.8rem; font-weight: 700;
  color: var(--text-light); transition: var(--transition);
}
.color-modal-familia-swatch { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.1); flex-shrink: 0; }
.color-modal-familia:hover { border-color: var(--primary); color: var(--primary); }
.color-modal-familia.active { background: var(--secondary); border-color: var(--secondary); color: white; }

.color-modal-search {
  display: flex; align-items: center; gap: 10px; background: var(--off-white); border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 18px;
}
.color-modal-search i { color: var(--text-muted); font-size: 1.1rem; }
.color-modal-search input { flex: 1; border: none; background: none; outline: none; font-size: 0.9rem; color: var(--text); }
.color-modal-empty { text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 30px 0; }

.color-modal-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 22px; max-height: 320px; overflow-y: auto; padding: 2px; }
.color-modal-grid-search { grid-template-columns: repeat(6, 1fr); }
.color-modal-cell { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.color-modal-cell-swatch {
  width: 100%; aspect-ratio: 1; border-radius: var(--radius-sm); border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center; font-size: 1rem; color: rgba(0,0,0,0.55);
  transition: var(--transition); box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.color-modal-cell:hover .color-modal-cell-swatch { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0,0,0,0.15); }
.color-modal-cell.active .color-modal-cell-swatch { border-color: var(--secondary); box-shadow: 0 0 0 2px white, 0 0 0 4px var(--secondary); }
.color-modal-cell-code { font-size: 0.64rem; font-weight: 700; color: var(--text-muted); font-family: var(--font-main); }

.color-modal-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
  border-top: 1px solid var(--border); padding-top: 18px;
}
.color-modal-seleccion { display: flex; align-items: center; gap: 12px; }
.color-modal-seleccion-swatch { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; }
.color-modal-seleccion strong { display: block; font-family: var(--font-main); font-size: 0.92rem; color: var(--secondary); }
.color-modal-seleccion span { font-size: 0.76rem; color: var(--text-muted); }
.color-modal-disclaimer { font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 14px; }

@media (max-width: 560px) {
  .color-modal-grid, .color-modal-grid-search { grid-template-columns: repeat(4, 1fr); }
}
</style>
