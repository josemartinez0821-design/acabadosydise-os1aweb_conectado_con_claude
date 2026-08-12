<script setup>
import { computed } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import { useCartStore } from '../../stores/cart'
import { useToast } from '../../composables/useToast'
import { formatCOP } from '../../composables/useFormat'

const props = defineProps({
  producto: { type: Object, required: true },
})

const catalog = useCatalogStore()
const cart = useCartStore()
const { showToast } = useToast()

const promo = computed(() => catalog.getActivePromoForProduct(props.producto.id_producto))
const precioFinal = computed(() => {
  if (!promo.value) return props.producto.precio_venta
  return Math.round(props.producto.precio_venta * (1 - promo.value.descuento_porcentaje / 100))
})

function agregar() {
  const stock = catalog.getProductStock(props.producto.id_producto)
  if (stock === 0) {
    showToast('Producto agotado', 'danger')
    return
  }
  cart.agregarProducto(props.producto)
}
</script>

<template>
  <div class="product-card" :class="{ 'product-card-promo': promo }">
    <div class="product-card-img">
      <img :src="producto.imagen_url" :alt="producto.nombre" loading="lazy" />
      <div v-if="promo" class="product-card-badges">
        <span class="badge badge-green">
          <i class="ri-error-warning-fill"></i> ¡Promoción! -{{ promo.descuento_porcentaje }}%
        </span>
      </div>
      <div class="product-actions-hover">
        <button class="btn btn-primary btn-sm" @click="agregar">
          <i class="ri-shopping-cart-line"></i> Agregar
        </button>
        <RouterLink :to="`/productos/${producto.id_producto}`" class="btn btn-white btn-sm btn-icon">
          <i class="ri-eye-line"></i>
        </RouterLink>
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-category">{{ catalog.getCategoryName(producto.id_categoria) }}</div>
      <h3 class="product-name">{{ producto.nombre }}</h3>
      <p class="product-desc">{{ producto.descripcion }}</p>
      <div class="d-flex align-center gap-10">
        <span class="product-price">{{ formatCOP(precioFinal) }}</span>
        <span v-if="promo" class="product-price-old">{{ formatCOP(producto.precio_venta) }}</span>
      </div>
    </div>
    <div class="product-footer">
      <button class="btn btn-primary btn-sm" @click="agregar">
        <i class="ri-shopping-cart-line"></i> Carrito
      </button>
      <RouterLink :to="`/productos/${producto.id_producto}`" class="btn btn-outline-red btn-sm">Ver más</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.product-card-promo { border-color: var(--success); box-shadow: 0 0 0 1px var(--success); }
</style>
