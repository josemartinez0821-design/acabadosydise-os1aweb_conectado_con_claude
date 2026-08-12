<script setup>
// RF10-RF12 - checkout en 3 pasos: dirección, pago, confirmación
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCotizacionesStore } from '../stores/cotizaciones'
import { formatCOP } from '../composables/useFormat'

const cart = useCartStore()
const router = useRouter()
const route = useRoute()
const cotizStore = useCotizacionesStore()

const paso = ref(1) // 1 dirección, 2 pago, 3 confirmar
const procesando = ref(false)
const resultado = ref(null) // 'exito' | 'error' | null
const pedidoConfirmado = ref(null)

const direccion = reactive({
  nombre: '',
  telefono: '',
  cedula: '',
  departamento: 'Huila',
  ciudad: '',
  direccionExacta: '',
  complemento: '',
  instrucciones: '',
})
const metodoEnvio = ref('estandar')

const metodoPago = ref('tarjeta')
const tarjeta = reactive({ numero: '', vencimiento: '', cvv: '', nombre: '' })

const costoEnvio = computed(() => (metodoEnvio.value === 'recogida' ? 0 : cart.total >= 150000 ? 0 : 8000))
const total = computed(() => cart.total + costoEnvio.value)

onMounted(() => {
  if (!cart.items.length && !resultado.value) {
    router.replace('/carrito')
  }
})

function irAPago() {
  paso.value = 2
}

function irAConfirmar() {
  paso.value = 3
}

async function confirmarPago() {
  procesando.value = true
  await new Promise((r) => setTimeout(r, 1400))
  procesando.value = false
  resultado.value = 'exito'
  pedidoConfirmado.value = {
    numero: `PED-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: total.value,
    metodo: metodoPago.value === 'tarjeta' ? `Tarjeta •••• ${tarjeta.numero.slice(-4) || '0000'}` : metodoPago.value,
  }
  cart.vaciarCarrito()

  // Si el pago viene de una cotización aprobada (botón "Proceder al Pago"), la marcamos como convertida.
  if (route.query.fromCotizacion) {
    cotizStore.actualizarEstado(Number(route.query.fromCotizacion), 'convertida_venta')
  }
}

function reintentar() {
  resultado.value = null
  paso.value = 2
}
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-topbar">
      <div class="checkout-topbar-inner">
        <span class="checkout-brand">ACABADOS 1A</span>
        <span class="checkout-secure"><i class="ri-lock-line"></i> Compra 100% segura</span>
        <RouterLink to="/carrito" class="checkout-close"><i class="ri-close-line"></i></RouterLink>
      </div>
    </div>

    <div class="checkout-body">
      <!-- RESULTADO -->
      <template v-if="resultado === 'exito'">
        <div class="text-center" style="max-width:480px;margin:0 auto;">
          <div class="result-icon success"><i class="ri-check-line"></i></div>
          <span class="badge badge-green mb-16">¡Pedido Exitoso!</span>
          <h2 class="section-title">¡Tu pedido fue confirmado!</h2>
          <p class="section-subtitle">Hemos recibido tu solicitud correctamente. Te enviaremos los detalles a tu correo registrado.</p>

          <div class="result-box">
            <div class="d-flex justify-between mb-16">
              <strong class="font-main">Detalles del pedido</strong>
              <span class="badge badge-green">Confirmado</span>
            </div>
            <p class="text-muted" style="font-size:0.78rem;">NÚMERO DE PEDIDO</p>
            <p class="mb-16 font-main fw-700">{{ pedidoConfirmado.numero }}</p>
            <p class="text-muted" style="font-size:0.78rem;">FECHA</p>
            <p class="mb-16">{{ pedidoConfirmado.fecha }}</p>
            <p class="text-muted" style="font-size:0.78rem;">TOTAL PAGADO</p>
            <p class="mb-16 text-primary font-main fw-800">{{ formatCOP(pedidoConfirmado.total) }}</p>
            <p class="text-muted" style="font-size:0.78rem;">MÉTODO</p>
            <p>{{ pedidoConfirmado.metodo }}</p>
          </div>

          <div class="d-flex gap-16" style="justify-content:center;flex-wrap:wrap;">
            <RouterLink to="/pedidos" class="btn btn-primary"><i class="ri-file-list-3-line"></i> Ver Historial de Pedidos</RouterLink>
            <RouterLink to="/productos" class="btn btn-outline-red"><i class="ri-store-line"></i> Seguir Comprando</RouterLink>
          </div>
        </div>
      </template>

      <!-- PROCESANDO -->
      <template v-else-if="procesando">
        <div class="text-center" style="max-width:420px;margin:80px auto;">
          <div class="result-icon" style="background:var(--light);color:var(--primary);">
            <i class="ri-loader-4-line" style="animation:spin 1s linear infinite;"></i>
          </div>
          <h2 class="section-title">Procesando tu pago...</h2>
          <p class="section-subtitle">Estamos verificando tu transacción de forma segura. No cierres esta ventana.</p>
        </div>
      </template>

      <!-- WIZARD -->
      <template v-else>
        <div class="steps">
          <div class="step" :class="{ active: paso === 1, done: paso > 1 }">
            <div class="step-dot" style="cursor:pointer;" @click="paso = 1"><i v-if="paso > 1" class="ri-check-line"></i><template v-else>1</template></div>
            <span class="step-label">Dirección</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: paso === 2, done: paso > 2 }">
            <div class="step-dot" :style="paso > 2 ? 'cursor:pointer;' : ''" @click="paso > 2 && (paso = 2)"><i v-if="paso > 2" class="ri-check-line"></i><template v-else>2</template></div>
            <span class="step-label">Pago</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: paso === 3 }">
            <div class="step-dot">3</div>
            <span class="step-label">Confirmar</span>
          </div>
        </div>

        <div class="checkout-layout">
          <div class="checkout-panel">
            <!-- PASO 1: DIRECCIÓN -->
            <template v-if="paso === 1">
              <h2 class="font-main fw-800 mb-24" style="font-size:1.4rem;">Dirección de entrega</h2>
              <form @submit.prevent="irAPago">
                <div class="form-group">
                  <label class="form-label required">Nombre completo</label>
                  <input v-model="direccion.nombre" class="form-control" required />
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                  <div class="form-group">
                    <label class="form-label required">Teléfono</label>
                    <input v-model="direccion.telefono" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Cédula / ID</label>
                    <input v-model="direccion.cedula" class="form-control" required />
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                  <div class="form-group">
                    <label class="form-label required">Departamento</label>
                    <input v-model="direccion.departamento" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Ciudad</label>
                    <input v-model="direccion.ciudad" class="form-control" placeholder="Ej. Pitalito" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label required">Dirección exacta</label>
                  <input v-model="direccion.direccionExacta" class="form-control" placeholder="Calle 5 # 12-34, Barrio Centro" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Complemento (opcional)</label>
                  <input v-model="direccion.complemento" class="form-control" placeholder="Apto, oficina, piso..." />
                </div>
                <div class="form-group">
                  <label class="form-label">Instrucciones de entrega</label>
                  <textarea v-model="direccion.instrucciones" class="form-control" rows="2"></textarea>
                </div>

                <h3 class="font-main fw-700 mb-16" style="font-size:1rem;">Método de envío</h3>
                <div class="d-flex gap-16 mb-24" style="flex-wrap:wrap;">
                  <label class="shipping-option" :class="{ selected: metodoEnvio === 'estandar' }">
                    <span><input v-model="metodoEnvio" type="radio" value="estandar" /> Envío estándar &middot; 3 a 5 días</span>
                    <strong>{{ cart.total >= 150000 ? 'Gratis' : '$8.000' }}</strong>
                  </label>
                  <label class="shipping-option" :class="{ selected: metodoEnvio === 'recogida' }">
                    <span><input v-model="metodoEnvio" type="radio" value="recogida" /> Recogida en tienda</span>
                    <strong class="text-primary">Gratis</strong>
                  </label>
                </div>

                <button type="submit" class="btn btn-primary btn-lg btn-block">Continuar al Método de Pago <i class="ri-arrow-right-line"></i></button>
              </form>
            </template>

            <!-- PASO 2: PAGO -->
            <template v-else-if="paso === 2">
              <h2 class="font-main fw-800 mb-24" style="font-size:1.4rem;">Método de pago</h2>
              <form @submit.prevent="irAConfirmar">
                <label class="payment-method" :class="{ selected: metodoPago === 'tarjeta' }">
                  <span class="payment-method-left"><input v-model="metodoPago" type="radio" value="tarjeta" /> Tarjeta de crédito o débito</span>
                  <i class="ri-bank-card-line"></i>
                </label>
                <div v-if="metodoPago === 'tarjeta'" style="padding:0 20px 16px;">
                  <div class="form-group">
                    <label class="form-label">Número de tarjeta</label>
                    <input v-model="tarjeta.numero" class="form-control" placeholder="•••• •••• •••• 4582" maxlength="19" />
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group">
                      <label class="form-label">Vencimiento</label>
                      <input v-model="tarjeta.vencimiento" class="form-control" placeholder="MM/YY" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">CVV</label>
                      <input v-model="tarjeta.cvv" class="form-control" placeholder="***" maxlength="4" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Nombre en la tarjeta</label>
                    <input v-model="tarjeta.nombre" class="form-control" />
                  </div>
                </div>

                <label class="payment-method" :class="{ selected: metodoPago === 'nequi' }">
                  <span class="payment-method-left"><input v-model="metodoPago" type="radio" value="nequi" /> Nequi</span>
                  <i class="ri-smartphone-line"></i>
                </label>
                <label class="payment-method" :class="{ selected: metodoPago === 'daviplata' }">
                  <span class="payment-method-left"><input v-model="metodoPago" type="radio" value="daviplata" /> Daviplata</span>
                  <i class="ri-wallet-3-line"></i>
                </label>
                <label class="payment-method" :class="{ selected: metodoPago === 'transferencia' }">
                  <span class="payment-method-left"><input v-model="metodoPago" type="radio" value="transferencia" /> Transferencia / Consignación</span>
                  <i class="ri-bank-line"></i>
                </label>

                <p class="text-muted mb-24" style="font-size:0.8rem;display:flex;align-items:center;gap:8px;margin-top:12px;">
                  <i class="ri-shield-check-line text-primary"></i> Tu información financiera está protegida con cifrado SSL de 256 bits.
                </p>

                <div class="d-flex gap-12">
                  <button type="button" class="btn btn-outline-red" @click="paso = 1"><i class="ri-arrow-left-line"></i> Volver</button>
                  <button type="submit" class="btn btn-primary btn-block">Revisar Pedido <i class="ri-arrow-right-line"></i></button>
                </div>
              </form>
            </template>

            <!-- PASO 3: CONFIRMAR -->
            <template v-else>
              <h2 class="font-main fw-800 mb-24" style="font-size:1.4rem;">Revisa tu pedido</h2>

              <div class="d-flex justify-between align-center mb-16">
                <strong class="font-main"><i class="ri-map-pin-line text-primary"></i> Dirección de entrega</strong>
                <a href="#" class="text-primary" style="font-size:0.85rem;" @click.prevent="paso = 1">Editar</a>
              </div>
              <p class="mb-24">{{ direccion.nombre }}<br />{{ direccion.direccionExacta }}<br />{{ direccion.ciudad }}, {{ direccion.departamento }}</p>

              <div class="d-flex justify-between align-center mb-16">
                <strong class="font-main"><i class="ri-bank-card-line text-primary"></i> Método de pago</strong>
                <a href="#" class="text-primary" style="font-size:0.85rem;" @click.prevent="paso = 2">Editar</a>
              </div>
              <p class="mb-24" style="text-transform:capitalize;">{{ metodoPago === 'tarjeta' ? `Tarjeta terminada en ${tarjeta.numero.slice(-4) || '----'}` : metodoPago }}</p>

              <strong class="font-main">Productos ({{ cart.cantidadTotal }})</strong>
              <div v-for="item in cart.items" :key="item.id_producto" class="cart-item">
                <div class="cart-item-img"><img :src="item.imagen_url" :alt="item.nombre" /></div>
                <div class="cart-item-info">
                  <div class="cart-item-name">{{ item.nombre }}</div>
                  <div class="cart-item-cat">Cantidad: {{ item.cantidad }}</div>
                </div>
                <div class="cart-item-price">{{ formatCOP(item.precio_venta * item.cantidad) }}</div>
              </div>

              <div class="d-flex gap-12 mt-20">
                <button type="button" class="btn btn-outline-red" @click="paso = 2"><i class="ri-arrow-left-line"></i> Volver</button>
                <button type="button" class="btn btn-primary btn-block" @click="confirmarPago">
                  <i class="ri-lock-line"></i> Confirmar y Pagar {{ formatCOP(total) }}
                </button>
              </div>
            </template>
          </div>

          <aside class="order-summary">
            <h3 class="font-main fw-800 mb-16">Resumen de compra</h3>
            <div v-for="item in cart.items" :key="item.id_producto" class="d-flex justify-between mb-16" style="font-size:0.85rem;">
              <span>{{ item.nombre }} <span class="text-muted">x{{ item.cantidad }}</span></span>
              <span class="fw-700">{{ formatCOP(item.precio_venta * item.cantidad) }}</span>
            </div>
            <div class="order-summary-row"><span>Subtotal</span><span>{{ formatCOP(cart.total) }}</span></div>
            <div class="order-summary-row"><span>Envío</span><span>{{ costoEnvio === 0 ? 'Gratis' : formatCOP(costoEnvio) }}</span></div>
            <div class="order-summary-row total"><span>Total</span><span class="value">{{ formatCOP(total) }}</span></div>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>
