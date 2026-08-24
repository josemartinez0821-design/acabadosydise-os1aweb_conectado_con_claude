package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    public enum TipoIdentificacion { CC, TI, CE, NIT, Pasaporte }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_identificacion")
    private TipoIdentificacion tipoIdentificacion;

    @Column(name = "numero_identificacion", unique = true, length = 20)
    private String numeroIdentificacion;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "telefono_alternativo", length = 20)
    private String telefonoAlternativo;

    @Column(name = "whatsapp", length = 20)
    private String whatsapp;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "ciudad", length = 100)
    private String ciudad;

    @Column(name = "departamento", length = 100)
    private String departamento;

    // Nunca se expone tal cual en un DTO de respuesta — ver UsuarioResponse.
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @Column(name = "estado")
    private Boolean estado;

    // Distinto de `estado` (activo/inactivo, genérico) - este es solo si ya confirmó su correo.
    // Mismo par código+vencimiento se reutiliza para verificar registro Y recuperar contraseña
    // (un usuario no hace las dos cosas a la vez); se limpia (null) apenas se usa con éxito.
    @Column(name = "email_verificado")
    private Boolean emailVerificado;

    @Column(name = "codigo_verificacion", length = 10)
    private String codigoVerificacion;

    @Column(name = "codigo_expiracion")
    private LocalDateTime codigoExpiracion;

    // Cuenta los intentos fallidos de validar el código actual - se resetea a 0 cada vez que se
    // asigna un código nuevo (AuthService.asignarNuevoCodigo) o se consume uno con éxito
    // (limpiarCodigo), así que siempre mide "fallos contra el código vigente", no un total histórico.
    @Column(name = "intentos_codigo", nullable = false)
    private Integer intentosCodigo;

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;
}
