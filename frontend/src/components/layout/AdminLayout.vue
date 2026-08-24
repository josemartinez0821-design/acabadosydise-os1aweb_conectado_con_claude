<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCotizacionesStore } from '../../stores/cotizaciones'
import { usePqrsStore } from '../../stores/pqrs'
import { useVentasStore } from '../../stores/ventas'
import { extraerFechaDeseada } from '../../composables/useFormat'
import { useCenterMessage } from '../../composables/useCenterMessage'

const auth = useAuthStore()
const router = useRouter()
const cotizStore = useCotizacionesStore()
const pqrsStore = usePqrsStore()
const ventasStore = useVentasStore()
const { mostrarMensajeCentral } = useCenterMessage()

const sidebarAbierto = ref(false)

const iniciales = computed(() => {
  const u = auth.usuario
  return ((u?.nombre?.[0] || '') + (u?.apellido?.[0] || '')).toUpperCase()
})

// Aviso siempre visible en el menú: cuántas citas de servicio ya confirmadas (anticipo pagado)
// caen en los próximos 7 días — así el admin lo ve apenas entra al panel, sin tener que ir a
// buscarlo en el calendario de Cotizaciones.
const citasProximas = computed(() => {
  const hoy = new Date().toISOString().slice(0, 10)
  const limite = new Date()
  limite.setDate(limite.getDate() + 7)
  return cotizStore.cotizaciones.filter((c) => {
    if (c.estado !== 'convertida_venta') return false
    const fechaIso = extraerFechaDeseada(c.observaciones)
    if (!fechaIso) return false
    return fechaIso >= hoy && fechaIso <= limite.toISOString().slice(0, 10)
  }).length
})

const pqrsPendientes = computed(() => pqrsStore.pqrs.filter((p) => ['abierto', 'en_proceso'].includes(p.estado)).length)

// Cotizaciones, ventas y PQRS son información privada (no se precargan en App.vue como productos/
// servicios) - se piden aquí, una sola vez, apenas se entra a cualquier página del panel admin.
onMounted(() => {
  cotizStore.cargarCotizaciones()
  ventasStore.cargarVentas()
  pqrsStore.cargarPqrs()
})

function cerrarSesion() {
  auth.logout()
  mostrarMensajeCentral('Has cerrado sesión correctamente.', {
    icono: 'ri-shield-check-line',
    tipo: 'despedida',
    duracion: 2200,
  })
  router.push('/')
}
</script>

<template>
  <div class="admin-shell">
    <div v-if="sidebarAbierto" class="admin-sidebar-overlay" @click="sidebarAbierto = false"></div>

    <aside class="admin-sidebar" :class="{ open: sidebarAbierto }">
      <RouterLink to="/admin/dashboard" class="admin-logo">
        <span class="admin-logo-icon"><i class="ri-paint-brush-line"></i></span>
        ACABADOS <span class="admin-logo-accent">1A</span>
      </RouterLink>

      <nav class="admin-nav">
        <RouterLink to="/admin/dashboard" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-dashboard-3-line"></i> Dashboard
        </RouterLink>
        <RouterLink to="/admin/productos" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-store-2-line"></i> Productos
        </RouterLink>
        <RouterLink to="/admin/servicios" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-tools-line"></i> Servicios
        </RouterLink>
        <RouterLink to="/admin/inventario" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-archive-2-line"></i> Inventario
        </RouterLink>
        <RouterLink to="/admin/ventas" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-shopping-bag-3-line"></i> Ventas
        </RouterLink>
        <RouterLink to="/admin/cotizaciones" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-file-list-3-line"></i> Cotizaciones
          <span v-if="citasProximas" class="admin-nav-badge">{{ citasProximas }}</span>
        </RouterLink>
        <RouterLink to="/admin/pqrs" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-customer-service-2-line"></i> PQRS
          <span v-if="pqrsPendientes" class="admin-nav-badge">{{ pqrsPendientes }}</span>
        </RouterLink>
        <RouterLink to="/admin/reportes" class="admin-nav-item" @click="sidebarAbierto = false">
          <i class="ri-bar-chart-2-line"></i> Reportes
        </RouterLink>
      </nav>

      <div class="admin-sidebar-footer">
        <RouterLink to="/" class="admin-nav-item"><i class="ri-external-link-line"></i> Ver tienda</RouterLink>
        <a href="#" class="admin-nav-item" @click.prevent="cerrarSesion"><i class="ri-logout-box-line"></i> Cerrar sesión</a>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <button class="admin-sidebar-toggle" aria-label="Menú" @click="sidebarAbierto = !sidebarAbierto">
          <i class="ri-menu-line"></i>
        </button>
        <div class="admin-topbar-spacer"></div>
        <div class="admin-topbar-user">
          <div class="admin-topbar-avatar">{{ iniciales }}</div>
          <div class="admin-topbar-user-info">
            <strong>{{ auth.usuario?.nombre }} {{ auth.usuario?.apellido }}</strong>
            <span>Administrador</span>
          </div>
        </div>
      </header>

      <div class="admin-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; background: var(--off-white); }

.admin-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 998; display: none; }

.admin-sidebar {
  width: 260px; flex-shrink: 0; background: var(--secondary); color: white;
  display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 999;
  border-right: 1px solid rgba(255,255,255,0.06); transition: transform 0.3s ease;
}
.admin-logo {
  display: flex; align-items: center; gap: 10px; padding: 22px 22px 20px;
  font-family: var(--font-main); font-weight: 900; font-size: 1.05rem; color: white; white-space: nowrap;
}
.admin-logo-icon {
  width: 34px; height: 34px; background: var(--primary); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0;
}
.admin-logo-accent { color: var(--primary); }

.admin-nav { display: flex; flex-direction: column; padding: 10px 14px; gap: 3px; flex: 1; overflow-y: auto; }
.admin-nav-item {
  display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.62); font-family: var(--font-main); font-weight: 600; font-size: 0.87rem;
  border-left: 3px solid transparent; transition: var(--transition);
}
.admin-nav-item i { font-size: 1.15rem; width: 20px; text-align: center; }
.admin-nav-badge {
  margin-left: auto; background: var(--primary); color: white; font-size: 0.68rem; font-weight: 700;
  padding: 1px 7px; border-radius: 20px;
}
.admin-nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
.admin-nav-item.router-link-active {
  background: rgba(192,57,43,0.16); color: white; border-left-color: var(--primary);
}
.admin-nav-item.router-link-active i { color: var(--primary); }

.admin-sidebar-footer { padding: 14px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 3px; }

.admin-main { flex: 1; display: flex; flex-direction: column; margin-left: 260px; min-width: 0; }

.admin-topbar {
  height: 64px; background: white; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 24px; gap: 16px; position: sticky; top: 0; z-index: 50;
}
.admin-sidebar-toggle { display: none; font-size: 1.3rem; color: var(--text-light); }
.admin-topbar-spacer { flex: 1; }
.admin-topbar-user { display: flex; align-items: center; gap: 10px; }
.admin-topbar-avatar {
  width: 38px; height: 38px; border-radius: 50%; background: var(--primary); color: white;
  display: flex; align-items: center; justify-content: center; font-family: var(--font-main);
  font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
}
.admin-topbar-user-info { display: flex; flex-direction: column; line-height: 1.3; }
.admin-topbar-user-info strong { font-size: 0.85rem; color: var(--secondary); }
.admin-topbar-user-info span { font-size: 0.72rem; color: var(--text-muted); }

.admin-content { flex: 1; padding: 28px; max-width: 1400px; width: 100%; margin: 0 auto; }

@media (max-width: 992px) {
  .admin-sidebar { transform: translateX(-100%); }
  .admin-sidebar.open { transform: translateX(0); box-shadow: var(--shadow-lg); }
  .admin-sidebar-overlay { display: block; }
  .admin-main { margin-left: 0; }
  .admin-sidebar-toggle { display: block; }
  .admin-content { padding: 18px; }
}
</style>
